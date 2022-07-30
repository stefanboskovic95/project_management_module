export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  userTypeId: number;
  token: string;
  expiresIn: number;
}