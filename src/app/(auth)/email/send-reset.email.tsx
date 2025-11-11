import { Resend } from "resend";
import { User } from "better-auth";
import { render } from "@react-email/components";
import ResetEmailTemplate from "./reset.template";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendResetEmail = async (user: User, url: string) => {
  const html = await render(<ResetEmailTemplate user={user} url={url} />);
  const text = await render(<ResetEmailTemplate user={user} url={url} />, { plainText: true });

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Reset your Bookmark Manager password",
    html,
    text,
  });
};
