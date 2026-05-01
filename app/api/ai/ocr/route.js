import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

import dbConnect from '@/lib/db';
import User from '@/models/User';

const getUser = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    await dbConnect();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    return user;
  } catch (e) {
    return null;
  }
};

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.permissions && user.permissions.canUseAI === false) {
      return NextResponse.json({ error: 'Access to AI features is restricted by Administrator.' }, { status: 403 });
    }

    const { image } = await request.json(); // data url
    
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const prompt = `You are a fast, intelligent image analysis AI. 
    Analyze the provided image and extract information based on its type.
    Is it a financial document (bill, receipt), a general text document (notes, letter), or a general photo/image?
    
    Extract the following details:
    1. Title: A concise, descriptive name summarizing the image (e.g., "Grocery Receipt", "Meeting Notes", "Nature Photo").
    2. Category: Determine the best category (Finance, Work, Personal, Health, Shopping, Utilities, etc).
    3. Note: A short description of the image content or transcribed text.

    If it is clearly a financial document (bill, receipt, invoice), ALSO extract:
    4. Amount: The total amount (number only, or null).
    5. Due Date: The deadline or date (YYYY-MM-DD format, or null).
    6. Merchant: The name of the company/store (string, or null).

    Return ONLY a JSON object in this exact format without markdown wrappers:
    {
      "title": "extracted title",
      "category": "Finance",
      "note": "Description or transcribed text",
      "amount": 100.50,
      "dueDate": "2024-05-30",
      "merchant": "merchant name"
    }
    Make sure to use null for amount, dueDate, and merchant if the image is NOT a financial document.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ]);

    let content = result.response.text();
    
    // Clean up markdown wrapping if present despite instructions
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
      const extractedData = JSON.parse(content);
      return NextResponse.json(extractedData);
    } catch (parseError) {
      console.error("Failed to parse JSON:", content);
      return NextResponse.json({ error: `AI returned invalid JSON: ${content}` }, { status: 500 });
    }
  } catch (error) {
    console.error("AI OCR Error:", error);
    return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
  }
}
