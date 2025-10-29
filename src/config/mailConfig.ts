import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface SmtpCfg {
  user?: string;
  pass?: string;
  key?: string; // unique cache key for transporter
}

// transporter cache to avoid creating many transporters
const transportCache = new Map<string, nodemailer.Transporter>();

export function buildTransporter(cfg?: SmtpCfg): nodemailer.Transporter {
  const key = cfg?.key || cfg?.user || "global";

  if (transportCache.has(key)) {
    return transportCache.get(key)!;
  }

  const user = cfg?.user || process.env.GMAIL_USER;
  const pass = cfg?.pass || process.env.GMAIL_PASS;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  console.log(`Creating new email transporter for: ${key}`);
  transportCache.set(key, transporter);

  return transporter;
}

// Backwards-compatible exported transporter (global default)
export const transporter = buildTransporter();

// Optional: verify the global transporter at startup (non-blocking)
transporter.verify((err, success) => {
  if (err) {
    console.error("Global email service connection failed:", err);
  } else {
    console.log("Global email service is ready to send messages:", success);
  }
});

export { transportCache, buildTransporter as getTransporter };
