import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Simulate fetching user data (replace with actual database logic)
  const user = {
    id,
    name: 'John Doe',
    email: 'johndoe@example.com',
  };

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}