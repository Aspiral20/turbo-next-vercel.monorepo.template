export type MessageFieldsType = {
  name: string
  message: string
}

export type SendMessageType = MessageFieldsType & {
  email: string
}