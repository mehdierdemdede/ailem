import {env} from '../config/env';
import {UserCredentials, UserProfile} from '../../features/auth/domain/user';

export class AuthService {
  private readonly baseUrl = env.apiBaseUrl;

  async login(credentials: UserCredentials): Promise<UserProfile> {
    // Placeholder for real HTTP call
    return Promise.resolve({
      id: 'demo-user',
      email: credentials.email,
      name: 'Demo User',
      token: 'mock-token',
    });
  }
}
