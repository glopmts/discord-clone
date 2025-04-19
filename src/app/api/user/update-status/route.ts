import { updateOnlineStatus } from '@/app/actions/user'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { status, userId } = await request.json()

  try {
    await updateOnlineStatus(userId, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}