// @ts-check

/**
 * @typedef {import("../types").ChatApp} ChatApp
 */

/** @type {ChatApp} */
const chatApp = {

  initialized: false,
  id: "chat-app",
  chats: [],
  $el: undefined,
  template: (
    `
      <div class="chat-app-message {isBotClass} {isBroadcasterClass}">
        <span class="chat-username">{userName}</span>
        <span class="chat-message">{message}</span>
      </div>
    `
  ),

  // init all audio sources so they are ready to play
  // only works in browser
  // the user must interact with the page before audio can play
  init() {
    this.$el = document.getElementById(this.id);
    this.initialized = true;
  },
  render(chat) {
    if (chat) {
      this.chats.push(chat);

      if (this.chats.length > 5) {
        this.chats.unshift();
      }
    }

    this.$el.innerHTML = `
    <div class="chat-container">
      <div class="chat-title">
        Chat
      </div>
      <div class="chat-messages">
        ${this.chats.map(chat => 
          this.template
            .replace("{userName}", chat.chatter.displayName)
            .replace("{message}", chat.message)
            .replace("{isBroadcasterClass}", chat.chatter.roles.broadcaster ? "chat-broadcaster-message" : "")
            .replace("{isBotClass}", chat.chatter.isBot ? "chat-bot-message" : "")
        ).join("")}
      </div>
    </div>
    `
  }
};

export default chatApp;