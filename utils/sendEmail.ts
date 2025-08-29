import SibApiV3Sdk from '@getbrevo/brevo';

const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) throw new Error('BREVO_API_KEY is not set');

const client = SibApiV3Sdk.ApiClient.instance;
const apiKeyInstance = client.authentications['api-key'];
apiKeyInstance.apiKey = apiKey;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendOTPEmail(to: string, otp: string) {
  const sender = { email: process.env.BREVO_SENDER_EMAIL || 'no-reply@example.com', name: 'Note App' };
  const receivers = [{ email: to }];
  const subject = 'Your OTP Code';
  const htmlContent = `<p>Your OTP code is: <b>${otp}</b></p>`;

  try {
    await emailApi.sendTransacEmail({ sender, to: receivers, subject, htmlContent });
    return true;
  } catch (error) {
    console.error('Brevo email error:', error);
    return false;
  }
}
