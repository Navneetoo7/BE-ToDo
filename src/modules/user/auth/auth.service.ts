import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, LoginDto } from './DTOs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.userService.findUserByEmail(
      signupDto.email,
    );

    if (existingUser) {
      throw new UnauthorizedException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      ...user,
      access_token: token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
