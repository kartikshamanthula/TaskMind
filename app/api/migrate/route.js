import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

// One-time migration: drop the stale boardId_1 index from the boards collection
export async function GET() {
  await dbConnect();
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('boards');

    // Get existing indexes
    const indexes = await collection.indexes();
    const hasBoardIdIndex = indexes.some(idx => idx.name === 'boardId_1');

    if (hasBoardIdIndex) {
      await collection.dropIndex('boardId_1');
      return NextResponse.json({ success: true, message: 'Dropped stale boardId_1 index from boards collection.' });
    } else {
      return NextResponse.json({ success: true, message: 'No stale index found. Nothing to do.' });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
