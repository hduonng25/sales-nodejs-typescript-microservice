import nodemailer from "nodemailer";
import { config } from "~/configs/config";

export const mails = nodemailer.createTransport({
  service: config.mails.service,
  auth: {
    user: config.mails.user,
    pass: config.mails.pass,
  },
});
