import {useServices} from '../../core/di/container';
import {UserCredentials, UserProfile} from '../domain/user';

export const useLoginUser = () => {
  const {authService} = useServices();

  const login = async (credentials: UserCredentials): Promise<UserProfile> => {
    return authService.login(credentials);
  };

  return {login};
};
