import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@decorator/skip-auth.decorator'
import { ClsService } from 'nestjs-cls';
import { MasterDataUserService } from '@/modules/user/service/master-data-user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private masterDataUserService: MasterDataUserService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private clsService: ClsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException({ detail: 'access token required'});
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('app.secret'),
      });
      const user = await this.masterDataUserService.getOne(payload.sub)
      this.clsService.set('user', user);
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException({ detail: 'access token required'});
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}