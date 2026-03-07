import * as bcrypt from 'bcrypt';

export class BcryptUtil {
  private static readonly SALT_ROUNDS = 10;

  /**
   * Hash password
   */
  static async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare password
   */
  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
