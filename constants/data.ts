import { NavItem } from '@/types/admin';

export interface ExtensionResponse {
  extensions: string[];
}

export const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
]);

export interface IExtensionAction {
  id: string;
  enum: string;
  logo: string;
  name: string;
  description: string;
  displayName?: string;
  noAuth?: boolean;
  deprecated?: boolean;
  appKey?: string;
  availableVersions?: string[];
  parameters?: {
    properties?: Record<string, any>;
    required?: string[];
    title?: string;
    type?: string;
  };
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  __v?: number;
}

export const INVALID_LOGIN_ERROR_MESSAGE = 'Email or password is invalid';
export const ACCOUNT_NOT_VERIFIED_ERROR_MESSAGE = 'Account has not been verified';

export enum Providers {
  Credentials = 'credentials',
  Google = 'google',
  Facebook = 'facebook',
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  CONFLICT = 409,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorCode {
  ACCOUNT_NOT_VERIFIED = 1010210,
  EMAIL_NOT_FOUND = 1010205,
  INCORRECT_PASSWORD = 1010206,
}

export enum Role {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  USER = 'User',
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard/overview',
    // icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Employee',
    url: '/admin/dashboard/employee',
    // icon: 'user',
    shortcut: ['e', 'e'],
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    // icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    // icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        // icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        // icon: 'login'
      },
    ],
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    // icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [], // No child items
  },

  {
    title: 'Team',
    url: '/admin/dashboard/team',
    // icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [], // No child items
  },
];
