import { NavItem } from '@/types';
import {
  IconBrandDiscord,
  IconBrandDocker,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandGmail,
  IconBrandMedium,
  IconBrandNotion,
  IconBrandSkype,
  IconBrandSlack,
  IconBrandStripe,
  IconBrandTelegram,
  IconBrandTrello,
  IconBrandWhatsapp,
  IconBrandZoom,
  IconBrandYoutube,
  IconBrandGoogleMaps,
  IconCalendarEvent,
  IconVideoPlus,
} from '@tabler/icons-react';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active',
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active',
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive',
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active',
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active',
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active',
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active',
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active',
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    // icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Employee',
    url: '/dashboard/employee',
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

export interface ExtensionResponse {
  extensions: string[];
}
export interface Extension {
  name: string;
  logo: any;
  connected: boolean;
  desc: string;
  key?: string;
}

export const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
]);

export const extensions: Extension[] = [
  {
    name: 'Telegram',
    key: 'telegram',
    logo: IconBrandTelegram,
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    key: 'notion',
    logo: IconBrandNotion,
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    key: 'figma',
    logo: IconBrandFigma,
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    key: 'trello',
    logo: IconBrandTrello,
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    key: 'slack',
    logo: IconBrandSlack,
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    key: 'zoom',
    logo: IconBrandZoom,
    connected: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    key: 'stripe',
    logo: IconBrandStripe,
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    key: 'gmail',
    logo: IconBrandGmail,
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    key: 'medium',
    logo: IconBrandMedium,
    connected: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    key: 'skype',
    logo: IconBrandSkype,
    connected: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  {
    name: 'Docker',
    key: 'docker',
    logo: IconBrandDocker,
    connected: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    key: 'github',
    logo: IconBrandGithub,
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    key: 'gitlab',
    logo: IconBrandGitlab,
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  {
    name: 'Discord',
    key: 'discord',
    logo: IconBrandDiscord,
    connected: false,
    desc: 'Connect with Discord for seamless team communication.',
  },
  {
    name: 'WhatsApp',
    key: 'whatsapp',
    logo: IconBrandWhatsapp,
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
  {
    name: 'YouTube',
    key: 'youtube',
    logo: IconBrandYoutube,
    connected: false,
    desc: 'View and manage YouTube videos directly from the dashboard.',
  },
  {
    name: 'Google Maps',
    key: 'googlemaps',
    logo: IconBrandGoogleMaps,
    connected: false,
    desc: 'Access Google Maps for location-based services.',
  },
  {
    name: 'Google Calendar',
    key: 'googlecalendar',
    logo: IconCalendarEvent,
    connected: false,
    desc: 'Sync and manage calendar events with ease.',
  },
  {
    name: 'Google Meet',
    key: 'googlemeet',
    logo: IconVideoPlus,
    connected: false,
    desc: 'Host Google Meet meetings directly from the dashboard.',
  }
];

export interface IExtensionAction {
  extension_key: string;
  key: string;
  name: string;
  description: string;
}

export const extensionActionList: IExtensionAction[] = [
  // GMAIL
  { extension_key: 'gmail', key: 'GMAIL_SEND_EMAIL', name: 'Send Email', description: `Send an email using gmail's api.`},
  { extension_key: 'gmail', key: 'GMAIL_FETCH_EMAILS', name: 'Fetch Email', description: `Action to fetch all emails from gmail.`},
  { extension_key: 'gmail', key: 'GMAIL_REPLY_TO_THREAD', name: 'Reply to Thread', description: `Action to reply to an email thread in gmail.` },
  { extension_key: 'gmail', key: 'GMAIL_SEARCH_PEOPLE', name: 'Search People', description: `Provides a list of contacts in the authenticated user's grouped contacts...` },
  { extension_key: 'gmail', key: 'GMAIL_GET_CONTACTS', name: 'Get Contact', description: `Action to get info of contacts saved in google for an authorized account...` },
  { extension_key: 'gmail', key: 'GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID', name: 'Fetch Message By Thread ID', description: `Fetch messages by thread id from gmail with pagination support. to use pagination, you can set the 'pagetoken' in the request to the value of the 'nextpagetoken' in the response of the previous action. the 'nextpagetoken' is returned in the response of this action (i.e 'fetchmessagebythreadid') if there are more results to be fetched. if not provided, the first page of results is returned.` },

  // GOOGLE CAlENDAR
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_FIND_EVENT', name: 'Find Event', description: `Find events in a google calendar based on a search query.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_CREATE_EVENT', name: 'Create Event', description: `Create a new event in a google calendar.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_FIND_FREE_SLOTS', name: 'Find Free Slots', description: `Find free slots in a google calendar based on for a specific time period.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_GET_CURRENT_DATE_TIME', name: 'Get Current Date & Time', description: `Action to get the current date and time of a specified timezone, given its utc offset value.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_DELETE_EVENT', name: 'Delete Event', description: `Delete an event from a google calendar.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_REMOVE_ATTENDEE', name: 'Remove Attendee From Event', description: `Remove an attendee from an existing event in a google calendar.` },
  { extension_key: 'googlecalendar', key: 'GOOGLECALENDAR_UPDATE_EVENT', name: 'Update Google Event', description: `Update an existing event in a google calendar.` },
];

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
