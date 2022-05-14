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
    eventName: "channel-cheer",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "> New Cheers",
          userName: eventData.is_anonymous ? "`undefined`" : eventData.user_name,
          action: `cheered ${eventData.bits} bits`,
          sound: "wow",
          template: "user-action-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.is_anonymous ? "`undefined`" : eventData.user_name} - thanks for the bits, you da best!`]
      }
    ])
  },
  {
    eventName: "channel-follow",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "> New Follower",
          userName: eventData.user_name,
          action: "followed",
          sound: "coin",
          timeout: 7 * 1000,
          template: "user-action-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login} - thanks for the follow!`]
      }
    ])
  },
  {
    eventName: "channel-subscribe",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "> New Subscription",
          userName: eventData.user_name,
          action: "subscribed",
          sound: "wow",
          template: "user-action-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login} - thanks for the subscription, you da best!`]
      }
    ])
  },
  {
    eventName: "channel-subscription-message",
    eventCommandCallback: (eventData) => ([
      {
        clientCommand: "renderTemplate",
        args: [{
          title: "> New Subscription" + (eventData.cumulative_months ? ` / ${eventData.cumulative_months} months` : ""),
          userName: eventData.user_name,
          action: `subscribed${eventData.streak_months ? [" on a", eventData.streak_months, "month streak"].join(" ") : ""}${eventData.message.text ? " with the msg" : ""}`,
          message: eventData.message.text || undefined,
          sound: "wow",
          template: eventData.message.text ? "user-action-with-message-template" : "user-action-template"
        }]
      },
      {
        clientCommand: "sendBotMessage",
        args: [`@${eventData.user_login} - thanks for the subscription, you da best!`]
      }
    ])
  },
  {
    eventName: "channel-channel_points_custom_reward_redemption-add",
    eventCommandCallback: (eventData) => ({
      clientCommand: "renderTemplate",
      args: [{
        title: "> New Redemption",
        userName: eventData.user_name,
        action: `redeemed ${eventData.reward.title}`,
        sound: eventData.reward.title === "hydrate level 4 pls" ? "hydrate" : "yoink",
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
          title: "> Incoming Raid",
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