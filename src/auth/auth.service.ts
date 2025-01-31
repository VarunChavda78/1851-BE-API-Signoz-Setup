import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}
  validateUser(brandId: any, user: any) {
    if (user?.user_type && user.user_type === 'user') {
      if (brandId == user?.id) {
        return true;
      }
    } else if (user?.type && (user?.type === 'admin' || user?.type === 'superadmin')) {
      return true;
    }
    return false;
  }
}
