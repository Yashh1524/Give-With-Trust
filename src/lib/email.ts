import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(to: string, ngoName: string) {
  try {
    const result = await resend.emails.send({
      from: 'GiveWithTrust <noreply@yashh1524.com>',
      to,
      subject: '🚨 Reminder: Upload Your Monthly Work Proof',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
          <div style="text-align: center; padding-bottom: 10px;">
            <h2 style="color: #2e7d32;">Give With Trust</h2>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${ngoName}</strong>,</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              This is a gentle reminder to <strong>upload your monthly work proof</strong> on the NGO Portal.
            </p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              Please make sure to submit it before the <strong>end of this month</strong> otherwise funds will be reallocate to other NGO.
            </p>
            <a href=${`http://localhost:3000/dashboard`} style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #2e7d32; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Upload Now
            </a>
            <p style="font-size: 14px; color: #777; margin-top: 30px;">
              If you've already submitted your proof, please ignore this email.
            </p>
            <p style="font-size: 15px; color: #444;">
              Best regards,<br/>
              <strong>NGO Platform Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (err) {
    console.error('Reminder Email error:', err);
    throw err;
  }
}
