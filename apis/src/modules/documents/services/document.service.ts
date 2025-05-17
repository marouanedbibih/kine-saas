// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { ConsentDocument } from '../consent-document.entity';
// import { UserDto } from '../../../common/interfaces/user.interface';
// import { UserRole } from '../../../common/interfaces/user-role.enum';
// import { PatientService } from '../../patient/services/patient.service';
// import { Multer } from 'multer';

// @Injectable()
// export class DocumentService {
//   constructor(
//     @InjectRepository(ConsentDocument)
//     private documentRepository: Repository<ConsentDocument>,
//     private patientService: PatientService,
//   ) {}

//   async uploadDocument(
//     patientId: string,
//     documentType: string,
//     file: Multer.File,
//     currentUser: UserDto,
//   ): Promise<ConsentDocument> {
//     // Check if user has access to this patient
//     const patient = await this.patientService.findOne(patientId, currentUser);

//     const document = this.documentRepository.create({
//       fileName: file.originalname,
//       fileType: file.mimetype,
//       filePath: `documents/${file.filename}`,
//       documentType,
//       patient,
//     });

//     return this.documentRepository.save(document);
//   }

//   async getPatientDocuments(
//     patientId: string,
//     currentUser: UserDto,
//   ): Promise<ConsentDocument[]> {
//     // Check if user has access to this patient
//     await this.patientService.findOne(patientId, currentUser);

//     return this.documentRepository.find({
//       where: { patient: { id: patientId } },
//       order: { uploadedAt: 'DESC' },
//     });
//   }

//   async getDocument(
//     id: string,
//     currentUser: UserDto,
//   ): Promise<ConsentDocument> {
//     const document = await this.documentRepository.findOne({
//       where: { id },
//       relations: ['patient'],
//     });

//     if (!document) {
//       throw new NotFoundException(`Document with ID ${id} not found`);
//     }

//     // Check if user has access to this patient's documents
//     if (
//       currentUser.role !== UserRole.ADMIN &&
//       document.patient.createdByUserId !== currentUser.id
//     ) {
//       throw new ForbiddenException(
//         `You don't have permission to access this document`,
//       );
//     }

//     return document;
//   }

//   async removeDocument(id: string, currentUser: UserDto): Promise<void> {
//     const document = await this.getDocument(id, currentUser);
//     await this.documentRepository.remove(document);
//   }
// }
