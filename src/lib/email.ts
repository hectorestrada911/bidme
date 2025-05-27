import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewOfferEmail({ to, userName, requestTitle, offerAmount, offerMessage, offerUrl }: {
  to: string,
  userName: string,
  requestTitle: string,
  offerAmount: number,
  offerMessage: string,
  offerUrl: string
}) {
  await resend.emails.send({
    from: 'notifications@bidme.dev', // Use your verified sender or Resend's dev domain
    to,
    subject: 'You have a new offer on your request!',
    html: `
      <p>Hi ${userName},</p>
      <p>You just received a new offer for your request: <b>${requestTitle}</b>.</p>
      <p><b>Offer Amount:</b> $${offerAmount}<br/>
      <b>Message:</b> ${offerMessage}</p>
      <p><a href="${offerUrl}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">View Offer</a></p>
      <p>Thanks for using BidMe!</p>
    `
  });
} 