// import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  // icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export interface ApiResponse<T> {
  status: number;
  message: string;
  code: number;
  data?: T;
  errorStack?: string;
}

export interface LoginReponse {
  user: {
    id: string;
    email: string;
    username: string;
    image: string;
  };
  accessToken: string;
  refreshToken: string;
}


export interface ConnectedApp {
  id: string;
  user_id: string;
  app_name: string;
  connected_account_id: string;
  auth_scheme: string;
  auth_value: string | null;
  created_at: string;
}