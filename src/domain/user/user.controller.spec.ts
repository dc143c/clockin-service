import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { User } from '../../shared/entities/user.entity';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController Unit Tests', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn().mockReturnValue({
              id: '1',
              email: 'johndoe@example.com',
              password: '123456',
            }),
            delete: jest.fn(),
          },
        },
      ],
      controllers: [UserController],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('Saving user', () => {
    const user = new CreateUserDto();
    user.email = 'johndoe@example.com';
    user.password = '123456';

    it('services should return not null on save', async () => {
      expect(userService.create(user)).not.toEqual(null);
    });

    it('Should call method save', async () => {
      const save = await userController.create(user);
      expect(userRepository.save).toBeCalled();
      expect(userRepository.save).toBeCalledWith(user);
    });
  });
});
