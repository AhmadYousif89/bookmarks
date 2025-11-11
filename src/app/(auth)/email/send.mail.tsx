import { Resend } from "resend";
import { User } from "better-auth";
import { render } from "@react-email/components";
import VerfiEmailTemplate from "./verifi.template";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (user: User, url: string) => {
  const html = await render(<VerfiEmailTemplate user={user} url={url} />);
  const text = await render(<VerfiEmailTemplate user={user} url={url} />, { plainText: true });

  console.log("Sending verification email to:", user.email);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Verify your Bookmark Manager account",
    html,
    text,
  });
};
