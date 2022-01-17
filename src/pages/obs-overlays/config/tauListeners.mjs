// twitch events to listen for in TAU and emit on client socket
export default [
  {
    eventName: "channel-follow",
    clientCallback: (eventData) => ({
      title: "New Follower",
      userName: eventData.user_name,
      action: "follwed",
      sound: "coin",
      timeout: 7 * 1000
    })
  },
  {
    eventName: "channel-subscribe",
    clientCallback: (eventData) => ({
      title: "New Subscriber",
      userName: eventData.user_name,
      action: "subscribed",
      sound: "wow"
    })
  },
  {
    eventName: "channel-subscription-message",
    clientCallback: (eventData) => ({
      title: "New Subscriber",
      userName: eventData.user_name,
      action: "subscribed with the message",
      message: eventData.message.text,
      sound: "wow",
      template: "messageWithMessage"
    })
  },
  {
    eventName: "channel-channel_points_custom_reward_redemption-add",
    clientCallback: (eventData) => ({
      title: "New Redemption",
      userName: eventData.user_name,
      action: `redeemed ${eventData.reward.title}`,
      sound: "meow"
    })
  },
  {
    eventName: "channel-raid",
    clientCallback: (eventData) => ({
      title: "Incoming Raid!",
      userName: eventData.from_broadcaster_user_name,
      action: `raided with ${eventData.viewers} viewers`,
      sound: "chomp",
      timeout: 12 * 1000
    })
  }
]