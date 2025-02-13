import { Injectable } from '@nestjs/common';
import { UserType } from 'src/shared/constants/constants';

@Injectable()
export class AuthService {
  constructor() {}
  validateUser(brandId: any, user: any) {
    if (user?.user_type && user.user_type === 'user') {
      if (brandId == user?.id) {
        return true;
      }
    } else if (
      user?.type &&
      (user?.type === 'admin' || user?.type === 'superadmin' || user?.type === UserType.ADMIN)
    ) {
      return true;
    }
    return false;
  }
}
