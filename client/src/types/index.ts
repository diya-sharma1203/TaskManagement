export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt?: string;
  token?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  members: User[];
  status: 'active' | 'completed' | 'on-hold';
  createdAt: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  project: {
    _id: string;
    title: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}
