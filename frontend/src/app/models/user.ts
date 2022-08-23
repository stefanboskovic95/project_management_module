export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  type: string;
  token: string;
  expiresIn: number;
}
