import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VisitDocument = Visit & Document;

export enum VisitType {
  HOME = 'Home',
  TELEHEALTH = 'Telehealth',
  CLINIC = 'Clinic',
}

@Schema({ timestamps: true })
export class Visit {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ required: true, type: Date })
  visitDate: Date;

  @Prop({ trim: true })
  notes: string;

  @Prop({ 
    required: true, 
    enum: Object.values(VisitType),
    type: String 
  })
  visitType: VisitType;

  @Prop({ default: Date.now })
  dateCreated: Date;

  @Prop({ default: Date.now })
  dateUpdated: Date;
}

export const VisitSchema = SchemaFactory.createForClass(Visit);

// Update dateUpdated on save
VisitSchema.pre('save', function(next) {
  this.dateUpdated = new Date();
  next();
});