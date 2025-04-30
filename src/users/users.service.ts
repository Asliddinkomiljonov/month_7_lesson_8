import { Body, HttpException, Injectable, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwt: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const findUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (findUser) throw new Error("You have already registered");
    const user = this.userRepo.create(createUserDto);
    const userData = await this.userRepo.save(user);
    return { message: "You have successfully registered", userData };
  }
  async register(registerDto: RegisterUserDto) {
    const findUser = await this.userRepo.findOne({
      where: { username: registerDto.userName },
    });
    if (!findUser)
      throw new Error(
        "Username is entered incorrectly or you have not registered before",
      );
    if (findUser.password !== registerDto.password)
      throw new Error("Password is wrong");
    const token = this.jwt.sign({
      user_email: findUser.email,
      role: findUser.role,
      user_id: findUser.id,
    });
    return { token, data: { message: 'You have successfully logged in' } };
  }
  async getMe(data: any) {
    console.log(data);

    const findUser = await this.userRepo.findOne({
      where: { email: data.user_email },
    });
    return findUser;
  }
  async getAll() {
    return this.userRepo.find();
  }
  async deleteById(id: number) {
    const findUser = await this.userRepo.findOne({ where: { id: id } });
    if (!findUser)
      throw new HttpException('there is no user with this id', 500);
    await this.userRepo.remove(findUser);
    return {
      message: "User has been deleted",
    };
  }
}
