/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserRole } from '../../../common/interfaces/user-role.enum';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';
import { diskStorage, Multer } from 'multer';
import { extname } from 'path';
import { User } from '@/modules/users/entities/user.entity';
import { Patient } from '../patient.entity';
// import { use } from 'react';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('/api/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({
    status: 201,
    description: 'Patient created successfully',
    type: PatientResponseDto,
  })
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  async create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User, // adjust type as needed
  ): Promise<Patient> {
    return this.patientService.create(createPatientDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients with optional filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all patients',
    type: [PatientResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  async findAll(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    const { patients, total } = await this.patientService.findAll(
      user,
      page,
      limit,
      search,
    );

    return {
      data: patients.map((patient) => new PatientResponseDto(patient)),
      meta: {
        total,
        page: page || 1,
        limit: limit || 10,
        totalPages: Math.ceil(total / (limit || 10)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return patient details',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    const patient = await this.patientService.findOne(id, user);
    return new PatientResponseDto(patient);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update patient by ID' })
  @ApiResponse({
    status: 200,
    description: 'Patient updated successfully',
    type: PatientResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: User,
  ) {
    const patient = await this.patientService.update(
      id,
      updatePatientDto,
      user,
    );
    return new PatientResponseDto(patient);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete patient by ID' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  @Roles(UserRole.ADMIN)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.patientService.remove(id, user);
    return { message: 'Patient deleted successfully' };
  }

  @Post(':id/photo')
  @ApiOperation({ summary: 'Upload patient profile photo' })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/photos',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
  async uploadPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Multer.File,
    @CurrentUser() user: User,
  ) {
    const photoUrl = `photos/${file.filename}`;
    const patient = await this.patientService.updatePhoto(id, photoUrl, user);
    return new PatientResponseDto(patient);
  }
}
