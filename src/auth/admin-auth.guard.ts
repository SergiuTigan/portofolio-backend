import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Users } from '../users/schemas/user.schema';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token not provided');
    }

    const token = authHeader.split(' ')[1];

    try {
      const user: Users = this.jwtService.decode(token);

      if (user.role !== 'admin') {
        throw new UnauthorizedException('User is not an admin');
      } else {
        return true;
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }
}
