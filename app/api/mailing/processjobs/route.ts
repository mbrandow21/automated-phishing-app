import { NextRequest, NextResponse } from 'next/server';
import { processScheduledJobs } from '@/lib/emailScheduler';

export async function POST(req: NextRequest) {
  try {
    await processScheduledJobs();
    return NextResponse.json({ message: 'Scheduled jobs processed' }, { status: 200 });
  } catch (error) {
    console.error('Error processing jobs:', error);
    return new NextResponse('Error processing jobs', { status: 500 });
  }
}
