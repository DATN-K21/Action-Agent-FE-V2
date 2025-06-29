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
  IconProps,
  Icon,
  IconMailSearch,
} from '@tabler/icons-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export const assistants = [
  {
    id: '227d6e7e-9a37-4acd-a584-f55e1933087a',
    userId: '685b1c1ba4ff7e68cd62242a',
    name: 'General Assistant',
    assistantType: 'general_assistant',
    description: 'General Assistant for general tasks',
    systemPrompt: null,
    provider: 'openai',
    modelName: 'gpt-4o-mini',
    temperature: 0.5,
    askHuman: null,
    interrupt: null,
    mainUnit: 'chatbot',
    supportUnits: ['ragbot', 'searchbot'],
    teams: [
      {
        id: '606c3167-2a43-479a-922b-b7083d6b3f97',
        name: '606c3167-2a43-479a-922b-b7083d6b3f97-main-chatbot-unit',
        description:
          'Main chatbot unit for general assistant, handles conversations and general queries.',
        workflow_type: 'chatbot',
        members: [
          {
            id: '0b0ed6bb-fbd8-426b-a84f-ebc6f166a67c',
            name: '0b0ed6bb-fbd8-426b-a84f-ebc6f166a67c-general-assistant-chatbot',
            type: 'chatbot',
            role: 'Handle general conversations, answer user questions, provide assistance with various tasks, and coordinate with support units when needed. Use search and knowledge tools when appropriate.',
          },
        ],
      },
      {
        id: 'e504d2cb-d5f7-43d4-a9f2-464765a68c2b',
        name: 'e504d2cb-d5f7-43d4-a9f2-464765a68c2b-ragbot-support-unit',
        description: 'Support unit for WorkflowType.RAGBOT in general assistant.',
        workflow_type: 'ragbot',
        members: [
          {
            id: '724429db-475c-4990-a80d-3acfe2a7448a',
            name: '724429db-475c-4990-a80d-3acfe2a7448a-ragbot-assistant',
            type: 'ragbot',
            role: 'Search through uploaded documents and knowledge bases to find relevant information for user queries.',
          },
        ],
      },
      {
        id: '2432b073-c97f-4080-b81d-31fabfdabe89',
        name: '2432b073-c97f-4080-b81d-31fabfdabe89-searchbot-support-unit',
        description: 'Support unit for WorkflowType.SEARCHBOT in general assistant.',
        workflow_type: 'searchbot',
        members: [
          {
            id: '76f3696b-61ff-4e12-8d2a-4868ede4fb9f',
            name: '76f3696b-61ff-4e12-8d2a-4868ede4fb9f-searchbot-assistant',
            type: 'searchbot',
            role: 'Search the internet and external sources to find relevant and up-to-date information for user queries.',
          },
        ],
      },
    ],
    createdAt: '2025-06-24T21:43:55.949504',
  },
];

export const selectedAssistant = assistants[0];

export interface ExtensionResponse {
  extensions: string[];
}

export const appText = new Map<string, string>([
  ['all', 'All Apps'],
  ['connected', 'Connected'],
  ['notConnected', 'Not Connected'],
]);

export interface IExtensionAction {
  extension_key: string;
  key: string;
  name: string;
  description: string;
}

