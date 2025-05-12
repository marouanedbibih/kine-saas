import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/auth.dto';
import {
  JwtPayload,
  RefreshTokenPayload,
} from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload): Promise<TokenResponseDto> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);
    const expiresInValue = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );

    if (!expiresInValue) {
      throw new InternalServerErrorException(
        'JWT expiration configuration missing',
      );
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getExpirationTime(expiresInValue),
      tokenType: 'Bearer',
    };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');

    if (!secret || !expiresIn) {
      throw new InternalServerErrorException(
        'JWT access token configuration missing',
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private async generateRefreshToken(
    payload: RefreshTokenPayload,
  ): Promise<string> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

    if (!secret || !expiresIn) {
      throw new InternalServerErrorException(
        'JWT refresh token configuration missing',
      );
    }

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');

    if (!secret) {
      throw new InternalServerErrorException(
        'JWT access secret configuration missing',
      );
    }

    return this.jwtService.verifyAsync(token, {
      secret,
    });
  }

  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new InternalServerErrorException(
        'JWT refresh secret configuration missing',
      );
    }

    return this.jwtService.verifyAsync(token, {
      secret,
    });
  }

  private getExpirationTime(expiresIn: string): number {
    const timeMatch = expiresIn.match(/\d+/);
    const unitMatch = expiresIn.match(/[a-zA-Z]+/);

    if (!timeMatch || !unitMatch) {
      return 3600; // Default to 1 hour if format is invalid
    }

    const time = timeMatch[0];
    const unit = unitMatch[0];

    const timeMap: Record<string, number> = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 60 * 60 * 24,
    };

    const multiplier = timeMap[unit] || 1;
    return parseInt(time) * multiplier;
  }
}
