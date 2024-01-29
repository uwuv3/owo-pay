const Eris = require("eris");
class SendOwO {
  /**
   *
   * @param {Eris.Client} client
   * @param {RegExp} data
   * @param {Eris.Message} message
   */
  constructor(client, data, message, oldMessage) {
    this.client = client;
    this.message = message;
    this.oldMessage = oldMessage;
    this.channel = message?.channel;
    this.guildID = message?.guildID;
    this.data = data;
    this.sender = data[1] || undefined;
    this.receiver = data[6] || undefined;
    this.amount = parseFloat(data[2].replace(/,/g, "")) ?? 0;
  }
}
module.exports = SendOwO;
