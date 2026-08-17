export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  message: string;
  interest: string | null;
  isRead: boolean;
  createdAt: string;
}
