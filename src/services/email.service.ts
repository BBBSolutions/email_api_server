import nodemailer from "nodemailer";
import { SmtpCfg, transporter, getTransporter } from "../config/mailConfig";

// parameters needed to send an email.
export interface SendMailParams {
  to: string;
  subject: string;
  htmlBody: string;
  from?: string;
  replyTo?: string;
  smtpCfg?: SmtpCfg;
}

export const sendMail = async (
  params: SendMailParams
): Promise<nodemailer.SentMessageInfo> => {
  const { to, subject, htmlBody, replyTo, smtpCfg } = params;

  // 1. Determine the "from" address
  const from =
    params.from || // 1. From the params
    smtpCfg?.from || // 2. From the site-specific SMTP config
    process.env.SMTP_FROM || // 3. From a global .env variable
    `"My Service" <${smtpCfg?.user || process.env.GMAIL_USER}>`; // 4. Default

  // 2. Choose the correct transporter
  const transport = smtpCfg ? getTransporter(smtpCfg) : transporter;

  // 3. Define the final mail options
  const mailOptions: nodemailer.SendMailOptions = {
    from,
    to,
    replyTo,
    subject,
    html: htmlBody, // Use the pre-built HTML
  };

  // 4. Send the email
  try {
    const info = await transport.sendMail(mailOptions);
    console.log(
      `Email sent successfully via ${
        (transport.options as any)?.auth?.user || "global"
      }:`,
      info.messageId
    );
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err; // Re-throw the error to be caught by the controller
  }
};
