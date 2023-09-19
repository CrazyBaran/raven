import { environment } from '../../../../../environments/environment';

export const html = (args: Record<string, string>): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Platform! Activate Your Account and Start Your Journey</title>
</head>
<body style="font-family: Arial, sans-serif; font-size: 14px; background-color: #f6f6f6; text-align: center; padding: 30px;">
  <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${environment.app.url}/assets/emails/logo.png" alt="Logo" />
    </div>
    <h1 style="font-weight: bold;">Welcome to the Platform!</h1>
    <p>You have been invited to use Raven.</p>
    <p>We are delighted to welcome you and excited to support you on your journey with us.</p>
    <p>To activate your account, please click the button below:</p>
    <p>
      <a href="${args['ACTIVATE_LINK']}&t=${
        args['ACTIVATE_TOKEN']
      }" style="display: inline-block; padding: 12px 24px; margin: 20px; background-color: #69c4b8; color: #ffffff; text-decoration: none; border-radius: 4px;">
      Activate Account
      </a>
    </p>
    <p>If you encounter any issues with the button, you can simply copy and paste the following URL into your browser:</p>
    <p>
      <a href="" style="color: #69c4b8; text-decoration: none;">${
        args['ACTIVATE_LINK']
      }&t=${args['ACTIVATE_TOKEN']}</a>
    </p>
    <p>
      If you have any questions or require further assistance, our team is here to help.
      Please don't hesitate to reach out to Seb at
      <a href="mailto:GPTsupport@curvestone.io?subject=${encodeURIComponent(
        'Re: Welcome to the Platform! Activate Your Account and Start Your Journey',
      )}" style="color: #69c4b8; text-decoration: none;">Ravensupport@curvestone.io</a>
    </p>
    <p>Best regards,</p>
    <p>The Raven Team</p>
    <div style="text-align: center; margin-top: 30px; color: #b3b9c1; font-size: 11px;">
      <p>55a Fermoy Road, London, W9 3NJ</p>
      <p>
        Raven is a Curvestone product.<br/>
        Curvestone is a trading name of Curved Stone Limited registered in England No 09249565.<br/>
        VAT Number: GB 279018677.
      </p>
    </div>
  </div>
</body>
</html>
`;

export const plain = (args: Record<string, string>): string => `
    Welcome to the Platform!\n
    \n
    You have been invited to use Raven.\n
    We are delighted to welcome you and excited to support you on your journey with us.\n
    To activate your account, please copy and paste the following URL into your browser:\n
    \n
    ${args['ACTIVATE_LINK']}&t=${args['ACTIVATE_TOKEN']}\n
    \n
    If you have any questions or require further assistance, our team is here to help.\n
    Please don't hesitate to reach out to Seb at Ravensupport@curvestone.io\n
    \n
    Best regards,\n
    The Raven Team
  `;
