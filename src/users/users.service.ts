import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    // Hash password even though it may already be SHA256 hashed from frontend
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create new user with hashed password
    const newUser = new this.usersModel({
      ...createUserDto,
      password: hashedPassword,
    });

    await newUser.save();
    return {
      message: `User with email ${createUserDto.email} has been created successfully`,
    };
  }

  async login(
    createUserDto: CreateUserDto,
  ): Promise<{ user: any; token: string }> {
    const user = await this.usersModel
      .findOne({ email: createUserDto.email })
      .exec();

    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }

    // For direct comparison if frontend passes SHA256 hashed password and backend doesn't rehash
    const passwordMatches = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token with user information
    const payload = {
      sub: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    return {
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  findAll(): Promise<UserDocument[]> {
    return this.usersModel.find().exec();
  }

  findOne(id: string): Promise<UserDocument> {
    return this.usersModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      return bcrypt.hash(updateUserDto.password, 10).then((hashedPassword) => {
        return this.usersModel
          .findByIdAndUpdate(
            id,
            { ...updateUserDto, password: hashedPassword },
            { new: true },
          )
          .exec();
      });
    }

    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string) {
    this.usersModel.deleteOne({ _id: id }).exec().then();
    return `User with id: ${id} was deleted`;
  }
}
