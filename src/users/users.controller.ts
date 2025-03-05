import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
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
import { put } from '@vercel/blob';

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
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: any,
    @Req() request: { id: string },
  ) {
    // Get current user ID from request
    const userId = request.id;

    // Upload to Vercel Blob
    const blob = await put(`avatars/${userId}/profilePic.jpg`, file.buffer, {
      access: 'public',
    });

    // Return the URL
    return { url: blob.url };
  }
}
