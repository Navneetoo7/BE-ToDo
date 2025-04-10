import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Gender } from '../../enums/gender.enum';

export class SignupDto {
  @ApiProperty({
    required: true,
    description: "User's first name",
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    required: true,
    description: "User's last name",
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

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
    description: "User's phone number",
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    example: Gender.MALE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    required: true,
    description: 'Password for the account',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string;
}
