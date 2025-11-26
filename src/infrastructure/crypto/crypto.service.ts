import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class CryptoService {
  async encrypt(data: string): Promise<string> {
    return hash(data, 7);
  }

  async decrypt(data: string, encryptedData: string): Promise<boolean> {
    return compare(data, encryptedData);
  }
}
