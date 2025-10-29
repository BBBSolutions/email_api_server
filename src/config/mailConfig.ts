import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface SmtpCfg {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  from?: string;
  key?: string; // unique cache key for transporter
}

// transporter cache to avoid creating many transporters
const transportCache = new Map<string, nodemailer.Transporter>();

export function buildTransporter(cfg?: SmtpCfg): nodemailer.Transporter {
  const key = cfg?.key || cfg?.user || "global";

  if (transportCache.has(key)) return transportCache.get(key)!;

  // prefer explicit host/port/secure over `service: "gmail"`
  const host = cfg?.host || process.env.SMTP_HOST || "smtp.gmail.com";
  const port = cfg?.port ?? Number(process.env.SMTP_PORT ?? 465);
  const secure =
    typeof cfg?.secure === "boolean"
      ? cfg.secure
      : process.env.SMTP_SECURE === "true";
  const user = cfg?.user || process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = cfg?.pass || process.env.SMTP_PASS || process.env.GMAIL_PASS;

  const options: any = {
    host,
    port,
    secure,
  };

  if (user) options.auth = { user, pass };

  const transporter = nodemailer.createTransport(options);
  transportCache.set(key, transporter);

  return transporter;
}

// Backwards-compatible exported transporter (global default)
export const transporter = buildTransporter();

// Optional: verify the global transporter at startup (non-blocking)
transporter.verify((err, success) => {
  if (err) {
    console.error("Email service connection failed:", err);
  } else {
    console.log("Email service is ready to send messages:", success);
  }
});

export { transportCache, buildTransporter as getTransporter };
