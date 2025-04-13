import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(to: string, ngoName: string) {
  try {
    const result = await resend.emails.send({
      from: 'GiveWithTrust <noreply@yashh1524.com>',
      to,
      subject: '🚨 Reminder: Upload Your Monthly Work Proof',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #f4fdfc; border-radius: 12px; border: 1px solid #cceeed;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/bNnQZ9DT/logo.png" alt="GiveWithTrust Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
            <h2 style="color: #007a78;">Friendly Reminder</h2>
          </div>

          <div style="background-color: #ffffff; padding: 20px 24px; border-radius: 10px; border: 1px solid #e0f1f1;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${ngoName}</strong>,</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              This is a quick reminder to <strong style="color: #007a78;">upload your monthly work proof</strong> on the NGO Portal.
            </p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              Please ensure it’s submitted before the <strong>end of this month</strong>. Failure to do so may result in fund reallocation to other NGOs.
            </p>

            <a href="${process.env.WEBSITE_LINK}/dashboard" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #00bfa5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Upload Now
            </a>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you've already submitted your proof, please ignore this email.
            </p>

            <p style="font-size: 15px; color: #444;">
              Thank you for your dedication,<br/>
              <strong>The GiveWithTrust Team</strong>
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


export async function sendNgoVerificationApprovedEmail(to: string, ngoName: string) {
  try {
    const result = await resend.emails.send({
      from: 'GiveWithTrust <noreply@yashh1524.com>',
      to,
      subject: '✅ You’re NGO is Now Verified on GiveWithTrust!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #f4fdfc; border-radius: 12px; border: 1px solid #cceeed;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/bNnQZ9DT/logo.png" alt="GiveWithTrust Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
            <h2 style="color: #007a78;">Welcome to GiveWithTrust</h2>
          </div>

          <div style="background-color: #ffffff; padding: 20px 24px; border-radius: 10px; border: 1px solid #e0f1f1;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${ngoName}</strong>,</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              We're excited to let you know that your NGO has been <strong style="color: #007a78;">officially verified</strong> on GiveWithTrust. 🎉
            </p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              You can now start receiving donations and showcasing your impact.
            </p>

            <a href="${process.env.WEBSITE_LINK}/dashboard" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #00bfa5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Need help or have questions? Just reply to this email — we’re here to support you.
            </p>

            <p style="font-size: 15px; color: #444;">
              Cheers,<br/>
              <strong>The GiveWithTrust Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (err) {
    console.error('Verification Approved Email error:', err);
    throw err;
  }
}

export async function sendNgoStatusAndAccentTagsUpadateEmail(
  to: string,
  ngoName: string,
  oldAccentTags: string,
  newAccentTags: string,
  oldStatus: string,
  newStatus: string
) {
  try {
    const changes: string[] = [];

    if (oldStatus !== newStatus) {
      changes.push(`<li><strong>Status:</strong> <span style="color: #007a78;">${oldStatus}</span> → <span style="color: #007a78;">${newStatus}</span></li>`);
    }

    if (oldAccentTags !== newAccentTags) {
      changes.push(`<li><strong>Accent Tags:</strong> <span style="color: #007a78;">${oldAccentTags}</span> → <span style="color: #007a78;">${newAccentTags}</span></li>`);
    }

    const result = await resend.emails.send({
      from: 'GiveWithTrust <noreply@yashh1524.com>',
      to,
      subject: '🔄 NGO Profile Update: Changes to Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: auto; background-color: #f4fdfc; border-radius: 12px; border: 1px solid #cceeed;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://i.postimg.cc/bNnQZ9DT/logo.png" alt="GiveWithTrust Logo" style="width: 80px; height: auto; margin-bottom: 10px;" />
            <h2 style="color: #007a78;">Profile Update Notice</h2>
          </div>

          <div style="background-color: #ffffff; padding: 20px 24px; border-radius: 10px; border: 1px solid #e0f1f1;">
            <p style="font-size: 16px; color: #333;">Hi <strong>${ngoName}</strong>,</p>
            <p style="font-size: 15px; color: #444; line-height: 1.6;">
              Your NGO profile on <strong>GiveWithTrust</strong> has been updated by our team. Please find the details of the changes below:
            </p>

            <ul style="font-size: 15px; color: #444; line-height: 1.8; padding-left: 20px;">
              ${changes.join("")}
            </ul>

            <a href="${process.env.WEBSITE_LINK}/dashboard" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #00bfa5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Your Dashboard
            </a>

            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you have any questions or believe these changes were made in error, please contact our support team.
            </p>

            <p style="font-size: 15px; color: #444;">
              With care,<br/>
              <strong>The GiveWithTrust Team</strong>
            </p>
          </div>
        </div>
      `,
    });

    return result;
  } catch (err) {
    console.error('Status/Tags Update Email error:', err);
    throw err;
  }
}
