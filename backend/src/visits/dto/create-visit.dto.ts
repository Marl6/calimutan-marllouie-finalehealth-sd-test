import { IsEnum, IsNotEmpty, IsString, IsOptional, IsDateString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { VisitType } from '../schemas/visit.schema';

export class CreateVisitDto {
  @IsNotEmpty({ message: 'Visit date is required' })
  @IsDateString({}, { message: 'Visit date must be a valid date' })
  visitDate: Date;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Notes cannot exceed 500 characters' })
  @Transform(({ value }) => value?.trim())
  notes?: string;

  @IsNotEmpty({ message: 'Visit type is required' })
  @IsEnum(VisitType, { message: 'Visit type must be Home, Telehealth, or Clinic' })
  visitType: VisitType;
}