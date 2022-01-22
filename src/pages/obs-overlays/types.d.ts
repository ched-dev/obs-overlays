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
export type ChatCommandCallback = (commandData: ChatCommandCallbackData) => ClientCommandResult;
export interface ChatCommandCallbackData {
  channelName: string; // #ched_dev
  chatter: ChatCommandChatter;
  commandName: ChatCommand["commandName"];
  args: any[];
}
export interface ChatCommandChatter {
  displayName: string;
  userId: string | number;
  userName: string;
  roles: ChatUserRoles;
  features: ChatUserFeatures;
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
  playSound: (soundName: string) => void;
  clearScreen: () => void;
  sendBotMessage: (message: string) => void;
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
}

export interface SoundPlayer {
  initialized: boolean;
  sources: SoundSources;
  init: () => void;
  get: (name: string) => SoundSource | undefined;
  play: (name: string) => void;
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
  initialized: boolean;
  channelName: string; // ched_dev
  ignoredChatters: TwitchChatConfig["ignoredChatters"]; // ched_dev
  hasIdentity: boolean;
  client: TmiClient;
  init: (config: TwitchChatConfig, commands: ChatCommands) => void;
  emitChatCommandsOnSocket: (commands: ChatCommands, socket: Socket, twitchChatConfig: TwitchChatConfig) => void;
}
interface TwitchChatConfig {
  channelName?: string; // "ched_dev"
  ignoredChatters?: string[]; // ["ched_dev"]
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
  on: (eventName: string, callback: function) => void;
  emit: (eventName: string, data: any) => void;
}


/**
 * Window
 */
declare global {
  interface Window {
    io: () => Socket;
  }
}