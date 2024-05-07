import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const adminPassword = request.headers['admin-password'];

    if (!adminPassword) {
      throw new BadRequestException('Admin password is required!');
    }

    try {
      if (adminPassword === process.env.ADMIN_PASSWORD) return true;
    } catch (error) {
      console.error('Unauthorized error:', error);

      throw new UnauthorizedException('User does not authorized.');
    }
  }
}
