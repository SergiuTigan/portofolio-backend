import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './schemas/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, Users } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const newUser = new this.usersModel(createUserDto);
    const existingUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    // Create new user
    await newUser.save();
    return {
      message: `User with email ${createUserDto.email} has been created successfully`,
    };
  }

  async login(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user = await this.usersModel
      .findOne({ email: createUserDto.email })
      .exec();
    if (!user) {
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    if (user.password !== createUserDto.password) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    return createUserDto;
  }

  findAll(): Promise<UserDocument[]> {
    return this.usersModel.find().exec();
  }

  findOne(id: string): Promise<UserDocument> {
    return this.usersModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: string) {
    this.usersModel.deleteOne({ _id: id }).exec().then();
    return `User with id: ${id} was deleted`;
  }
}
