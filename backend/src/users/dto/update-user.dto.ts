import { IsEmail, IsOptional, IsString, IsUUID, IsPhoneNumber, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsUUID('4', { message: 'ID must be a valid UUID v4.' })
  @IsOptional()
  id?: string;

  @IsString({ message: 'First name must be a string.' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsOptional()
  email?: string;

  @IsPhoneNumber('US', { message: 'Phone number must be a valid phone number.' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'Title must be a string.' })
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'Password must be at least 10 characters long',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/(?=.*[\W_])/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
