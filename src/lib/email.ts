import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  // Create a transporter
  // Note: In a real app, you'd use environment variables for these
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'placeholder@example.com',
      pass: process.env.EMAIL_PASS || 'placeholder_pass',
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"PropertyCRM" <${process.env.EMAIL_FROM || 'noreply@propertycrm.com'}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    // We don't want to crash the whole process if email fails
    return { success: false, error };
  }
}
