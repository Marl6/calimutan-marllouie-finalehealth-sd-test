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
  
  @Controller()
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
  
    @Get('patients/:patientId/visits')
    findByPatient(@Param('patientId') patientId: string) {
      return this.visitsService.findByPatient(patientId);
    }
  
    @Get('visits/:id')
    findOne(@Param('id') id: string) {
      return this.visitsService.findOne(id);
    }
  
    @Patch('visits/:id')
    update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
      return this.visitsService.update(id, updateVisitDto);
    }
  
    @Delete('visits/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
      return this.visitsService.remove(id);
    }
  }