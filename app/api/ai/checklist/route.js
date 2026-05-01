import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getUser = async () => {
  const token = (await cookies()).get('token')?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    return null;
  }
};

export async function POST(request) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, description } = await request.json();
    
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const prompt = `Generate a concise 5-item task checklist for a project titled "${title}". 
    Context: ${description || 'No additional description'}.
    Return ONLY a JSON array of strings. No numbering, no extra text.
    Example: ["Set up environment", "Design UI", "Implement Auth"]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content;
    const checklistItems = JSON.parse(content.match(/\[.*\]/s)[0]);

    return NextResponse.json({ checklistItems });
  } catch (error) {
    console.error("AI Checklist Error:", error);
    return NextResponse.json({ error: "Failed to generate checklist" }, { status: 500 });
  }
}
