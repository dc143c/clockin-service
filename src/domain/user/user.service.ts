import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/shared/entities';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthorizationHelper } from '../auth/helpers';

@Injectable()
export class UserService {
  private readonly authorizationHelper = new AuthorizationHelper();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async create(userDTO: CreateUserDto) {
    const foundUser = await this.userRepository.findOne({
      where: { email: userDTO.email },
    });

    if (foundUser) throw new NotAcceptableException('User already exists');

    const user = await this.userRepository.save(userDTO);
    user.password = await this.authorizationHelper.EncryptPassword(
      user.password,
    );

    return this.userRepository.save(user);
  }

  async update(id: string, userDTO: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User has not been found');
    }
    await this.userRepository.update(id, userDTO);
    return this.userRepository.findOne({ where: { id: id } });
  }

  async delete(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User has not been found');
    }
    await this.userRepository.delete(id);
    return user;
  }
}
