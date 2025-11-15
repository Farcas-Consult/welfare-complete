import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: registerDto.email },
        { username: registerDto.username },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 10);
    const emailVerificationToken = uuidv4();

    const user = this.userRepository.create({
      username: registerDto.username,
      email: registerDto.email,
      passwordHash,
      emailVerificationToken,
      role: 'member',
    });

    const savedUser = await this.userRepository.save(user);

    // TODO: Send verification email

    return {
      message: 'User registered successfully',
      data: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
      },
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
    });

    if (!user || !user.isActive) {
      return null;
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is locked');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
      }
      await this.userRepository.save(user);
      return null;
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date();
    await this.userRepository.save(user);

    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.createRefreshToken(user.id);

    return {
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken: refreshToken.token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    };
  }

  async refreshToken(token: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = refreshToken.user;
    const payload = { username: user.username, sub: user.id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
    };
  }

  async logout(userId: string) {
    await this.refreshTokenRepository.delete({ userId });
    return { message: 'Logout successful' };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['member'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return {
      message: 'Profile retrieved successfully',
      data: userWithoutPassword,
    };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.save(user);

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    const resetToken = uuidv4();
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour
    await this.userRepository.save(user);

    // TODO: Send password reset email

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: resetPasswordDto.token },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  async sendVerificationEmail(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verificationToken = uuidv4();
    user.emailVerificationToken = verificationToken;
    await this.userRepository.save(user);

    // TODO: Send verification email

    return { message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    await this.userRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  private async createRefreshToken(userId: string): Promise<RefreshToken> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const refreshToken = this.refreshTokenRepository.create({
      userId,
      token,
      expiresAt,
    });

    return this.refreshTokenRepository.save(refreshToken);
  }
}

