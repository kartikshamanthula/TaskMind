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

    const prompt = `I have a task titled: "${title}"
${description ? `The description is: "${description}"` : ""}

Generate a JSON array of 3 to 5 logical subtasks that would help complete this main task.
Return ONLY a valid JSON array of strings. Do not include markdown formatting or backticks around the JSON.
Example: ["Research the topic", "Write the draft", "Review the draft"]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a JSON-only API that outputs an array of strings representing subtasks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 200,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "[]";
    
    // Parse the JSON array safely
    let items = [];
    try {
      items = JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());
      if (!Array.isArray(items)) items = [];
    } catch (e) {
      console.error("Failed to parse Groq subtasks JSON:", responseText);
      items = ["Failed to generate subtasks"];
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Groq Breakdown Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
