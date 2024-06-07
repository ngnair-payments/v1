import { IsEmail, IsNotEmpty, IsString, IsUUID, IsPhoneNumber, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsUUID('4', { message: 'ID must be a valid UUID v4.' })
  id: string;

  @IsNotEmpty({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  lastName: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty( { message: 'Email is required.' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsPhoneNumber('US', { message: 'Phone number must be a valid phone number.' })
  phone: string;

  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is Required.' })
  title: string;

  @IsNotEmpty()
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

