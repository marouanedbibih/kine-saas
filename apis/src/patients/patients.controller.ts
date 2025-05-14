import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { QueryPatientsDto } from './dto/query-patients.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('api/patients')
@ApiBearerAuth()
@Controller('api/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ): Promise<PatientResponseDto> {
    return this.patientsService.create(createPatientDto, user.id, user.role);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ summary: 'Get all patients with pagination and search' })
  @ApiQuery({ type: QueryPatientsDto })
  @ApiResponse({
    status: 200,
    description: 'Patients retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(
    @Query() queryDto: QueryPatientsDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ) {
    return this.patientsService.findAll(queryDto, user.id, user.role);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ summary: 'Get a patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient retrieved successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ): Promise<PatientResponseDto> {
    return this.patientsService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ summary: 'Update a patient' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: { id: string; role: UserRole },
  ): Promise<PatientResponseDto> {
    return this.patientsService.update(
      id,
      updatePatientDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  @ApiOperation({ summary: 'Delete a patient' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 204, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: UserRole },
  ): Promise<void> {
    return this.patientsService.remove(id, user.id, user.role);
  }
}
