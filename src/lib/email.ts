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
    from: 'onboarding@resend.dev', // Use Resend's test sender for now
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

export async function sendNewMessageEmail({ to, userName, messageContent, messageUrl }: {
  to: string,
  userName: string,
  messageContent: string,
  messageUrl: string
}) {
  await resend.emails.send({
    from: 'onboarding@resend.dev', // Use Resend's test sender for now
    to,
    subject: 'You have a new message on BidMe!',
    html: `
      <p>Hi ${userName},</p>
      <p>You just received a new message:</p>
      <blockquote style="background:#f4f4f4;padding:10px;border-radius:6px;">${messageContent}</blockquote>
      <p><a href="${messageUrl}" style="background:#2563eb;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;">View Message</a></p>
      <p>Thanks for using BidMe!</p>
    `
  })
} 