import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './DTOs';
import { errorHandler, successHandler } from 'src/common/function';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: SignupDto,
  })
  async signup(@Body() signupDto: SignupDto) {
    try {
      const user = await this.authService.signup(signupDto);
      return successHandler(user, 'User registered successfully');
    } catch (e) {
      return errorHandler(e);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to get access token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: String, // Access token response
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const token = await this.authService.login(loginDto);
      return successHandler(token, 'Login successful');
    } catch (e) {
      return errorHandler(e);
    }
  }
}
