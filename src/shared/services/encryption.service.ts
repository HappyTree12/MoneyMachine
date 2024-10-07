import * as crypto from 'node:crypto';

import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EncryptionService {
  private algorithm = 'aes-256-cbc';

  private key = process.env.AES_KEY ?? ''; // Replace with your own key

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.key, 'hex'), // Ensure correct encoding
        iv,
      );
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
      console.error('Encryption error:', error);

      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(text: string): string {
    try {
      const [ivHex, encryptedHex] = text.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encryptedData = Buffer.from(encryptedHex, 'hex');
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.key, 'hex'), // Ensure correct encoding
        iv,
      );
      let decrypted = decipher.update(encryptedData);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);

      throw new Error('Failed to decrypt data');
    }
  }
}
