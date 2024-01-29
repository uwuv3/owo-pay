function isNumber(text) {
  return !isNaN(text);
}
function isString(text) {
  return typeof text == "string";
}
async function isUser(text) {
  return await import("discord.js")
    .then((x) => text instanceof x.User)
    .catch((x) => true);
}
module.exports = { isNumber, isString ,isUser};
