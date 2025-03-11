import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './schemas/user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { put, PutBlobResult } from '@vercel/blob';
import { environment } from '../../.env.local';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: any; token: string }> {
    return this.usersService.create(createUserDto);
  }

  @Post('/login/')
  login(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user: any; token: string }> {
    return this.usersService.login(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AdminAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: undefined,
    }),
  )
  async uploadAvatar(@UploadedFile() file: any, @Param('id') userId: string) {
    const blob: PutBlobResult = await put(
      `avatars/${userId}/profilePic.png`,
      file.buffer,
      {
        token: environment.BLOB_READ_WRITE_TOKEN,
        contentType: file.mimetype,
        access: 'public',
      },
    );

    return { url: blob.url };
  }
}
