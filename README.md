# OBS Overlays

This local application allows you to display overlays in OBS using a browser source. 

## Features

- [x] Listen for [Twitch Events](./docs/specs/index.md#twitch-events) (Follow, Subscribe, Channel Point Redemptions, Cheer, Hype Train, etc.)
- [x] Listen for Twitch Chat Commands (!discord, !commands, !clap) based on chatter permissions
- [x] Connect a [Chat Bot](./docs/overview.md#chat-bot) and send messages in chat
- [x] Common Sound clips included, or add your own
- [x] Notification templates built in HTML/CSS
- [x] Limit access to commands & sounds by role (moderator, vip, follower, subscriber, etc.)
- [x] Easy customization via configuration based code
- [x] Prebuilt [Client Commands](./docs/overview.md#client-command) for rendering HTML/CSS templates, playing sounds, sending bot messages, etc.
- [x] Create custom Client Commands for endless functionality (launching a game, hitting an API)

To Do:
- [ ] Command Cooldowns
- [ ] New `showMedia` Client Command
- [ ] `!so` Shoutout Command
- [ ] Hype Train Alert
- [ ] Polls and Predictions Alert
- [ ] Add Queuing to Alerts
- [ ] Turn off TAU or Chat events
- [ ] Stream Stats ending screen (# of Raids, Follows, etc.)

## Documentation

- [Overview](./docs/overview.md#obs-overlays-overview) for a general understanding of how this application works
- [Guides](./docs/guides.md#guides)
- [Config Docs](./docs/config.md#obs-overlays-configuration) for customizing listeners of Event Commands and Client Commands

## Praise

I have tested getting Twitch events from EventSub and PubSub with several libraries ([Twurple](https://twurple.js.org/), [TwitchPS](https://www.npmjs.com/package/twitchps), [TwitchWebhook](https://www.npmjs.com/package/twitch-webhook) \[deprecated\]) and none of them would work correctly.

[TAU](https://github.com/Team-TAU/tau) is the holy grail that takes the pain away. I would recommend it to all who want Twitch event notifications.

If you just want some chat integration, you could use [tmi.js](https://tmijs.com/).

## License

This project is licensed under [MIT](./LICENSE) and is free for you to fork and make your own.