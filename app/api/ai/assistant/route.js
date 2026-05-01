import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function POST(req) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    const prompt = `You are a productivity expert and agile coach. 
I have a task titled: "${title}"
${description ? `The description is: "${description}"` : ""}

Please provide a concise, actionable, step-by-step plan (4-5 steps) to complete this task efficiently. Keep your response brief, professional, and directly applicable. Do not use markdown headers, just numbered lists.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a highly efficient project management assistant."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant", // Using an extremely fast Groq model
      temperature: 0.5,
      max_tokens: 300,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "I couldn't generate a plan at this time.";

    return NextResponse.json({ text: responseText.trim() });
  } catch (error) {
    console.error("Groq Assistant Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
