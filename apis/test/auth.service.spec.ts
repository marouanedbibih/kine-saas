// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from '../src/auth/auth.service';
// import { User, UserRole } from '../src/users/entities/user.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { TokenService } from '../src/auth/token.service';
// import { JwtService } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import * as bcrypt from 'bcrypt';

// describe('AuthService', () => {
//   let authService: AuthService;
//   let tokenService: TokenService;
//   let userRepositoryMock: any;

//   beforeEach(async () => {
//     userRepositoryMock = {
//       findOne: jest.fn(),
//       create: jest.fn(),
//       save: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         TokenService,
//         JwtService,
//         ConfigService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: userRepositoryMock,
//         },
//       ],
//     }).compile();

//     authService = module.get<AuthService>(AuthService);
//     tokenService = module.get<TokenService>(TokenService);
//   });

//   it('should be defined', () => {
//     expect(authService).toBeDefined();
//   });

//   describe('validateUser', () => {
//     it('should return null if user is not found', async () => {
//       userRepositoryMock.findOne.mockResolvedValueOnce(null);
//       const result = await authService.validateUser('test@example.com', 'password');
//       expect(result).toBeNull();
//     });

//     it('should return null if password is invalid', async () => {
//       const mockUser = {
//         id: '123',
//         email: 'test@example.com',
//         password: await bcrypt.hash('correct-password', 10),
//         role: UserRole.KINESITHERAPEUTE,
//         actif: true,
//       };
//       userRepositoryMock.findOne.mockResolvedValueOnce(mockUser);
      
//       const result = await authService.validateUser('test@example.com', 'wrong-password');
//       expect(result).toBeNull();
//     });

//     it('should return user if credentials are valid', async () => {
//       const password = 'correct-password';
//       const hashedPassword = await bcrypt.hash(password, 10);
      
//       const mockUser = {
//         id: '123',
//         email: 'test@example.com',
//         password: hashedPassword,
//         role: UserRole.KINESITHERAPEUTE,
//         actif: true,
//       };
      
//       userRepositoryMock.findOne.mockResolvedValueOnce(mockUser);
      
//       const result = await authService.validateUser('test@example.com', password);
//       expect(result).toEqual(mockUser);
//     });
//   });

//   describe('validatePayload', () => {
//     it('should throw UnauthorizedException if user is not found', async () => {
//       userRepositoryMock.findOne.mockResolvedValueOnce(null);
      
//       await expect(authService.validatePayload({ 
//         sub: '123', 
//         email: 'test@example.com',
//         role: UserRole.KINESITHERAPEUTE
//       })).rejects.toThrow('User not found');
//     });

//     it('should throw ForbiddenException if user is not active', async () => {
//       const mockUser = {
//         id: '123',
//         email: 'test@example.com',
//         role: UserRole.KINESITHERAPEUTE,
//         actif: false,
//       };
      
//       userRepositoryMock.findOne.mockResolvedValueOnce(mockUser);
      
//       await expect(authService.validatePayload({ 
//         sub: '123', 
//         email: 'test@example.com',
//         role: UserRole.KINESITHERAPEUTE
//       })).rejects.toThrow('Account deactivated');
//     });

//     it('should return the user if payload is valid', async () => {
//       const mockUser = {
//         id: '123',
//         email: 'test@example.com',
//         role: UserRole.KINESITHERAPEUTE,
//         actif: true,
//       };
      
//       userRepositoryMock.findOne.mockResolvedValueOnce(mockUser);
      
//       const result = await authService.validatePayload({ 
//         sub: '123', 
//         email: 'test@example.com',
//         role: UserRole.KINESITHERAPEUTE
//       });
      
//       expect(result).toEqual(mockUser);
//     });
//   });
// });
