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
  const { to, subject, htmlBody, replyTo, smtpCfg, from } = params;

  // Choose the correct transporter
  const transport = smtpCfg ? getTransporter(smtpCfg) : transporter;

  // Define the final mail options
  const mailOptions: nodemailer.SendMailOptions = {
    from,
    to,
    replyTo,
    subject,
    html: htmlBody, // Use the pre-built HTML
  };

  // Send the email
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
