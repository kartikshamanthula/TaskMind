import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import redis from '@/lib/redis';
import crypto from 'crypto';

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

    const { tasks, contextType, type, query } = await request.json(); 
    
    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: "No tasks provided" }, { status: 400 });
    }

    const taskData = tasks.map(t => ({
      id: t._id || t.id,
      title: t.title,
      description: t.description || t.note || "",
      priority: t.priority,
      dueDate: t.dueDate,
      status: t.column || (t.completed ? "Done" : "Pending"),
      createdAt: t.createdAt,
      completedAt: t.completedAt,
      subtasksCount: t.subtasks?.length || 0,
      completedSubtasks: t.subtasks?.filter(st => st.completed).length || 0,
      historyLength: t.history?.length || 0
    }));

    let prompt = "";
    if (type === 'decision') {
      prompt = `You are a premium AI Decision Assistant. Analyze this decision: "${query}".
      
      User's Current Context: ${JSON.stringify(taskData)}
      
      Provide a sophisticated analysis:
      1. Verdict: A clear recommendation (Buy, Wait, No, etc.)
      2. Pros & Cons: Bullet points.
      3. Productivity Impact: How this affects their current task load.
      4. Financial Impact: Analysis against their dues and savings goals.
      5. Goal Alignment: Does this align with their priorities?
      
      Return ONLY a JSON object in this format:
      {
        "verdict": "string",
        "pros": ["string"],
        "cons": ["string"],
        "productivityImpact": "string",
        "financialImpact": "string",
        "goalAlignment": "string"
      }`;
    } else if (type === 'reflection') {
      prompt = `You are a high-performance Productivity Auditor. 
      Analyze the following task data to generate a "What Did I Actually Do?" report.
      
      User Data: ${JSON.stringify(taskData)}
      
      Provide:
      1. productiveHours: Estimated total focused hours.
      2. hiddenWork: Insights into subtasks, updates, and "under-the-radar" progress.
      3. timeLeaks: Identify where time was wasted (e.g., tasks stuck, overdue).
      4. opportunities: 3 specific ways to improve tomorrow.
      5. score: A productivity score from 0-100.

      Return ONLY a JSON object in this format:
      {
        "productiveHours": 0.0,
        "hiddenWork": "string",
        "timeLeaks": "string",
        "opportunities": ["string"],
        "score": 85,
        "summary": "Overall reflection summary"
      }`;
    } else {
      prompt = `You are an expert AI ${contextType === 'finance' ? 'Financial Advisor' : 'Productivity Coach'}. 
      Analyze the following ${contextType} data and provide:
      ${contextType === 'finance' ? 
        `1. Budget Insights: Monthly burn rate and spending distribution.
         2. Financial Risks: Identify potential payment delays or budget overruns.
         3. Savings Suggestions: Where to cut costs or optimize subscriptions.` :
        `1. Priority Suggestion: Categorize each task into "Do First", "Can Wait", "Delegate", or "Ignore" based on urgency and importance.
         2. Risk Prediction: Identify tasks likely to be delayed, potential employee overload, or project failure risks.`
      }

      Data: ${JSON.stringify(taskData)}

      Return ONLY a JSON object in this exact format:
      {
        "priorities": {
          "taskId": { "category": "${contextType === 'finance' ? 'Budget Item' : 'Do First'}", "reasoning": "Quick explanation" }
        },
        "risks": {
          "taskId": { "riskLevel": "high", "prediction": "Prediction explanation", "suggestedAction": "What to do" }
        },
        "summary": "Overall ${contextType === 'finance' ? 'financial' : 'productivity'} advice"
      }
      `;
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Redis Caching Logic
    const cacheKey = `ai:${user.id}:${type || contextType}:${crypto.createHash('sha256').update(JSON.stringify(taskData)).digest('hex')}`;
    
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log("Redis Cache Hit: Returning cached AI analysis");
        return NextResponse.json(cachedData);
      }
    } catch (redisError) {
      console.error("Redis Cache Read Error:", redisError);
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    try {
      // Cache the result for 1 hour (3600 seconds)
      await redis.set(cacheKey, analysis, { ex: 3600 });
      console.log("Redis Cache Miss: Stored new AI analysis");
    } catch (redisError) {
      console.error("Redis Cache Write Error:", redisError);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to perform AI analysis" }, { status: 500 });
  }
}
