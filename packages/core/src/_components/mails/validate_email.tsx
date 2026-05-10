import React, { FC } from 'react';
import { MailStylesType } from "@/_types/mail.types";
import { Html, Text, Section, Container } from "@react-email/components";

type StylesType = MailStylesType<{
  mainSection: React.CSSProperties
}>

const styles: StylesType = {
  mainSection: {}
}

interface ValidateEmailProps {
  code: string
}

const ValidateEmail: FC<ValidateEmailProps> = ({
  code
}) => {
  return (
    <Html>
      <Section style={styles.mainSection}>
        <Container>
          <Text>Your validation code: {code}</Text>
        </Container>
      </Section>
    </Html>
  );
};

export default ValidateEmail;