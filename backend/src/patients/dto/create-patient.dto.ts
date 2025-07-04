import { IsEmail, IsNotEmpty, IsString, IsDateString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePatientDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  @Length(2, 50, { message: 'First name must be between 2 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  @Length(2, 50, { message: 'Last name must be between 2 and 50 characters' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dob: Date;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString()
  @Length(10, 15, { message: 'Phone number must be between 10 and 15 characters' })
  @Transform(({ value }) => value?.trim())
  phoneNumber: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  @Length(5, 200, { message: 'Address must be between 5 and 200 characters' })
  @Transform(({ value }) => value?.trim())
  address: string;
}