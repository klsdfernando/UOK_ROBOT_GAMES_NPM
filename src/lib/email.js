import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send registration confirmation email
 */
export async function sendRegistrationEmail({ teamName, leaderName, leaderEmail }) {
  const dashboardUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    : 'https://ecsc-uok.com/dashboard';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="text-align: center; padding: 30px 0 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase;">
                UOK ROBOT GAMES
              </h1>
              <p style="margin: 8px 0 0; color: #004491; font-size: 12px; letter-spacing: 6px; text-transform: uppercase; font-weight: 700;">
                2K26 · REGISTRATION
              </p>
            </td>
          </tr>

          <!-- Blue accent line -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 2px; background: linear-gradient(90deg, transparent, #004491, transparent);"></div>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="text-align: center; padding: 30px 40px 10px;">
              <div style="display: inline-block; background-color: #052e16; border: 1px solid #16a34a40; border-radius: 50px; padding: 8px 24px;">
                <span style="color: #4ade80; font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase;">
                  ✓ REGISTRATION SUCCESSFUL
                </span>
              </div>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 20px 40px 10px;">
              <h2 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700;">
                Welcome, ${leaderName}!
              </h2>
              <p style="margin: 12px 0 0; color: #a1a1aa; font-size: 14px; line-height: 1.7;">
                Your team has been successfully registered for <strong style="color: #ffffff;">UOK Robot Games 2K26</strong>. 
                Below are your registration details.
              </p>
            </td>
          </tr>

          <!-- Registration Details Card -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border: 1px solid #27272a; border-radius: 8px;">
                <tr>
                  <td style="padding: 24px;">
                    <!-- Team Name -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px; color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Team Name</p>
                          <p style="margin: 0; color: #e4e4e7; font-size: 16px; font-weight: 600;">${teamName}</p>
                        </td>
                      </tr>
                    </table>
                    <!-- Leader Name -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 16px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px; color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Team Leader</p>
                          <p style="margin: 0; color: #e4e4e7; font-size: 16px; font-weight: 600;">${leaderName}</p>
                        </td>
                      </tr>
                    </table>
                    <!-- Email -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px; color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">Email</p>
                          <p style="margin: 0; color: #e4e4e7; font-size: 16px; font-weight: 600;">${leaderEmail}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Notice -->
          <tr>
            <td style="padding: 10px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1c0a0a; border: 1px solid #7f1d1d80; border-radius: 8px; border-top: 2px solid #ef4444;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 6px; color: #fca5a5; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;">
                      ⚠ Important Rule
                    </p>
                    <p style="margin: 0; color: #d4d4d8; font-size: 12px; line-height: 1.7;">
                      A team may participate in either <strong style="color: #ffffff;">Robot Battle</strong> or 
                      <strong style="color: #ffffff;">Robot Race</strong>, but <strong style="color: #fca5a5;">not both</strong>. 
                      Each participant may only belong to <strong style="color: #fca5a5;">one team</strong>. 
                      Failure to comply will result in <strong style="color: #fca5a5;">disqualification</strong>.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 20px 40px 10px;">
              <h3 style="margin: 0 0 12px; color: #ffffff; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                Next Steps
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                      <span style="color: #004491; font-weight: 700;">1.</span> Go to your <strong style="color: #ffffff;">Dashboard</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                      <span style="color: #004491; font-weight: 700;">2.</span> Select your event (<strong style="color: #ffffff;">Robot Battle</strong> or <strong style="color: #ffffff;">Robot Race</strong>)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0;">
                    <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                      <span style="color: #004491; font-weight: 700;">3.</span> Complete <strong style="color: #ffffff;">all remaining phases</strong> to finalize your registration
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="text-align: center; padding: 24px 40px 30px;">
              <a href="${dashboardUrl}" 
                 style="display: inline-block; background-color: #004491; color: #ffffff; text-decoration: none; padding: 14px 40px; font-size: 12px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; border-radius: 4px;">
                GO TO DASHBOARD →
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #27272a;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align: center; padding: 24px 40px;">
              <p style="margin: 0 0 6px; color: #52525b; font-size: 11px;">
                Electronics &amp; Computer Science Club (ECSC) · University of Kelaniya
              </p>
              <p style="margin: 0 0 12px; color: #52525b; font-size: 11px;">
                UOK Robot Games 2K26
              </p>
              <p style="margin: 0; color: #ef4444; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                ⛔ This is an automated email. Please do not reply.
              </p>
              <p style="margin: 6px 0 0; color: #71717a; font-size: 10px;">
                For inquiries, contact us at <a href="mailto:contact@ecsc-uok.com" style="color: #004491; text-decoration: underline;">contact@ecsc-uok.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: 'UOK Robot Games <robot-games@ecsc-uok.com>',
      to: [leaderEmail],
      subject: `✅ Registration Confirmed — ${teamName} | UOK Robot Games 2K26`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error };
    }

    console.log('Registration email sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email sending failed:', err);
    return { success: false, error: err.message };
  }
}
