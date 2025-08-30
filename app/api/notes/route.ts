import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/utils/dbConnect';
import Note from '@/models/noteModel';
import User from '@/models/userModel';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    let user = await User.findOne({ email: session.user.email });
    
    // If user doesn't exist (e.g., Google sign-in user), create them
    if (!user) {
      user = new User({
        name: session.user.name || 'User',
        email: session.user.email,
        notes: []
      });
      await user.save();
    }

    const notes = await Note.find({ author: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/notes called');
    
    const session = await auth();
    console.log('Session:', session);
    
    if (!session?.user?.email) {
      console.log('No session or email');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, content } = await req.json();
    console.log('Request body:', { title, content });
    
    if (!title || !content) {
      console.log('Missing title or content');
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    await dbConnect();
    console.log('Database connected');
    
    let user = await User.findOne({ email: session.user.email });
    console.log('User found:', user?._id);
    
    // If user doesn't exist (e.g., Google sign-in user), create them
    if (!user) {
      console.log('User not found, creating new user');
      user = new User({
        name: session.user.name || 'User',
        email: session.user.email,
        notes: []
      });
      await user.save();
      console.log('New user created:', user._id);
    }

    const note = new Note({
      title,
      content,
      author: user._id,
    });

    console.log('Note object before save:', note);
    console.log('Note schema paths:', Object.keys(Note.schema.paths));

    await note.save();
    console.log('Note saved:', note._id);

    // Add note to user's notes array
    await User.findByIdAndUpdate(user._id, {
      $push: { notes: note._id }
    });
    console.log('User notes array updated');

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Error in POST /api/notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
