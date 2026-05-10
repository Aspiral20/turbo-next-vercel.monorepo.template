import { createTransport } from "nodemailer";
import { config } from "@/config";

export const mailTransporter = {
  noreply: createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SECURE === 'true',
    auth: {
      user: config.SMTP_NOREPLY_USER,
      pass: config.SMTP_PASS,
    },
  }),
}

// export const m