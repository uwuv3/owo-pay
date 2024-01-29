const { Client, Message } = require("discord.js");

class SendOwO {
  /**
   *
   * @param {Client} client
   * @param {RegExp} data
   * @param {Message} message
   */
  constructor(client, data, message,oldMessage) {
    this.client = client;
    this.message = message;
    this.oldMessage = oldMessage;
    this.channel = message?.channel;
    this.guild = message?.guild?.id
    this.data = data;
    this.sender = data[1] || undefined;
    this.receiver = data[6] || undefined;
    this.amount = parseFloat(data[2].replace(/,/g, "")) ?? 0;
  }
}
module.exports = SendOwO;
