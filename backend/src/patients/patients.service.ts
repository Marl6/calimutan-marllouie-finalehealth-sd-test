import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient, PatientDocument } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Visit, VisitDocument } from '../visits/schemas/visit.schema';


@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<PatientDocument>,
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
    
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const createdPatient = new this.patientModel(createPatientDto);
      return await createdPatient.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(search?: string): Promise<Patient[]> {
    const query = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    } : {};

    return this.patientModel
      .find(query)
      .sort({ dateCreated: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();
      
      if (!updatedPatient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }
      return updatedPatient;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.patientModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
  }

  async getPatientWithVisitCount(patientId: string) {
    const patient = await this.patientModel.findById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    
    const totalVisits = await this.visitModel.countDocuments({ patientId });
    
    return {
      ...patient.toObject(),
      totalVisits
    };
  }
}