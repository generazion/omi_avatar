export enum MessageSender {
  CLIENT = "client",
  AVATAR = "avatar",
}

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
}
