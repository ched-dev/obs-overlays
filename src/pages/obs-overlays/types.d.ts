/**
 * ChatApp
 */
export interface ChatApp {
  initialized: boolean;
  id: "chat-app";
  chats: ChatMessageCallbackData[];
  template: string;
  $el: HTMLElement;
  init: () => void;
  render: (chat?: ChatMessageCallbackData) => void;
}

/**
 * ChatCommands
 */
export type ChatCommands = ChatCommand[];
export interface ChatCommand {
  commandName: string; // no spaces
  aliases?: string[]; // does not start with !
  allowedRoles?: ChatUserRoleNames[];
  chatCommandCallback?: ChatCommandCallback;
  shortcuts?: string[];
}
export type ChatUserRoleNames = keyof ChatUserRoles;
export interface ChatUserRoles {
  broadcaster: boolean;
  moderator: boolean;
  vip: boolean;
  editor: boolean;
  follower: boolean;
  subscriber: boolean;
  any: boolean;
}
export type ChatMessageCallback = (chatData: ChatMessageCallbackData) => ClientCommandResult;
export type ChatMessageCallbackEmitter = (callback: ChatMessageCallback) => void;
export interface ChatMessageCallbackData {
  chatter: ChatCommandChatter;
  message: string;
  isCommand: boolean;
}
export type ChatCommandCallback = (commandData: ChatCommandCallbackData) => ClientCommandResult;
export type ChatCommandCallbackEmitter = (callback: ChatCommandCallback) => void;
export interface ChatCommandCallbackData {
  channelName: string; // #ched_dev
  chatter: ChatCommandChatter;
  commandName: ChatCommand["commandName"];
  commandConfig: ChatCommand;
  args: any[];
}
export interface ChatCommandChatter {
  displayName: string;
  userId: string | number;
  userName: string;
  roles: ChatUserRoles;
  features: ChatUserFeatures;
  isBot: boolean;
}
export interface ChatUserFeatures {
  firstMessage: boolean;
  highlightedMessage: boolean;
}

/**
 * ClientCommands
 */
export interface ClientCommands {
  renderTemplate: (templateData: RenderTemplateData) => void;
  renderSoundButtons: () => void;
  sendSoundNames: (chatter: ChatCommandChatter) => void;
  playSound: (soundName: string, chatter?: ChatCommandChatter) => void;
  clearScreen: () => void;
  clearNotification: () => void;
  sendBotMessage: (message: string) => void;
  sendCommands(commandData: ChatCommandCallbackData): void;
  ignore: () => void;
}

export type ClientCommandNames = keyof ClientCommands;

export interface ClientCommand {
  clientCommand: ClientCommandNames;
  args?: any[];
}
export type ClientCommandResult = ClientCommand | ClientCommand[] | void;

export interface RenderTemplateData {
  template?: string; // "message-template"
  sound?: string; // SoundSource key
  timeout?: number; // milliseconds
}

/**
 * EventCommands
 */
export type EventCommandNames = "channel-ban" | "channel-channel_points_custom_reward-add" | "channel-channel_points_custom_reward-remove" | "channel-channel_points_custom_reward-update" | "channel-channel_points_custom_reward_redemption-add" | "channel-channel_points_custom_reward_redemption-update" | "channel-cheer" | "channel-follow" | "channel-hype_train-begin" | "channel-hype_train-end" | "channel-hype_train-progress" | "channel-moderator-add" | "channel-moderator-remove" | "channel-poll-begin" | "channel-poll-end" | "channel-poll-progress" | "channel-prediction-begin" | "channel-prediction-end" | "channel-prediction-lock" | "channel-prediction-progress" | "channel-raid" | "channel-subscribe" | "channel-subscription-end" | "channel-subscription-gift" | "channel-subscription-message" | "channel-unban" | "channel-update";

export interface EventCommand {
  eventName: EventCommandNames;
  eventCommandCallback: EventCommandCallback;
}
export type EventCommands = EventCommand[];

export type EventCommandCallback = (eventData: EventCommandCallbackData) => ClientCommandResult;
export type EventCommandCallbackData = Record<string, any>;


/**
 * Sound
 */
export type SoundSources = Record<string, SoundSource>;
export interface SoundSource {
  audio?: HTMLAudioElement; // populated on SoundPlayer.init()
  audioSource: string; // "sounds/whatever.mp3"
  volume?: number; // 0 ... 1
  allowedRoles?: ChatUserRoleNames[];
}

export interface SoundPlayer {
  initialized: boolean;
  sources: SoundSources;
  init: () => void;
  get: (name: string, chatter: ChatCommandChatter | undefined) => SoundSource | undefined;
  getAllNames: (chatter: ChatCommandChatter) => string[];
  play: (name: string, chatter: ChatCommandChatter | undefined) => void;
}


/**
 * TauSocket
 */
export interface TauSocket {
  tauSocket: TauWebSocket | null;
  tauSocketUrl: string;
  init: () => void;
  emitTwitchEventsOnSocket: (eventCommands: EventCommands, socket: Socket) => void;
}
interface TauWebSocket {
  on: (eventName: string, callback: function) => void;
  send: (eventName: string, data: any) => void;
  terminate: () => void;
}
export interface TauSocketListenerEvents {
  [key: EventCommandNames]: TauSocketListenerEventCallback
};
export type TauSocketListenerEventCallback = (eventData: EventCommandCallbackData) => void;
export interface TauSocketListeners {
  [key: Socket["id"]]: TauSocketListenerEvents
};

/**
 * TwitchChat
 */
export interface TwitchChat {
  channelName: string; // ched_dev
  ignoredChatters: TwitchChatConfig["ignoredChatters"]; // ched_dev
  hasIdentity: boolean;
  client: TmiClient;
  eventNames: {
    chatMessage: "chat-message",
    chatCommand: "chat-command"
  },
  init: (config: TwitchChatConfig, commands: ChatCommands) => void;
  onChatMessage: ChatMessageCallbackEmitter;
  onChatCommand: ChatCommandCallbackEmitter;
  emitChatCommandsOnSocket: (commands: ChatCommands, socket: Socket, twitchChatConfig: TwitchChatConfig) => void;
}
interface TwitchChatConfig {
  channelName?: string; // "ched_dev"
  ignoredChatters?: string[]; // ["ched_dev"]
  botName?: string; // "cheds_bot"
}
interface TmiClient {
  connect: () => void;
  on: (eventName: string, callback: function) => void;
  emit: (eventName: string, ...args) => void;
  say: (eventName: string, message: string) => void;
  opts?: { channels: string[] }
}
export interface TwitchChatSocketListenerEvents {
  [key: ChatCommandNames]: TwitchChatSocketListenerEventCallback
};
export type TwitchChatSocketListenerEventCallback = (commandData: ChatCommandCallbackData) => void;
export interface TwitchChatSocketListeners {
  [key: Socket["id"]]: TwitchChatSocketListenerEvents
};

/**
 * Socket
 */
interface Socket {
  id: string;
  connected: boolean;
  on: (eventName: string, callback: function) => void;
  emit: (eventName: string, data: any) => void;
  disconnect: () => void;
}


/**
 * Window
 */
declare global {
  interface Window {
    io: () => Socket;
  }
}