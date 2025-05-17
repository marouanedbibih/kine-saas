import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  // BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto, AuthUserDto, LoginResponseDto } from './dto/auth.dto';
import { TokenService } from './token.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '@/modules/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.actif) {
      throw new ForbiddenException(
        'Your account has been deactivated. Please contact support.',
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const tokens = await this.tokenService.generateTokens(payload);

    const authUser: AuthUserDto = {
      id: user.id,
      email: user.email,
      prenom: user.prenom,
      nom: user.nom,
      role: user.role,
      actif: user.actif,
    };

    return {
      user: authUser,
      tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.actif) {
        throw new ForbiddenException('Your account has been deactivated');
      }

      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = await this.tokenService.generateTokens(newPayload);

      const authUser: AuthUserDto = {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
        actif: user.actif,
      };

      return {
        user: authUser,
        tokens,
      };
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validatePayload(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.actif) {
      throw new ForbiddenException('Account deactivated');
    }

    return user;
  }
}
