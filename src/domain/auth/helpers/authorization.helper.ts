import { User } from '@/shared/entities';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

class AuthorizationHelper {
  private readonly userRepository: any = Repository<User>;

  async EncryptPassword(password: string): Promise<string> {
    return bcrypt.genSalt(10, (err, salt) => {
      return bcrypt.hash(password, salt);
    });
  }

  async ComparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default AuthorizationHelper;
