// @ts-check

/**
 * Event Commands Configuration
 * ===
 * Twitch events to listen for via EventSub and PubSub
 * Events listed here will be emitted and listened for on client
 */

/**
 * @typedef {import("../types").EventCommands} EventCommands
 */

/** @type {EventCommands} */
const eventCommands = [
  {
    eventName: "channel-ban",
    eventCommandCallback: () => ({
      clientCommand: "playSound",
      args: ["shutup"]
    })
  },
  {
    eventName: "channel-follow",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "New Follower",
          userName: eventData.user_name,
          action: "follwed",
          sound: "coin",
          timeout: 7 * 1000,
          template: "user-action-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login}, thanks for the follow!`]
      }
    ])
  },
  {
    eventName: "channel-subscribe",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "New Subscriber",
          userName: eventData.user_name,
          action: "subscribed",
          sound: "wow",
          template: "user-action-template"
        }]
      },
      eventData.is_gift ? null : {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login}, thanks for the subscription - you da best!`]
      }
    ])
  },
  {
    eventName: "channel-subscription-message",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "New Subscriber",
          userName: eventData.user_name,
          action: "subscribed with the message",
          message: eventData.message.text,
          sound: "wow",
          template: "user-action-with-message-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login}, thanks for the subscription - you da best!`]
      }
    ])
  },
  {
    eventName: "channel-channel_points_custom_reward_redemption-add",
    eventCommandCallback: (eventData) => ({
      clientCommand: "renderTemplate",
      args: [{
        title: "New Redemption",
        userName: eventData.user_name,
        action: `redeemed ${eventData.reward.title}`,
        sound: "yoink",
        template: "user-action-template"
      }]
    })
  },
  {
    eventName: "channel-raid",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "Incoming Raid!",
          userName: eventData.from_broadcaster_user_name,
          action: `raided with ${eventData.viewers} viewers`,
          sound: "chomp",
          timeout: 12 * 1000,
          template: "user-action-template"
        }]
      },
      // {
      //   clientCommand: "sendBotMessage",
      //   args: [`@${eventData.user_login}, thanks for the raid!`]
      // }
    ])
  }
]

export default eventCommands