import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PROTECTED_KEY } from './auth.decorator';
import { MysqldbService } from '../mysqldb/mysqldb.service';
import { UserType } from '../shared/constants/constants';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly mysqlDbService: MysqldbService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isProtected = this.reflector.get<boolean>(
      IS_PROTECTED_KEY,
      context.getHandler(),
    );

    if (!isProtected) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    let type = UserType.ADMIN;
    let user: any = await this.mysqlDbService.fetchUserByToken(token, null);
    if (!user) {
      user = await this.mysqlDbService.fetch1851BrandByToken(token);
      type = UserType.BRAND_1851;
    }

    if (user) {
      user.type = type;
    }
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    request.user = user;
    return true;
  }
}
