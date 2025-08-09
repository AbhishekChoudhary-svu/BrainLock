import { sendEmail } from "@/lib/emailService"; 

export default async function sendEmailFun({ sendTo, subject, text, html }) {
  const result = await sendEmail(sendTo, subject, text, html);

  return result.success;
}


    