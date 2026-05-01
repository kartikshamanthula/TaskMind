import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const prompt = `Rewrite the following text to make it highly professional, clear, and grammatically correct. Fix any spelling errors and improve the tone. Keep the formatting (like bullet points or paragraphs) intact if possible.
    
Here is the text:
"""
${text}
"""

Return ONLY the rewritten text, without any introductory or concluding remarks.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert editor. You return only the polished text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 1000,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || text;

    return NextResponse.json({ text: responseText.trim() });
  } catch (error) {
    console.error("Groq Polish Error:", error);
    return NextResponse.json({ error: 'Failed to polish text' }, { status: 500 });
  }
}
