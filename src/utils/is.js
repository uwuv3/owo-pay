const {
  Message,
  ChatInputCommandInteraction,
  ButtonInteraction,
  User,
} = require("discord.js");

function isMessage(message) {
  return message instanceof Message;
}
function isChatInteraction(interaction) {
  return interaction instanceof ChatInputCommandInteraction;
}
function isButtonInteraction(interaction) {
  return interaction instanceof ButtonInteraction;
}
function isInteraction(interaction) {
  return isChatInteraction(interaction) && isButtonInteraction(interaction);
}
function isUser(user) {
  return user instanceof User;
}
function isString(string) {
  return typeof string == "string";
}
function isNumber(number) {
  return typeof number == "number";
}
function isBoolean(boolean) {
  return typeof boolean == "boolean";
}
function isUndefined(value) {
  return typeof value == "undefined";
}
module.exports = {
  isMessage,
  isUndefined,
  isUser,
  isBoolean,
  isNumber,
  isString,
  isButtonInteraction,
  isChatInteraction,
  isInteraction,
};
