import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visit, VisitDocument } from './schemas/visit.schema';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Patient, PatientDocument } from '../patients/schemas/patient.schema';


@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
  ) {}

  async create(patientId: string, createVisitDto: CreateVisitDto): Promise<Visit> {
    const createdVisit = new this.visitModel({
      ...createVisitDto,
      patientId: new Types.ObjectId(patientId),
    });
  
    const savedVisit = await createdVisit.save();
    
    // Increment the patient's visit count
    await this.patientModel.findByIdAndUpdate(
      patientId,
      { $inc: { totalVisits: 1 } }
    );
  
    return savedVisit;
  }

  async getAllVisits(): Promise<Visit[]> {
    return this.visitModel.find().sort({ visitDate: -1 }).exec();
  }
  
  async getAllVisitsByPatientID(patientId: string): Promise<Visit[]> {
    return this.visitModel
      .find({ patientId: new Types.ObjectId(patientId) })
      .sort({ visitDate: -1 })
      .exec();
  }

  async getVisitByVisitId(id: string): Promise<Visit> {
    const visit = await this.visitModel.findById(id).exec();
    if (!visit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return visit;
  }

  async update(id: string, updateVisitDto: UpdateVisitDto): Promise<Visit> {
    const updatedVisit = await this.visitModel
      .findByIdAndUpdate(id, updateVisitDto, { new: true })
      .exec();
    
    if (!updatedVisit) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
    return updatedVisit;
  }

  async delete(id: string): Promise<void> {
    const result = await this.visitModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Visit with ID ${id} not found`);
    }
  }
}