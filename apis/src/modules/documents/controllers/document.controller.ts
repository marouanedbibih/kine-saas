// /* eslint-disable @typescript-eslint/no-unsafe-return */
// /* eslint-disable @typescript-eslint/no-unsafe-argument */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import {
//   Controller,
//   Get,
//   Post,
//   Delete,
//   Param,
//   UseGuards,
//   UseInterceptors,
//   UploadedFile,
//   ParseUUIDPipe,
//   Body,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import {
//   ApiTags,
//   ApiOperation,
//   ApiResponse,
//   ApiBearerAuth,
// } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../common/guards/roles.guard';
// import { Roles } from '../../../common/decorators/roles.decorator';
// import { CurrentUser } from '../../../common/decorators/current-user.decorator';
// import { UserDto } from '../../../common/interfaces/user.interface';
// import { UserRole } from '../../../common/interfaces/user-role.enum';
// import { DocumentService } from '../services/document.service';
// import { CreateDocumentDto } from '../dto/create-document.dto';
// import { diskStorage } from 'multer';
// import { extname } from 'path';

// import { Multer } from 'multer'; // Add this import

// @ApiTags('documents')
// @ApiBearerAuth()
// @Controller('patients/:patientId/documents')
// @UseGuards(JwtAuthGuard, RolesGuard)
// export class DocumentController {
//   constructor(private readonly documentService: DocumentService) {}

//   @Post()
//   @ApiOperation({ summary: 'Upload a document for a patient' })
//   @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
//   @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
//   @UseInterceptors(
//     FileInterceptor('document', {
//       storage: diskStorage({
//         destination: './uploads/documents',
//         filename: (req, file, cb) => {
//           const randomName = Array(32)
//             .fill(null)
//             .map(() => Math.round(Math.random() * 16).toString(16))
//             .join('');
//           return cb(null, `${randomName}${extname(file.originalname)}`);
//         },
//       }),
//       fileFilter: (req, file, cb) => {
//         if (!file.originalname.match(/\.(pdf|jpg|jpeg|png)$/)) {
//           return cb(new Error('Only PDF and image files are allowed!'), false);
//         }
//         cb(null, true);
//       },
//       limits: {
//         fileSize: 5 * 1024 * 1024, // 5MB
//       },
//     }),
//   )
//   async uploadDocument(
//     @Param('patientId', ParseUUIDPipe) patientId: string,
//     @Body() createDocumentDto: CreateDocumentDto,
//     @UploadedFile() file: Multer.File,
//     @CurrentUser() user: UserDto,
//   ) {
//     return this.documentService.uploadDocument(
//       patientId,
//       createDocumentDto.documentType,
//       file,
//       user,
//     );
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all documents for a patient' })
//   @ApiResponse({ status: 200, description: 'Return all patient documents' })
//   @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
//   async getPatientDocuments(
//     @Param('patientId', ParseUUIDPipe) patientId: string,
//     @CurrentUser() user: UserDto,
//   ) {
//     return this.documentService.getPatientDocuments(patientId, user);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Delete a document' })
//   @ApiResponse({ status: 200, description: 'Document deleted successfully' })
//   @Roles(UserRole.ADMIN, UserRole.KINESITHERAPEUTE)
//   async removeDocument(
//     @Param('id', ParseUUIDPipe) id: string,
//     @CurrentUser() user: UserDto,
//   ) {
//     await this.documentService.removeDocument(id, user);
//     return { message: 'Document deleted successfully' };
//   }
// }
