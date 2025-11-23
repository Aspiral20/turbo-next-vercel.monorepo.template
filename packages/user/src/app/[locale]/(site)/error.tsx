'use client'
import React from 'react';
import { ErrorPageLayout } from "@/_layouts";
import { ErrorComponent } from "next/dist/client/components/error-boundary";

const PageError: ErrorComponent = (props, deprecatedLegacyContext) => {
  return <ErrorPageLayout code={500} reset={props.reset}/>;
};

export default PageError;