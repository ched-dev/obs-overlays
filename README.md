# Setup

For first install,

```
npm install
```

add `.env` file with Twitch App info

```
PORT=4343
SECRET=alongstringoftext
CLIENT_ID=twitchapp_client_id
CLIENT_SECRET=twitchapp_client_secret
```

then run with

```
node src/connect.js
```

visit `http://localhost:8000/` and you will see

```
@twurple/eventsub is listening here
```