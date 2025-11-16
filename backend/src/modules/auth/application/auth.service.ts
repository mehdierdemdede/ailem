import {Injectable} from '@nestjs/common';
import {UserEntity} from '../domain/user.entity';

@Injectable()
export class AuthService {
  async login(email: string, _password: string): Promise<UserEntity> {
    // Replace with real validation + token issuance
    return new UserEntity('demo-id', email, 'hashed-password', 'Demo User');
  }

  async register(email: string, _password: string, name: string): Promise<UserEntity> {
    return new UserEntity('new-id', email, 'hashed-password', name);
  }
}
