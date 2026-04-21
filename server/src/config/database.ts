// 内存数据库实现，用于模拟 MongoDB

// 数据存储
interface DataStore {
  users: any[];
  products: any[];
  orders: any[];
}

const dataStore: DataStore = {
  users: [],
  products: [],
  orders: []
};

// 生成唯一 ID
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// 模拟数据库连接
const connectDB = async (): Promise<void> => {
  console.log('内存数据库连接成功');
  
  // 初始化一些示例数据
  if (dataStore.users.length === 0) {
    dataStore.users.push({
      id: 1,
      name: '管理员',
      email: 'admin@example.com',
      // password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', // 密码: admin123
      password: 'admin123', // 明文密码，会在 User 模型中自动加密
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  if (dataStore.products.length === 0) {
    dataStore.products.push(
      {
        id: 1,
        name: 'iPhone 15',
        price: 7999,
        description: '苹果手机',
        image: 'https://via.placeholder.com/300',
        category: '手机',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'MacBook Pro',
        price: 12999,
        description: '苹果笔记本电脑',
        image: 'https://via.placeholder.com/300',
        category: '电脑',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    );
  }
};

// 导出内存数据库操作方法
export const db = {
  // 用户操作
  users: {
    find: (query: any) => {
      if (Object.keys(query).length === 0) {
        return dataStore.users;
      }
      return dataStore.users.filter(user => {
        for (const key in query) {
          if (user[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findOne: (query: any) => {
      return dataStore.users.find(user => {
        for (const key in query) {
          if (user[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findById: (id: number) => {
      return dataStore.users.find(user => user.id === id);
    },
    findByIdAndDelete: (id: number) => {
      const index = dataStore.users.findIndex(user => user.id === id);
      if (index === -1) {
        return null;
      }
      const user = dataStore.users[index];
      dataStore.users.splice(index, 1);
      return user;
    },
    create: (user: any) => {
      const newUser = {
        ...user,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.users.push(newUser);
      return newUser;
    },
    save: (user: any) => {
      const index = dataStore.users.findIndex(u => u.id === user.id);
      if (index === -1) {
        dataStore.users.push(user);
      } else {
        dataStore.users[index] = {
          ...user,
          updatedAt: new Date().toISOString()
        };
      }
      return user;
    },
    countDocuments: () => {
      return dataStore.users.length;
    }
  },
  
  // 商品操作
  products: {
    find: (query: any) => {
      if (Object.keys(query).length === 0) {
        return dataStore.products;
      }
      return dataStore.products.filter(product => {
        for (const key in query) {
          if (key === '$or') {
            const conditions = query[key];
            if (!conditions.some((condition: any) => {
              for (const cKey in condition) {
                if (condition[cKey].$regex) {
                  const regex = new RegExp(condition[cKey].$regex, condition[cKey].$options);
                  if (regex.test(product[cKey])) {
                    return true;
                  }
                }
              }
              return false;
            })) {
              return false;
            }
          } else if (product[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findOne: (query: any) => {
      return dataStore.products.find(product => {
        for (const key in query) {
          if (product[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findById: (id: number) => {
      return dataStore.products.find(product => product.id === id);
    },
    findByIdAndDelete: (id: number) => {
      const index = dataStore.products.findIndex(product => product.id === id);
      if (index === -1) {
        return null;
      }
      const product = dataStore.products[index];
      dataStore.products.splice(index, 1);
      return product;
    },
    create: (product: any) => {
      const newProduct = {
        ...product,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.products.push(newProduct);
      return newProduct;
    },
    save: (product: any) => {
      const index = dataStore.products.findIndex(p => p.id === product.id);
      if (index === -1) {
        dataStore.products.push(product);
      } else {
        dataStore.products[index] = {
          ...product,
          updatedAt: new Date().toISOString()
        };
      }
      return product;
    },
    countDocuments: (query: any) => {
      if (Object.keys(query).length === 0) {
        return dataStore.products.length;
      }
      return dataStore.products.filter(product => {
        for (const key in query) {
          if (key === '$or') {
            const conditions = query[key];
            if (!conditions.some((condition: any) => {
              for (const cKey in condition) {
                if (condition[cKey].$regex) {
                  const regex = new RegExp(condition[cKey].$regex, condition[cKey].$options);
                  if (regex.test(product[cKey])) {
                    return true;
                  }
                }
              }
              return false;
            })) {
              return false;
            }
          } else if (product[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }).length;
    },
    distinct: (field: string) => {
      const values = new Set();
      dataStore.products.forEach(product => {
        values.add(product[field]);
      });
      return Array.from(values);
    }
  },
  
  // 订单操作
  orders: {
    find: (query: any) => {
      if (Object.keys(query).length === 0) {
        return dataStore.orders;
      }
      return dataStore.orders.filter(order => {
        for (const key in query) {
          if (order[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findOne: (query: any) => {
      return dataStore.orders.find(order => {
        for (const key in query) {
          if (order[key] !== query[key]) {
            return false;
          }
        }
        return true;
      });
    },
    findById: (id: number) => {
      return dataStore.orders.find(order => order.id === id);
    },
    findByIdAndDelete: (id: number) => {
      const index = dataStore.orders.findIndex(order => order.id === id);
      if (index === -1) {
        return null;
      }
      const order = dataStore.orders[index];
      dataStore.orders.splice(index, 1);
      return order;
    },
    create: (order: any) => {
      const newOrder = {
        ...order,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dataStore.orders.push(newOrder);
      return newOrder;
    },
    save: (order: any) => {
      const index = dataStore.orders.findIndex(o => o.id === order.id);
      if (index === -1) {
        dataStore.orders.push(order);
      } else {
        dataStore.orders[index] = {
          ...order,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    },
    countDocuments: (query: any) => {
      if (Object.keys(query).length === 0) {
        return dataStore.orders.length;
      }
      return dataStore.orders.filter(order => {
        for (const key in query) {
          if (order[key] !== query[key]) {
            return false;
          }
        }
        return true;
      }).length;
    }
  }
};

export default connectDB;
