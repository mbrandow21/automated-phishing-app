import { PrismaClient } from '@prisma/client';
import sendGridMail from '@sendgrid/mail';

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY!);

const prisma = new PrismaClient();

interface ScheduledJobs {
  [key: string]: NodeJS.Timeout;
}

const scheduledJobs: ScheduledJobs = {};

export const scheduleJob = async (companyId: string, subject: string, body: string, sendDate: string): Promise<string> => {
  const sendDateTime = new Date(sendDate).getTime();
  const currentTime = Date.now();
  const delay = sendDateTime - currentTime;

  if (delay <= 0) {
    throw new Error('Send date must be in the future');
  }

  const auditSchedule = await prisma.auditSchedule.create({
    data: {
      companyId,
      subject,
      body,
      sendDate: new Date(sendDate)
    }
  });

  const contacts = await prisma.contact.findMany({
    where: { companyId }
  });

  const emailDetails = contacts.map(contact => ({
    auditScheduleId: auditSchedule.id,
    contactId: contact.id,
    email: contact.email
  }));

  await prisma.emailDetail.createMany({ data: emailDetails });

  const task = setTimeout(async () => {
    await sendScheduledEmails(auditSchedule.id);
    delete scheduledJobs[auditSchedule.id];
  }, delay);

  scheduledJobs[auditSchedule.id] = task;
  return auditSchedule.id;
};

export const cancelJob = async (jobId: string): Promise<void> => {
  if (scheduledJobs[jobId]) {
    clearTimeout(scheduledJobs[jobId]);
    delete scheduledJobs[jobId];
  } else {
    throw new Error('Job not found');
  }

  await prisma.auditSchedule.delete({
    where: { id: jobId }
  });
};

const sendScheduledEmails = async (auditScheduleId: string): Promise<void> => {
  console.log(auditScheduleId)
  const emailDetails = await prisma.emailDetail.findMany({
    where: { auditScheduleId, sent: false },
    include: { contact: true }
  });

  const auditSchedule = await prisma.auditSchedule.findUnique({
    where: { id: auditScheduleId }
  });

  if (!auditSchedule) {
    console.error(`Audit schedule with id ${auditScheduleId} not found`);
    return;
  }

  for (const emailDetail of emailDetails) {
    const msg = {
      to: emailDetail.email,
      from: 'testing@dauntlessit.com', // Replace with your verified sender email
      subject: auditSchedule.subject,
      text: auditSchedule.body,
    };

    try {
      await sendGridMail.send(msg);
      await prisma.emailDetail.update({
        where: { id: emailDetail.id },
        data: {
          sent: true,
          sentAt: new Date()
        }
      });
      console.log(`Email sent to ${emailDetail.email}`);
    } catch (error) {
      console.error(`Error sending email to ${emailDetail.email}:`, error);
    }
  }
};

export const processScheduledJobs = async (): Promise<void> => {
  const currentTime = new Date();
  const auditSchedules = await prisma.auditSchedule.findMany({
    where: {
      sendDate: {
        gt: currentTime
      }
    }
  });


  for (const schedule of auditSchedules) {
    const delay = new Date(schedule.sendDate).getTime() - currentTime.getTime();
    console.log(delay)
    if (delay > 0) {
      const task = setTimeout(async () => {
        await sendScheduledEmails(schedule.id);
        delete scheduledJobs[schedule.id];
      }, delay);

      scheduledJobs[schedule.id] = task;
    }
  }
};
