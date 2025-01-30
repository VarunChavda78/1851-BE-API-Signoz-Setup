import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PROTECTED_KEY } from './auth.decorator';
import { MysqldbService } from '../mysqldb/mysqldb.service';
import { UserType } from '../shared/constants/constants';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  private googlePublicKeys: { [key: string]: string } = {};
  private lastFetchTime = 0;

  constructor(
    private reflector: Reflector,
    private readonly mysqlDbService: MysqldbService,
  ) {
    this.fetchGooglePublicKeys();
  }

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
    if (!user) {
      try {
        const payload = await this.verifyGipToken(token);
        if (payload) {
          user = await this.mysqlDbService.fetchUserByGipId(payload.sub);
          type = UserType.ADMIN;
        }
      } catch (error) {
        console.log('error', error);

        // throw new UnauthorizedException('Invalid token');
      }
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
  private async verifyGipToken(token: string): Promise<any> {
    const decodedToken: any = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const kid = decodedToken.header.kid;
    let publicKey = this.googlePublicKeys[kid];

    if (!publicKey) {
      await this.fetchGooglePublicKeys();
      publicKey = this.googlePublicKeys[kid];
      if (!publicKey) {
        throw new Error('Public key not found');
      }
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        publicKey,
        {
          algorithms: ['RS256'],
          audience: process.env.GIP_PROJECT_ID, // Your GIP project ID
          issuer: `https://securetoken.google.com/${process.env.GIP_PROJECT_ID}`,
        },
        (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        },
      );
    });
  }

  private async fetchGooglePublicKeys() {
    if (Date.now() - this.lastFetchTime < 3600000) {
      // Cache for 1 hour
      return;
    }

    try {
      const response = await axios.get(
        'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com',
      );
      this.googlePublicKeys = response.data;
      this.lastFetchTime = Date.now();
    } catch (error) {
      console.error('Error fetching Google public keys:', error);
    }
  }
}
