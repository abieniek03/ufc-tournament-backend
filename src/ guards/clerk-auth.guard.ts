import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new BadRequestException('Bearer token is required!');
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const client = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const userId = client.sub;
      request.headers['user-id'] = userId;

      return true;
    } catch (error) {
      console.error('Unauthorized error:', error);

      throw new UnauthorizedException('User does not authorized.');
    }
  }
}
