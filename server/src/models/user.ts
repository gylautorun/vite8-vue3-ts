import bcrypt from 'bcrypt';
import { db } from '../config/database';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  comparePassword(password: string): Promise<boolean>;
  toJSON(): any;
}

class UserModel {
  // 创建用户
  async create(userData: Partial<User>): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = db.users.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('邮箱已存在');
    }

    // 密码加密
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    // 设置默认头像
    if (!userData.avatar) {
      userData.avatar = 'https://via.placeholder.com/150';
    }

    // 创建用户
    const user = db.users.create(userData as User);
    return this.addMethods(user);
  }

  // 根据 ID 查找用户
  findById(id: number): User | null {
    const user = db.users.findById(id);
    return user ? this.addMethods(user) : null;
  }

  // 根据条件查找用户
  findOne(query: any): User | null {
    const user = db.users.findOne(query);
    return user ? this.addMethods(user) : null;
  }

  // 查找所有用户
  find(query: any = {}): User[] {
    const users = db.users.find(query);
    return users.map(user => this.addMethods(user));
  }

  // 删除用户
  findByIdAndDelete(id: number): User | null {
    const user = db.users.findByIdAndDelete(id);
    return user ? this.addMethods(user) : null;
  }

  // 统计用户数量
  countDocuments(query: any = {}): number {
    return db.users.countDocuments();
  }

  // 为用户对象添加方法
  private addMethods(user: any): User {
    return {
      ...user,
      async comparePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
      },
      toJSON(): any {
        const userObj = { ...user };
        delete userObj.password;
        return userObj;
      }
    };
  }
}

const User = new UserModel();

export default User;
