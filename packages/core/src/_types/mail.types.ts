import React from "react";

export type RenderMailType = React.ReactElement<any, string | React.JSXElementConstructor<any>>

export type MailStylesType<MailType> = Record<string, React.CSSProperties> & MailType