export const extensionActionList: IExtensionAction[] = [
  // GMAIL
  {
    extension_key: 'gmail',
    key: 'GMAIL_SEND_EMAIL',
    name: 'Send Email',
    description: `Send an email using gmail's api.`,
  },
  {
    extension_key: 'gmail',
    key: 'GMAIL_FETCH_EMAILS',
    name: 'Fetch Email',
    description: `Action to fetch all emails from gmail.`,
  },
  {
    extension_key: 'gmail',
    key: 'GMAIL_REPLY_TO_THREAD',
    name: 'Reply to Thread',
    description: `Action to reply to an email thread in gmail.`,
  },
  {
    extension_key: 'gmail',
    key: 'GMAIL_SEARCH_PEOPLE',
    name: 'Search People',
    description: `Provides a list of contacts in the authenticated user's grouped contacts...`,
  },
  {
    extension_key: 'gmail',
    key: 'GMAIL_GET_CONTACTS',
    name: 'Get Contact',
    description: `Action to get info of contacts saved in google for an authorized account...`,
  },
  {
    extension_key: 'gmail',
    key: 'GMAIL_FETCH_MESSAGE_BY_MESSAGE_ID',
    name: 'Fetch Message By Thread ID',
    description: `Fetch messages by thread id from gmail with pagination support. to use pagination, you can set the 'pagetoken' in the request to the value of the 'nextpagetoken' in the response of the previous action. the 'nextpagetoken' is returned in the response of this action (i.e 'fetchmessagebythreadid') if there are more results to be fetched. if not provided, the first page of results is returned.`,
  },

  // GOOGLE CAlENDAR
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_FIND_EVENT',
    name: 'Find Event',
    description: `Find events in a google calendar based on a search query.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_CREATE_EVENT',
    name: 'Create Event',
    description: `Create a new event in a google calendar.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_FIND_FREE_SLOTS',
    name: 'Find Free Slots',
    description: `Find free slots in a google calendar based on for a specific time period.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_GET_CURRENT_DATE_TIME',
    name: 'Get Current Date & Time',
    description: `Action to get the current date and time of a specified timezone, given its utc offset value.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_DELETE_EVENT',
    name: 'Delete Event',
    description: `Delete an event from a google calendar.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_REMOVE_ATTENDEE',
    name: 'Remove Attendee From Event',
    description: `Remove an attendee from an existing event in a google calendar.`,
  },
  {
    extension_key: 'googlecalendar',
    key: 'GOOGLECALENDAR_UPDATE_EVENT',
    name: 'Update Google Event',
    description: `Update an existing event in a google calendar.`,
  },

  // GOOGLE MAPS
  {
    extension_key: 'googlemaps',
    key: 'GOOGLE_MAPS_GET_ROUTE',
    name: 'Get Route',
    description: `Computes routes between two points using google maps routes api.`,
  },
  {
    extension_key: 'googlemaps',
    key: 'GOOGLE_MAPS_TEXT_SEARCH',
    name: 'Text Search',
    description: `Searches for places using a text query in google maps places api.`,
  },
  {
    extension_key: 'googlemaps',
    key: 'GOOGLE_MAPS_NEARBY_SEARCH',
    name: 'Nearby Search',
    description: `Searches for places near a specified location using google maps places api.`,
  },
  {
    extension_key: 'googlemaps',
    key: 'GOOGLE_MAPS_GET_DIRECTION',
    name: 'Get Place Details',
    description: `Requires: valid google maps api key gets directions between locations using google maps directions api.`,
  },

  // GOOGLE MEET
  {
    extension_key: 'googlemeet',
    key: 'GOOGLEMEET_CREATE_MEET',
    name: 'Create Meet',
    description: `Create a google meet space!`,
  },
  {
    extension_key: 'googlemeet',
    key: 'GOOGLEMEET_GET_MEET',
    name: 'Get Meet Details',
    description: `Retrieve details of a google meet space.`,
  },
  {
    extension_key: 'googlemeet',
    key: 'GOOGLEMEET_GET_TRANSCRIPTS_BY_CONFERENCE_RECORD_ID',
    name: 'Get Transcripts by Conference Record ID',
    description: `Retrieve transcripts by conference record id.`,
  },
  {
    extension_key: 'googlemeet',
    key: 'GOOGLEMEET_GET_CONFERENCE_RECORD_FOR_MEET',
    name: 'Get Conference Record by Space Name',
    description: `Retrieve a google meet conference record by name, meeting code, start time, and end time.`,
  },
  {
    extension_key: 'googlemeet',
    key: 'GOOGLEMEET_GET_RECORDINGS_BY_CONFERENCE_RECORD_ID',
    name: 'Get Recordings by Conference Record ID',
    description: `Retrieve recordings by conference record id.`,
  },

  // NOTION
  {
    extension_key: 'notion',
    key: 'NOTION_INSERT_ROW_DATABASE',
    name: 'Insert Row Database',
    description: `Each row in the database is a new page in notion. Inserting a row in the database creates a page in notion, and includes extra properties as a structured list of key-value pairs for all columns in the database`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_ADD_PAGE_CONTENT',
    name: 'Add Content Notion Page',
    description: `Adds a single content block to a notion page. multiple calls needed for multiple blocks. note: only supports adding to notion pages. blocks that can contain children: - page (any block type) - toggle (any nested content) - to-do (nested to-dos/blocks) - bulleted list (nested lists/blocks) - numbered list (nested lists/blocks) - callout (child blocks) - quote (nested blocks)`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_CREATE_NOTION_PAGE',
    name: 'Create Notion Page',
    description: `Create a page in notion under page with id parent id. * if a specific parent id is given, directly create the page under that parent. * if no parent id is given, search for all the pages in notion workspace and find the one which is appropriate and select it as parent page. the parent id required is a unique uuid representing the parent page id which can be found notion search notion page tool. this is a new agent format for adding content to a notion page. example of a new format is { &quot;parent id&quot;: &quot;59833787-2cf9-4fdf-8782-e53db20768a5&quot;, &quot;title&quot;: &quot;my new report&quot;, &quot;icon&quot;: &quot;😻&quot;, &quot;cover&quot;: &quot;https://google.com/image.png&quot;, } don't use the old format, it is not compatible with agents`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_CREATE_DATABASE',
    name: 'Create Notion Database',
    description: `Creates a database as a subpage in the specified parent page, with the specified properties schema/columns. currently, the parent of a new database must be a notion page. you cannot update the schema of an existing database using this action. use update schema database action to update the schema or add/remove columns. only use this to create a new database. the title will be automatically converted to notion's rich text format internally.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_FETCH_DATABASE',
    name: 'Fetch Database',
    description: `Retrieves a database object — information that describes the structure and columns of a database — for a provided database id. the response adheres to any limits to an integration’s capabilities. to fetch database rows rather than columns, use the query a database endpoint.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_QUERY_DATABASE',
    name: 'Query Database',
    description: `Get list of rows from a notion database filtered and sorted. each row in notion database is represented as a page. each column in the database is represented as a property. to use sorting, filtering find all the properties in the database by using the fetch database action. the response may contain fewer than page size of results and supports pagination.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_GET_ABOUT_ME',
    name: 'Get About Me',
    description: `Gets 1. the user id associated with the notion integration. 2. the information about notion account like name of organisation. to get more details about user, you can use the user id to get user details`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_LIST_USERS',
    name: 'List Users',
    description: `List all users returns a paginated list of users for the workspace. the response may contain fewer than page size of results. guests are not included in the response.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_FETCH_ROW',
    name: 'Fetch Database Row',
    description: `Each row in database is a page in notion so page id & row id is a uuid of that page. id of the notion page to fetch. to fetch content of a page, &quot;fetch block children&quot; action can be used.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_GET_ABOUT_USER',
    name: 'Get About User',
    description: `Get information about the user account using the user id.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_FETCH_COMMENTS',
    name: 'Fetch All Unresolved Comments',
    description: `Retrieves a list of un-resolved comment objects from a page or block.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_UPDATE_ROW_DATABASE',
    name: 'Update Row Database',
    description: `Each row in the database is a new page in notion. so updating a row in the database is the same as updating a property of a page in notion. this action updates a specific value in a row in the notion database. for different column/property types --> value should be -title,rich text - text ex. &quot;hello world&quot; -number - number ex. 23.4 -select - select ex. &quot;india&quot; -multi select - multi select comma separated values ex. &quot;india,usa&quot; -date - format ex. &quot;2021-05-11t11:00:00.000-04:00&quot;, -people - comma separated ids of people ex. &quot;123,456&quot; -url - a url. -files - comma separated urls -checkbox - &quot;true&quot; or &quot;false&quot;`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_CREATE_COMMENT',
    name: 'Create Comment',
    description: `Create a comment on a page in notion. there are two locations where a new comment can be added (via the public api). to add a new comment to a 1. page, a parent object with a page id must be provided in the body params. 2. existing discussion thread, a discussion id string must be provided in the body params. (inline comments to start a new discussion thread cannot be created via the public api.) either the parent.page id or discussion id parameter must be provided — not both.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_DELETE_BLOCK',
    name: 'Delete Blocks',
    description: `Sets a block object, including page blocks, to archived: true using the id specified. this can be used to delete a block, page, or database. note: in the notion ui application, this moves the block to the &quot;trash&quot; where it can still be accessed and restored. to restore the block with the api, use the update a block or update page respectively.`,
  },
  {
    extension_key: 'notion',
    key: 'NOTION_UPDATE_SCHEMA_DATABASE',
    name: 'Update Database Schema',
    description: `Update a database schema in notion. using this you can change the columns/properties of a database.`,
  },

  // Slack
  {
    extension_key: 'slack',
    key: 'SLACK_SENDS_A_MESSAGE_TO_A_SLACK_CHANNEL',
    name: 'Post Message To Channel',
    description: `The chat.postmessage endpoint allows you to send a message to a slack channel or user. this versatile tool can be used to post simple text messages, create rich interactive messages with blocks or attachments, initiate or reply to threads, and customize the appearance of bot messages. it's ideal for sending notifications, updates, or interactive content to slack users or channels programmatically. the endpoint supports extensive customization of message content and appearance, making it suitable for a wide range of use cases from simple notifications to complex interactive workflows. however, it's important to note that the message structure and appearance may vary depending on the slack client and the parameters used.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_SEARCH_FOR_MESSAGES_WITH_QUERY',
    name: 'Search Messages Endpoint',
    description: `The search.messages endpoint allows you to search for messages across all channels, direct messages, and private groups in a slack workspace. it provides powerful search capabilities to find specific content within conversations. this endpoint is particularly useful for retrieving historical information, locating important discussions, or building search functionality into slack-integrated applications. the search results include message content, associated metadata, and can be refined using various parameters for sorting, highlighting, and pagination. keep in mind that the search may not include very recent messages due to indexing delays, and there may be rate limits on the number of requests you can make in a given time period.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_LIST_ALL_SLACK_TEAM_CHANNELS_WITH_VARIOUS_FILTERS',
    name: 'List Conversations Endpoint',
    description: `Retrieves a list of all conversations in a slack workspace, including public channels, private channels, multi-person direct messages (mpim), and direct messages (im). this endpoint is essential for obtaining an overview of all available conversations, which can be used for workspace analysis, channel management, or as a precursor to performing actions on specific conversations. the method supports filtering by conversation types, exclusion of archived channels, and pagination for handling large workspaces efficiently. use this endpoint when you need to display available channels to users, perform workspace-wide operations, or gather data about the structure of a slack workspace. note that the returned list may be affected by the permissions of the authenticated user, and some conversations might be excluded if the user doesn't have access to them.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_FETCH_CONVERSATION_HISTORY',
    name: 'Retrieve Conversation History',
    description: `Retrieves the message history of a specified slack conversation or channel. this endpoint allows you to fetch a chronological list of messages and events that have occurred within a channel, group, or direct message conversation. it's particularly useful for applications that need to analyze conversation patterns, create chat archives, or display message history to users. the endpoint supports pagination for handling large message histories and allows filtering by time range. it returns detailed message objects including sender information, timestamps, and message content, making it a powerful tool for building slack integrations that require access to conversation data.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_LIST_ALL_SLACK_TEAM_USERS_WITH_PAGINATION',
    name: 'List User Endpoint',
    description: `The 'users.list' endpoint retrieves a comprehensive list of users within a slack workspace. it provides detailed information about each user, including their profile data, account settings, and team memberships. this endpoint is particularly useful for applications that need to synchronize user data, manage user permissions, or perform bulk operations on user accounts. the response includes both active and deactivated users, allowing for a complete overview of the workspace's user base. however, it's important to note that the endpoint may not return real-time data, and there might be a slight delay in reflecting recent changes to user accounts.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_ADD_REACTION_TO_AN_ITEM',
    name: 'Add Reaction To Message',
    description: `Adds a reaction (emoji) to a specific message in a slack channel. this endpoint allows users to interact with messages by adding emojis as reactions, enhancing engagement and communication within slack. it should be used when a user wants to express a quick response or sentiment to a message without sending a new message. the endpoint requires specifying the target channel, the emoji name, and the timestamp of the message to react to. it's important to note that the user must have access to the specified channel and message, and the emoji must be available in the slack workspace. this endpoint does not support removing reactions or retrieving existing reactions on a message.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_SCHEDULES_A_MESSAGE_TO_A_CHANNEL_AT_A_SPECIFIED_TIME',
    name: 'Schedule A Message In Chat',
    description: `The chat.schedulemessage endpoint allows you to schedule a message for future delivery in a slack channel, direct message, or private group. this powerful feature enables automated, time-based communication within your slack workspace. use this endpoint when you need to send messages at specific times, such as reminders, announcements, or recurring updates. the scheduled message can include rich formatting using attachments or blocks, and supports various customization options like threading and link unfurling. keep in mind that scheduled messages are typically limited to 120 days in the future, and the scheduling user must have the necessary permissions in the target channel.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_CREATE_A_REMINDER',
    name: 'Add Reminder For User',
    description: `The 'reminders.add' endpoint allows you to create new reminders in slack. it's designed to help users set notifications for future tasks, events, or any information they need to remember. this tool is particularly useful for managing personal tasks, setting team reminders, or scheduling follow-ups within slack's collaborative environment. the endpoint offers flexibility in timing, supporting one-time reminders as well as recurring ones through natural language input. while it focuses on creating reminders, it does not provide functionality for listing, modifying, or deleting existing reminders. note that if no specific user is designated, the reminder defaults to the creator, making it versatile for both personal and team use.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_REMOVE_REACTION_FROM_ITEM',
    name: 'Remove Reaction From Message',
    description: `The reactions.remove endpoint allows you to remove a specific reaction (emoji) from a message, file, or file comment in slack. this method is useful for undoing reactions or cleaning up emoji responses on various items within slack channels. to use this endpoint, you must specify the reaction name and the item (message, file, or file comment) from which to remove the reaction. for messages, both the channel and timestamp are required. for files or file comments, you need to provide the respective file or file comment id. this endpoint is particularly helpful for moderation purposes or when managing automated reactions in integrated applications.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_UPDATES_A_SLACK_MESSAGE',
    name: 'Update Slack Chat Message Attributes',
    description: `The chat.update endpoint allows you to modify an existing message in a slack channel. it's used when you need to update the content, attachments, or formatting of a previously sent message. this can be particularly useful for updating dynamic content, correcting errors, or providing real-time updates to information. the endpoint requires specifying both the channel and the timestamp of the message to be updated. it offers flexible options for updating the message text, attachments, and blocks, allowing for rich formatting and interactive elements. however, it's important to note that this endpoint can't be used to update messages sent by other users or apps, and there may be time limitations on how long after a message is sent that it can be updated.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_CREATE_CHANNEL_BASED_CONVERSATION',
    name: 'Create Public Or Private Channel',
    description: `Creates a new public or private channel (conversation) in a slack workspace or organization. this endpoint allows administrators to programmatically set up channels, specifying whether they should be private or public, team-specific or organization-wide. it's particularly useful for automating workspace setup, creating standardized channels across teams, or implementing custom onboarding processes. the endpoint requires specifying the channel name and privacy setting, with options to add a description and determine the channel's scope within the organization.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_DELETE_A_PUBLIC_OR_PRIVATE_CHANNEL',
    name: 'Delete Conversation Channel',
    description: `The admin.conversations.delete endpoint allows workspace administrators to permanently delete a channel from a slack enterprise grid organization. this powerful function should be used when a channel is no longer needed and all its contents can be permanently removed. it's important to note that this action is irreversible and will delete all messages and files within the channel. this endpoint is only available for enterprise grid workspaces and requires admin-level permissions. it should be used with caution and typically as part of a careful channel management strategy or data cleanup process.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_SEARCH_CHANNELS_IN_AN_ENTERPRISE_ORGANIZATION',
    name: 'Search Admin Conversations',
    description: `The admin.conversations.search endpoint allows slack workspace administrators to search for conversations across their organization. it enables finding specific channels based on criteria like team membership, names, or topics. this tool is useful for managing large enterprises with multiple teams, helping admins organize their slack workspace effectively. it supports pagination and filtering, making it ideal for auditing channel usage or locating specific project-related channels.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_CREATE_AN_ENTERPRISE_TEAM',
    name: 'Create New Admin Team',
    description: `Creates a new team within a slack enterprise grid workspace. this endpoint allows administrators to set up a new organizational unit, specifying its domain, name, description, and discoverability settings. it's particularly useful for large organizations that need to create separate teams for different departments, projects, or subsidiaries. the endpoint should be used when expanding the workspace structure or setting up new collaborative spaces within the enterprise grid. note that this operation requires administrative privileges and should be used judiciously to maintain a coherent organizational structure.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_FETCH_MESSAGE_THREAD_FROM_A_CONVERSATION',
    name: 'Retrieve Conversation Replies',
    description: `The 'conversations.replies' endpoint retrieves a thread of messages within a slack conversation. it allows you to fetch replies to a specific message, providing a paginated list of messages in the thread. this endpoint is crucial for applications that need to display or process threaded conversations in slack channels, including public channels, private channels, and direct messages. use this when you need to access the full context of a discussion or when building features that involve message threads. note that the endpoint requires appropriate authentication scopes and may have rate limits for frequent requests.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_LIST_WORKSPACE_USERS',
    name: 'List Admin User',
    description: `The admin.users.list method retrieves a paginated list of users with administrative privileges in a slack workspace. it allows workspace owners and admins to view and manage the administrative user base efficiently. this endpoint is particularly useful for auditing admin access, reviewing admin assignments, or gathering data for reporting purposes. the method returns basic information about each admin user, such as their user id, name, and email. it does not provide detailed information about user permissions or roles beyond their admin status.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_RETRIEVE_CONVERSATION_INFORMATION',
    name: 'Get Conversation Info',
    description: `The conversations.info endpoint retrieves detailed information about a specific conversation in slack. it provides comprehensive data about channels, direct messages, or multi-person direct messages, including their properties, members, and settings. this endpoint is particularly useful when you need to access metadata about a conversation, such as its name, purpose, creation date, or membership details. it should be used when detailed information about a specific slack conversation is required, rather than for listing multiple conversations or accessing message content. note that while this endpoint provides extensive metadata, it does not return the actual messages within the conversation; for that, you would need to use a separate endpoint like conversations.history.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_INVITE_USER_TO_WORKSPACE_WITH_OPTIONAL_CHANNEL_INVITES',
    name: 'Invite User To Channels In Workspace',
    description: `The admin.users.invite endpoint allows slack workspace administrators to invite new users to their workspace. this powerful tool streamlines the process of adding members, setting up guest accounts, and managing initial channel access. use this endpoint when you need to programmatically invite users, especially in bulk or as part of an automated onboarding process. it's particularly useful for large organizations or when integrating slack with other systems. the endpoint provides flexibility in setting user roles, specifying channel access, and managing guest account expirations. however, it should be used cautiously, as it directly affects workspace membership and access rights. note that while you can set initial parameters, users may still need to complete the signup process and might have the ability to modify some settings upon joining.`,
  },
  {
    extension_key: 'slack',
    key: 'SLACK_RENAME_A_CONVERSATION',
    name: 'Rename Conversation Channel',
    description: `This endpoint renames an existing conversation (channel) in slack. it should be used when you need to update the name of a channel, either for rebranding, clarifying its purpose, or organizing workspace structure. the endpoint requires the unique channel id and the desired new name. only authorized users (such as the channel creator, workspace admins, or channel managers) can perform this action. the new name must comply with slack's naming conventions, and the api will automatically adjust it if necessary. note that renaming a channel may affect existing integrations or saved references to the channel name.`,
  },

  // OUTLOOK
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_LIST_MESSAGES',
    name: 'List Messages',
    description: `List messages in the user's mailbox using microsoft graph api for outlook.`,
  },
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_SEND_EMAIL',
    name: 'Send Email',
    description: `Send an email using microsoft graph api for outlook.`,
  },
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_LIST_EVENTS',
    name: 'List Events',
    description: `List events in the user's calendar using microsoft graph api for outlook.`,
  },
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_CALENDAR_CREATE_EVENT',
    name: 'Create Calendar Event',
    description: `Create an event in the user's calendar via microsoft graph api. this tool expects a flattened 'attendees info' from the user/llm, then transforms them into the nested shape required by microsoft graph.`,
  },
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_GET_EVENT',
    name: 'Get Calendar Event',
    description: `Get a specific calendar event by id from outlook using microsoft graph api.`,
  },
  {
    extension_key: 'outlook',
    key: 'OUTLOOK_OUTLOOK_GET_PROFILE',
    name: 'Get Profile',
    description: `Get the profile of a user in outlook using microsoft graph api.`,
  },
  // TODO: Missing some OUTLOOK actions
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
