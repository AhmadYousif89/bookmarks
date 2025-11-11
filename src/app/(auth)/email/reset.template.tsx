import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { User } from "better-auth";

type VerfiEmailProps = {
  user: User;
  url: string;
};

const logoSrc = process.env.NEXT_PUBLIC_LOGO_URL;

export const ResetEmailTemplate = ({ user, url }: VerfiEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>Reset your Bookmark Manager password</Preview>
      <Container style={container}>
        <div style={image}>
          <Img
            src={logoSrc}
            alt="Bookmark Manager"
            width={214}
            height={"auto"}
            style={{ display: "block" }}
          />
        </div>
        <Text style={paragraph}>Hi {user.name || "there"},</Text>
        <Text style={paragraph}>
          We received a request to reset your password. Click the button below to proceed.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={url} rel="noopener noreferrer" target="_blank">
            Reset Password
          </Button>
        </Section>
        <Text style={paragraph}>
          This password reset link will expire in 10 minutes. If you did not request a password
          reset, please ignore this email.
        </Text>
        <Text style={paragraph}>
          Best,
          <br />
          The Bookmark Manager Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          This email was sent to {user.email}. If you did not create an account, please ignore.
        </Text>
        <Text style={footer}>© 2025 Bookmark Manager. All rights reserved.</Text>
      </Container>
    </Body>
  </Html>
);

export default ResetEmailTemplate;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#FFF",
};

const image = { backgroundColor: "#ffffff", width: "fit-content" };

const paragraph = {
  fontSize: "14px",
  lineHeight: "22px",
};

const btnContainer = {
  display: "flex",
  textAlign: "center" as const,
};

const button = {
  width: "fit-content",
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
