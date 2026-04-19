import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserStatus } from './user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(userData: { 
    email: string; 
    password: string; 
    fullName: string;
    status?: UserStatus;
    verificationToken?: string;
    isVerified?: boolean;
  }): Promise<User> {
    return this.userModel.create(userData as any);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
    
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.findAll({
      attributes: { exclude: ['password'] },
    });
    return users as Omit<User, 'password'>[];
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) return;

    const timestamp = Date.now();
    const mutatedEmail = `deleted_${timestamp}_${user.email}`;

    await user.update({
      email: mutatedEmail,
      fullName: 'Deleted User',
      status: UserStatus.DELETED,
      isVerified: false,
      verificationToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
    });
  }
}