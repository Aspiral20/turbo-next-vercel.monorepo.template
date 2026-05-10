'use client'
import React from 'react';
import { ERROR_STATUSES } from "@/utils/constants/statuses";
import { ErrorPageLayout } from "@/_layouts";

// https://colorlib.com/wp/free-404-error-page-templates/ > https://colorlib.com/etc/404/colorlib-error-404-6/

const PageError = ({}) => {
  return <ErrorPageLayout code={ERROR_STATUSES.SERVER_SIDE.code}/>;
};

export default PageError;