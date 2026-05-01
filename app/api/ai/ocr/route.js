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

    const prompt = `You are a specialized OCR and data extraction AI. 
    Analyze the provided image of a bill or receipt and extract:
    1. Title: A short descriptive name (e.g., "Electricity Bill Jan").
    2. Amount: The total amount due (number only).
    3. Due Date: The deadline for payment (YYYY-MM-DD format).
    4. Merchant: The name of the company.
    5. Category: One of (Finance, Utilities, Shopping, Health, Food, Transport).

    Return ONLY a JSON object in this exact format without any markdown wrappers:
    {
      "title": "extracted title",
      "amount": 100.50,
      "dueDate": "2024-05-30",
      "merchant": "merchant name",
      "category": "Finance"
    }
    `;

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

    const content = result.response.text();
    const extractedData = JSON.parse(content);

    return NextResponse.json(extractedData);
  } catch (error) {
    console.error("AI OCR Error:", error);
    return NextResponse.json({ error: "Failed to process image with Gemini" }, { status: 500 });
  }
}
