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

  create(createUserDto: CreateUserDto): string {
    const existingUser = this.usersModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.FORBIDDEN,
      );
    }

    // Create new user
    const newUser = new this.usersModel(createUserDto);
    newUser.save().then();
    return `User with email: ${createUserDto.email} was created`;
  }

  findAll(): Promise<UserDocument[]> {
    return this.usersModel.find().exec();
  }

  findOne(id: number): Promise<UserDocument> {
    return this.usersModel.findById(id).exec();
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.usersModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  remove(id: number) {
    this.usersModel.deleteOne({ _id: id }).exec().then();
    return `User with id: ${id} was deleted`;
  }
}
