const { Client } = require("discord.js");
const SendOwO = require("./Classes/SendOwo");

module.exports = (self) => {
  if (!isClient(self.client))
    return self.emit("error", self.getLanguage("error.noClient"));
  self.emit("moduleLoaded", "Loaded Module: " + "DiscordJS_14");
  self.client.on("messageUpdate", (oldMsg, newMsg) => {
    if (!newMsg.author.id == self.owoBotID) return;
    const regex = /<@(.*?)> sent ((\d{1,3}(,\d{3})*)+|\d+) (\w+) to <@(.*?)>!/;
    const match = newMsg.content.replace(/\*/g, "").match(regex);
    if (!match) return;
    self.emit("sendOwO", new SendOwO(self.client, match, newMsg));
  });
};
function isClient(text) {
  return text instanceof Client;
}
