import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

const transactionalEmailsApi = new TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) throw new Error('BREVO_API_KEY is not set');
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

export async function sendOTPEmail(to: string, otp: string) {
  try {
    const result = await transactionalEmailsApi.sendTransacEmail({
      to: [
        { email: to },
      ],
      subject: 'Your OTP Code',
      htmlContent: `<p>Your OTP code is: <b>${otp}</b></p>`,
      textContent: `Your OTP code is: ${otp}`,
      sender: {
        email: process.env.BREVO_SENDER_EMAIL || 'your_verified_email@domain.com',
        name: 'Note App',
      },
    });
    console.log('Email sent! Message ID:', result.body.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}