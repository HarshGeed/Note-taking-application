import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/utils/dbConnect';
import Note from '@/models/noteModel';
import User from '@/models/userModel';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const note = await Note.findOne({ _id: params.id, author: user._id });
    if (!note) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    await Note.findByIdAndDelete(params.id);

    // Remove note from user's notes array
    await User.findByIdAndUpdate(user._id, {
      $pull: { notes: params.id }
    });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
