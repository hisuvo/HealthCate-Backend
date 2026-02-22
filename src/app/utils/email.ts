/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import AppError from "../errorHalper/AppError";
import status from "http-status";
import path from "node:path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

interface ISendEmailOption {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, unknown>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailOption) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/template/${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateData);

    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => {
        return {
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
        };
      }),
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error: any) {
    console.log("Email sending error:", error?.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};
