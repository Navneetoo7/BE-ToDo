import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { BaseEntity } from 'src/common/entities/base.entity';
import { UserService } from 'src/modules/user/user.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);
  
      if (!token) {
      throw new UnauthorizedException();
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token);
  
      BaseEntity.setUserId(payload.userId);
  
        const user = await this.userService.findOne(payload.userId);
  
        if (!user) {
          throw new UnauthorizedException();
        }
  
        request.user = user;
      } catch (error) {
      console.error('AuthGuard error:', error); // Log the error
        throw new UnauthorizedException();
    }
      return true;
    }
  
    private extractToken(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  