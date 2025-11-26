export interface IToken {
  id: string;
  isActive: boolean;
  role: string;
  iat?: any;
  exp?: any;
}
