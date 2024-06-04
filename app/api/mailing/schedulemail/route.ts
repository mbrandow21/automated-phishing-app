import { NextRequest, NextResponse } from 'next/server';
import { scheduleJob, cancelJob } from '@/lib/emailScheduler';

export async function POST(req: NextRequest) {
  try {
    const { companyId, subject, body, sendDate } = await req.json();

    if (!companyId || !subject || !body || !sendDate) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    const jobId = await scheduleJob(companyId, subject, body, sendDate);
    return NextResponse.json({ message: 'Email scheduled', jobId }, { status: 200 });
  } catch (error) {
    console.error('Error scheduling email:', error);
    return new NextResponse('Error scheduling email', { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    if (!jobId) {
      return new NextResponse('Invalid request', { status: 400 });
    }

    await cancelJob(jobId);
    return NextResponse.json({ message: 'Email cancelled' }, { status: 200 });
  } catch (error) {
    console.error('Error cancelling email:', error);
    return new NextResponse('Error cancelling email', { status: 500 });
  }
}
