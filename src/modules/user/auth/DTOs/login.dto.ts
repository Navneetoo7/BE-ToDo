import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: "User's password",
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
