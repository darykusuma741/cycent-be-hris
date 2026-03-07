import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UserPayload } from './user.payload';
import { Reflector } from '@nestjs/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { IS_SKIP_AUTH_KEY } from '@common/decorator/public.decorator';
import { ROLES_KEY } from '@common/config/role.decorator';
import { RoleEnum } from '@common/config/role.enum';
import { JWT_CONST } from '@common/config/constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_SKIP_AUTH_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request & { user?: UserPayload }>();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Invalid token');

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.find((e) => e == RoleEnum.ALL) || requiredRoles.length == 0) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_CONST.secret,
      });

      request.user = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }

    // Jika tidak butuh role khusus, izinkan saja
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Cek apakah role user sesuai
    if (requiredRoles.some((role) => request.user.roles.includes(role))) {
      return true;
    }

    this.logger.error('LIMITED BY ROLE');
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
