import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import { VisitsService } from './visits.service';
  import { CreateVisitDto } from './dto/create-visit.dto';
  import { UpdateVisitDto } from './dto/update-visit.dto';
  
  @Controller('visits')
  export class VisitsController {
    constructor(private readonly visitsService: VisitsService) {}
  
    @Post('patients/:patientId/visits')
    @HttpCode(HttpStatus.CREATED)

    create(
      @Param('patientId') patientId: string,
      @Body() createVisitDto: CreateVisitDto,
    ) {
      return this.visitsService.create(patientId, createVisitDto);
    }

    @Get()
    getAllVisits() {
      return this.visitsService.getAllVisits();
    }
  
    @Get('patients/:patientId/visits')
    getAllVisitsByPatientID(@Param('patientId') patientId: string) {
      return this.visitsService.getAllVisitsByPatientID(patientId);
    }
  
    @Get(':id')
    getVisitByVisitId(@Param('id') id: string) {
      return this.visitsService.getVisitByVisitId(id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
      return this.visitsService.update(id, updateVisitDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: string) {
      return this.visitsService.delete(id);
    }
  }