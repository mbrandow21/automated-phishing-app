// lib/emailScheduler.ts

import sendGridMail from '@sendgrid/mail';

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface ScheduledJobs {
  [key: string]: NodeJS.Timeout;
}

const scheduledJobs: ScheduledJobs = {};

export const scheduleJob = (email: string, subject: string, body: string, sendDate: string): string => {
  const jobId = `${email}-${sendDate}`;
  const sendDateTime = new Date(sendDate).getTime();
  const currentTime = Date.now();
  const delay = sendDateTime - currentTime;

  if (delay <= 0) {
    throw new Error('Send date must be in the future');
  }

  const task = setTimeout(() => {
    sendEmail(email, subject, body);
    delete scheduledJobs[jobId];
  }, delay);

  scheduledJobs[jobId] = task;
  return jobId;
};

export const cancelJob = (jobId: string): void => {
  if (scheduledJobs[jobId]) {
    clearTimeout(scheduledJobs[jobId]);
    delete scheduledJobs[jobId];
  } else {
    throw new Error('Job not found');
  }
};

const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  const msg = {
    to,
    from: 'testing@dauntlessit.com', // Replace with your verified sender email
    subject,
    text,
  };

  try {
    await sendGridMail.send(msg);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};
