// 内存数据库实现，用于模拟 MongoDB
import fs from 'fs';
import path from 'path';

// 数据存储目录
const DATA_DIR = path.join(__dirname, '../../data');
console.log('数据存储目录:', DATA_DIR);

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  console.log('创建数据目录:', DATA_DIR);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('数据目录创建成功');
} else {
  console.log('数据目录已存在');
}

// // 数据文件路径
// const DATA_FILES = {
//   users: path.join(DATA_DIR, 'users.json'),
//   products: path.join(DATA_DIR, 'products.json'),
//   orders: path.join(DATA_DIR, 'orders.json')
// };
// // 数据存储
// interface DataStore {
//   users: any[];
//   products: any[];
//   orders: any[];
// }

// 从文件读取数据
const loadData = (filePath: string): any[] => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`读取数据文件失败 ${filePath}:`, error);
  }
  return [];
};

// 写入数据到文件
const saveData = (filePath: string, data: any[]): void => {
  try {
    // 确保文件所在目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`写入数据文件失败 ${filePath}:`, error);
  }
};

// const dataStore: DataStore = {
//   users: loadData(DATA_FILES.users),
//   products: loadData(DATA_FILES.products),
//   orders: loadData(DATA_FILES.orders)
// };

// 生成唯一 ID
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

// 数据存储 - 使用 Map 动态管理不同前缀的数据
const dataStore = new Map<string, any[]>();

// 获取数据文件路径
const getDataFilePath = (prefix: string, collection: string): string => {
  if (prefix && prefix !== 'default') {
    return path.join(DATA_DIR, prefix, `${collection}.json`);
  }
  return path.join(DATA_DIR, `${collection}.json`);
};

const getCollection = (prefix: string, collection: string): any[] => {
  const key = `${prefix}:${collection}`;
  if (!dataStore.has(key)) {
    const data = loadData(getDataFilePath(prefix, collection));
    dataStore.set(key, data);
  }
  return dataStore.get(key) || [];
};

// 保存数据集合
const saveCollection = (prefix: string, collection: string): void => {
  const data = dataStore.get(`${prefix}:${collection}`) || [];
  saveData(getDataFilePath(prefix, collection), data);
};

const matchRegex = (value: any, regex: any): boolean => {
  if (!regex.$regex) return false;
  const pattern = new RegExp(regex.$regex, regex.$options || '');
  return pattern.test(value);
};

const matchCondition = (item: any, condition: any): boolean => {
  for (const key in condition) {
    const condValue = condition[key];
    if (condValue && typeof condValue === 'object' && condValue.$regex) {
      if (!matchRegex(item[key], condValue)) return false;
    } else if (item[key] !== condValue) {
      return false;
    }
  }
  return true;
};

const matchQuery = (item: any, query: any): boolean => {
  for (const key in query) {
    if (key === '$or') {
      if (!query[key].some((condition: any) => matchCondition(item, condition))) {
        return false;
      }
    } else if (!matchCondition(item, { [key]: query[key] })) {
      return false;
    }
  }
  return true;
};

const connectDB = async (): Promise<void> => {
  console.log('内存数据库连接成功');
  
  // 初始化默认集合的示例数据
  initCollection('default', 'users');
  initCollection('default', 'products');
  initCollection('default', 'orders');
  
  // 初始化用户数据
  const users = getCollection('default', 'users');
  if (users.length === 0) {
    users.push({
      id: 1,
      name: '管理员',
      email: 'admin@example.com',
      password: 'admin123', // 明文密码，会在 User 模型中自动加密
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    saveCollection('default', 'users');
  }

  const products = getCollection('default', 'products');
  if (products.length === 0) {
    products.push(
      { id: 1, name: 'iPhone 15', price: 7999, description: '苹果手机', image: 'https://via.placeholder.com/300', category: '手机', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 2, name: 'MacBook Pro', price: 12999, description: '苹果笔记本电脑', image: 'https://via.placeholder.com/300', category: '电脑', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    );
    saveCollection('default', 'products');
  }
};

const initCollection = (prefix: string, collection: string): void => {
  getCollection(prefix, collection);
};

const createCollectionMethods = (prefix: string, collection: string) => {
  const getData = () => getCollection(prefix, collection);

  return {
    find: (query: any) => {
      const data = getData();
      if (Object.keys(query).length === 0) return data;
      return data.filter(item => matchQuery(item, query));
    },
    findOne: (query: any) => getData().find(item => matchQuery(item, query)),
    findById: (id: number) => getData().find(item => item.id === id),
    findByIdAndDelete: (id: number) => {
      const data = getData();
      const index = data.findIndex(item => item.id === id);
      if (index === -1) return null;
      const item = data.splice(index, 1)[0];
      saveCollection(prefix, collection);
      return item;
    },
    create: (item: any) => {
      const data = getData();
      const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      data.push(newItem);
      saveCollection(prefix, collection);
      return newItem;
    },
    save: (item: any) => {
      const data = getData();
      const index = data.findIndex(i => i.id === item.id);
      if (index === -1) {
        data.push(item);
      } else {
        data[index] = { ...item, updatedAt: new Date().toISOString() };
      }
      saveCollection(prefix, collection);
      return data[index] || item;
    },
    countDocuments: (query: any = {}) => {
      const data = getData();
      if (Object.keys(query).length === 0) return data.length;
      return data.filter(item => matchQuery(item, query)).length;
    },
    distinct: (field: string) => [...new Set(getData().map(item => item[field]))]
  };
};

export const db = {
  users: createCollectionMethods('default', 'users'),
  products: createCollectionMethods('default', 'products'),
  orders: createCollectionMethods('default', 'orders'),
  getCollection: (prefix: string, collection: string) => createCollectionMethods(prefix, collection)
};

export default connectDB;