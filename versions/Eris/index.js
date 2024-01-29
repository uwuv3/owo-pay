const Eris = require("eris");
const SendOwO = require("./Classes/sendOwo");
//const SendOwO = require("./Classes/SendOwo");

module.exports = (self) => {
  if (!isClient(self.client))
    return self.emit("error", self.getLanguage("error.noClient"));
  self.emit("moduleLoaded", "Loaded Module: " + "Eris");
  self.client.on("messageUpdate", (oldMsg, newMsg) => {
    if (!oldMsg.author.id == self.owoBotID) return;
    const regex = /<@(.*?)> sent ((\d{1,3}(,\d{3})*)+|\d+) (\w+) to <@(.*?)>!/;
    const match = oldMsg?.content.replace(/\*/g, "").match(regex);
    if (!match) return;
    self.emit("sendOwO", new SendOwO(self.client, match, newMsg, oldMsg));
  });
};
function isClient(text) {
  return text instanceof Eris.Client;
}
