import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { Visit, VisitSchema } from './schemas/visit.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Visit.name, schema: VisitSchema },
      { name: Patient.name, schema: PatientSchema },
    ]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}