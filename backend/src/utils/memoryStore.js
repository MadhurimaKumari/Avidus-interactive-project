import bcrypt from 'bcryptjs';

const users = [];
const tasks = [];
const activityLogs = [];

const createId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;

const clone = (value) => JSON.parse(JSON.stringify(value));

const matches = (item, filter = {}) => {
  return Object.entries(filter).every(([key, value]) => String(item[key]) === String(value));
};

class MemoryQuery {
  constructor(items) {
    this.items = items;
  }

  select(fields) {
    if (fields === '-password') {
      this.items = this.items.map(({ password, ...item }) => item);
    }
    return this;
  }

  sort(sortConfig) {
    const [[field, direction]] = Object.entries(sortConfig || {});
    if (field) {
      this.items = [...this.items].sort((a, b) => {
        const left = new Date(a[field]).getTime() || 0;
        const right = new Date(b[field]).getTime() || 0;
        return direction < 0 ? right - left : left - right;
      });
    }
    return this;
  }

  populate(field, projection) {
    if (field === 'user') {
      const fields = projection.split(' ');
      this.items = this.items.map((item) => {
        const user = users.find((candidate) => candidate._id === item.user);
        return {
          ...item,
          user: user
            ? fields.reduce((result, key) => ({ ...result, [key]: user[key] }), { _id: user._id })
            : null,
        };
      });
    }
    return this;
  }

  then(resolve, reject) {
    return Promise.resolve(clone(this.items)).then(resolve, reject);
  }
}

const attachUserMethods = (user) => ({
  ...user,
  async comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, user.password);
  },
  async save() {
    const index = users.findIndex((item) => item._id === this._id);
    if (index >= 0) {
      users[index] = { ...users[index], ...this, updatedAt: new Date().toISOString() };
    }
    return attachUserMethods(clone(users[index]));
  },
  async deleteOne() {
    const index = users.findIndex((item) => item._id === this._id);
    if (index >= 0) users.splice(index, 1);
  },
});

const attachTaskMethods = (task) => ({
  ...task,
  async save() {
    const index = tasks.findIndex((item) => item._id === this._id);
    if (index >= 0) {
      tasks[index] = { ...tasks[index], ...this, updatedAt: new Date().toISOString() };
    }
    return attachTaskMethods(clone(tasks[index]));
  },
  async deleteOne() {
    const index = tasks.findIndex((item) => item._id === this._id);
    if (index >= 0) tasks.splice(index, 1);
  },
});

export const MemoryUser = {
  async create(payload) {
    if (!payload.name || !payload.email || !payload.password) {
      const error = new Error('Invalid user data provided');
      error.name = 'ValidationError';
      throw error;
    }

    if (users.some((user) => user.email === payload.email.toLowerCase())) {
      const error = new Error('Duplicate email');
      error.code = 11000;
      error.keyValue = { email: payload.email };
      throw error;
    }

    const now = new Date().toISOString();
    const user = {
      _id: createId(),
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: await bcrypt.hash(payload.password, 10),
      role: payload.role || 'User',
      status: payload.status || 'Active',
      createdAt: now,
      updatedAt: now,
    };
    users.push(user);
    return attachUserMethods(clone(user));
  },
  async findOne(filter) {
    const user = users.find((item) => matches(item, filter));
    return user ? attachUserMethods(clone(user)) : null;
  },
  async findById(id) {
    const user = users.find((item) => item._id === String(id));
    return user ? attachUserMethods(clone(user)) : null;
  },
  find(filter = {}) {
    return new MemoryQuery(users.filter((item) => matches(item, filter)));
  },
  async countDocuments(filter = {}) {
    return users.filter((item) => matches(item, filter)).length;
  },
};

export const MemoryTask = {
  async create(payload) {
    const now = new Date().toISOString();
    const task = {
      _id: createId(),
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'Pending',
      dueDate: payload.dueDate || null,
      user: String(payload.user),
      createdAt: now,
      updatedAt: now,
    };
    tasks.push(task);
    return attachTaskMethods(clone(task));
  },
  async findById(id) {
    const task = tasks.find((item) => item._id === String(id));
    return task ? attachTaskMethods(clone(task)) : null;
  },
  find(filter = {}) {
    return new MemoryQuery(tasks.filter((item) => matches(item, filter)));
  },
  async deleteMany(filter = {}) {
    const before = tasks.length;
    for (let index = tasks.length - 1; index >= 0; index -= 1) {
      if (matches(tasks[index], filter)) tasks.splice(index, 1);
    }
    return { deletedCount: before - tasks.length };
  },
  async countDocuments(filter = {}) {
    return tasks.filter((item) => matches(item, filter)).length;
  },
};

export const MemoryActivityLog = {
  async create(payload) {
    const log = {
      _id: createId(),
      user: String(payload.user),
      action: payload.action,
      details: payload.details,
      ipAddress: payload.ipAddress || 'unknown',
      createdAt: new Date().toISOString(),
    };
    activityLogs.push(log);
    return clone(log);
  },
  find(filter = {}) {
    return new MemoryQuery(activityLogs.filter((item) => matches(item, filter)));
  },
};
