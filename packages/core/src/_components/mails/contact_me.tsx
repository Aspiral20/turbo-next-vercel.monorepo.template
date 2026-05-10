import React, { FC } from 'react';
import { Html, Section, Container } from "@react-email/components";
import { SendMessageType } from "@/_types/contacts.types";
import { MailStylesType } from "@/_types/mail.types";

type StylesType = MailStylesType<{
  mainSection: React.CSSProperties
  contentContainer: React.CSSProperties
  mainPaperContainer: React.CSSProperties
  mainPaperTitle: React.CSSProperties
  mainPaperText: React.CSSProperties
}>

const styles: StylesType = {
  mainSection: {
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    margin: "0 auto",
    padding: "20px 0 48px",
    width: "580px",
  },
  mainPaperContainer: {
    color: '#484848'
  },
  mainPaperTitle: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: 700,
  },
  mainPaperText: {
    fontSize: 18,
  },
}

interface ContactMeProps {
  contact: SendMessageType
}

const ContactMe: FC<ContactMeProps> = ({
  contact
}) => {
  return (
    <Html>
      <Section style={styles.mainSection}>
        <Container style={styles.contentContainer}>
          <div style={styles.mainPaperContainer}>
            <p style={styles.mainPaperTitle}>
              Person {"'"}{contact.name}{"'"} with email {"'"}{contact.email}{"'"} sent message:
            </p>
            <p style={styles.mainPaperText}>
              {contact.message}
            </p>
          </div>
        </Container>
      </Section>
    </Html>
  );
};

export default ContactMe;