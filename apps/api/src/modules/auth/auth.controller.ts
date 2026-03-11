import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Req() req) {
    const ip = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.login(dto, ip, userAgent);
  }

  @Post('demo')
  demoLogin(@Req() req) {
    const ip = req.ip || req.connection?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.authService.demoLogin(ip, userAgent);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @Req() req,
    @Body()
    body: {
      email?: string;
      agencyName?: string;
      newPassword?: string;
      currentPassword?: string;
    },
  ) {
    return this.authService.updateProfile(
      req.user.userId,
      req.user.tenantId,
      body,
    );
  }
}
