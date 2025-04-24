import crypto from 'crypto';
import { config } from '../config/config';

class EncryptionService {
  private static instance: EncryptionService;
  private algorithm: string = 'aes-256-gcm';
  private key: Buffer;
  private ivLength: number = 16;
  private saltLength: number = 64;
  private tagLength: number = 16;
  private tagPosition: number = this.saltLength;
  private encryptedPosition: number = this.tagPosition + this.tagLength;

  private constructor() {
    this.key = crypto.scryptSync(config.encryptionKey, 'salt', 32);
  }

  public static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const salt = crypto.randomBytes(this.saltLength);

    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return Buffer.concat([salt, tag, encrypted]).toString('base64');
  }

  public decrypt(encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');

    const salt = buffer.slice(0, this.saltLength);
    const tag = buffer.slice(this.tagPosition, this.encryptedPosition);
    const encrypted = buffer.slice(this.encryptedPosition);

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, salt);
    decipher.setAuthTag(tag);

    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]).toString('utf8');
  }

  public hash(text: string): string {
    return crypto
      .createHash('sha256')
      .update(text)
      .digest('hex');
  }
}

export const encryptionService = EncryptionService.getInstance(); 