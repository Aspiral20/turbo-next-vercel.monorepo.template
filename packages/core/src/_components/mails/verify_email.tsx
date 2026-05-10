import React, { FC } from 'react';
import { Html, Section, Container, Text, Button, Hr } from '@react-email/components';
import { MailStylesType } from '@/_types/mail.types';

type StylesType = MailStylesType<{
  section: React.CSSProperties;
  container: React.CSSProperties;
  title: React.CSSProperties;
  body: React.CSSProperties;
  button: React.CSSProperties;
  hr: React.CSSProperties;
  footer: React.CSSProperties;
}>;

const styles: StylesType = {
  section: { backgroundColor: '#f9fafb' },
  container: { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' },
  title: { fontSize: 24, fontWeight: 700, color: '#111827', textAlign: 'center', marginBottom: 8 },
  body: { fontSize: 15, color: '#6b7280', lineHeight: '24px', textAlign: 'center', marginBottom: 32 },
  button: {
    backgroundColor: '#1A6FFF',
    color: '#ffffff',
    padding: '12px 32px',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
  },
  hr: { borderColor: '#e5e7eb', margin: '32px 0' },
  footer: { fontSize: 12, color: '#9ca3af', textAlign: 'center' },
};

interface VerifyEmailProps {
  verifyUrl: string;
  name?: string;
}

const VerifyEmail: FC<VerifyEmailProps> = ({ verifyUrl, name }) => (
  <Html>
    <Section style={styles.section}>
      <Container style={styles.container}>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.body}>
          {name ? `Hi ${name}, ` : ''}Welcome to SyncLead! Click the button below to verify your email address.
          This link expires in <strong>24 hours</strong>.
        </Text>

        <Button href={verifyUrl} style={styles.button}>
          Verify Email Address
        </Button>

        <Hr style={styles.hr} />

        <Text style={styles.footer}>
          If you didn't create a SyncLead account, you can safely ignore this email.
        </Text>
      </Container>
    </Section>
  </Html>
);

export default VerifyEmail;
