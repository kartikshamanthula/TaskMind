import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RegularTask from '@/models/RegularTask';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const getUser = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (e) {
    console.error('Auth error:', e.message);
    return null;
  }
};

export async function GET(request) {
  try {
    await dbConnect();
    const user = await getUser();
    if (!user || !user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const tasks = await RegularTask.find({ userId: user.id }).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error('GET Regular Tasks Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const user = await getUser();
    if (!user || !user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    if (!data || !data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    const taskData = {
      ...data,
      userId: user.id,
    };

    const task = await RegularTask.create(taskData);
    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error('POST Regular Task Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const user = await getUser();
    if (!user || !user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    // Get current task state to check if completion changed
    const currentTask = await RegularTask.findOne({ _id: id, userId: user.id });
    if (!currentTask) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    const isNewlyCompleted = !currentTask.completed && updates.completed === true;

    const task = await RegularTask.findOneAndUpdate(
      { _id: id, userId: user.id },
      updates,
      { new: true }
    );

    let xpGained = 0;
    let newUserData = null;

    if (isNewlyCompleted) {
      xpGained = 50;
      const userDoc = await User.findById(user.id);
      if (userDoc) {
        userDoc.xp = (userDoc.xp || 0) + xpGained;
        userDoc.level = Math.floor(userDoc.xp / 500) + 1;
        await userDoc.save();
        newUserData = { xp: userDoc.xp, level: userDoc.level };
      }

      // Handle Recurrence
      if (task.recurring?.enabled) {
        const nextDueDate = new Date(task.dueDate || new Date());
        if (task.recurring.frequency === 'daily') nextDueDate.setDate(nextDueDate.getDate() + 1);
        else if (task.recurring.frequency === 'weekly') nextDueDate.setDate(nextDueDate.getDate() + 7);
        else if (task.recurring.frequency === 'monthly') nextDueDate.setMonth(nextDueDate.getMonth() + 1);

        await RegularTask.create({
          title: task.title,
          note: task.note,
          category: task.category,
          priority: task.priority,
          dueDate: nextDueDate,
          tags: task.tags,
          starred: task.starred,
          userId: user.id,
          recurring: task.recurring,
          financeDetails: task.financeDetails,
          isMyDay: false
        });
      }
    }

    return NextResponse.json({ task, xpGained, user: newUserData }, { status: 200 });
  } catch (error) {
    console.error('PUT Regular Task Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const user = await getUser();
    if (!user || !user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });

    const task = await RegularTask.findOneAndDelete({ _id: id, userId: user.id });

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('DELETE Regular Task Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
