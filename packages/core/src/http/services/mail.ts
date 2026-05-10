import { render } from "@react-email/render";
import { ContactMe, ValidateEmail, ResetPassword, VerifyEmail } from "@/_components/mails";
import { SendMessageType } from "@/_types/contacts.types";
import { genRandomString } from "@/utils/helpers/generators";
import { GENERATOR_VARIANTS } from "@/utils/constants/generators";
import { RenderMailType } from "@/_types/mail.types";
import { mailTransporter } from "@/lib/mail";
import { config } from "@/config";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function sendValidationEmail(email: string) {

  const validationCode = genRandomString(6, GENERATOR_VARIANTS.NUMBER_POSITIVE_CHARS)

  const options: Mail.Options & Partial<SMTPTransport.Options> = {
    from: config.SMTP_NOREPLY_FROM,
    to: email,
    subject: `Validate your Email`, // TODO: make it better
    html: await render(ValidateEmail({ code: validationCode }) as RenderMailType)
  }

  return { validationCode, mailRes: await mailTransporter.noreply.sendMail(options) }
}

export async function sendResetPasswordEmail(email: string, resetUrl: string) {
  const options: Mail.Options & Partial<SMTPTransport.Options> = {
    from: config.SMTP_NOREPLY_FROM,
    to: email,
    subject: 'Reset your SyncLead password',
    html: await render(ResetPassword({ resetUrl }) as RenderMailType),
  };
  return mailTransporter.noreply.sendMail(options);
}

export async function sendEmailVerification(email: string, name: string, verifyUrl: string) {
  const options: Mail.Options & Partial<SMTPTransport.Options> = {
    from: config.SMTP_NOREPLY_FROM,
    to: email,
    subject: 'Verify your email',
    html: await render(VerifyEmail({ verifyUrl, name }) as RenderMailType),
  };
  return mailTransporter.noreply.sendMail(options);
}

export async function sendContactMail(contact: SendMessageType) {
  const { email } = contact

  const options: Mail.Options & Partial<SMTPTransport.Options> = {
    from: config.SMTP_NOREPLY_FROM,
    to: email,
    subject: `Message from ${contact.name}`,
    html: await render(ContactMe({ contact }) as RenderMailType)
  }
  return await mailTransporter.noreply.sendMail(options)
}