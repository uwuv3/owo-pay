const { Client, Message } = require("discord.js");
const { isMessage, isInteraction } = require("../utils/is");

class addCash {
  /**
   *
   * @param {Client} client
   * @param {{sender:String,amount:Number,system:true}} data
   * @param {Message} message
   */
  constructor(client, data, message) {
    this.client = client;
    this.message = message;
    this.channel = message?.channel;
    this.data = data;
    this.user = data.sender;
    this.amount = data.amount;
    this.isMessage =  () => isMessage(message)
    this.isInteraction =  () => isInteraction(message)
    this.isSystem = () => data.system;
  }
}
module.exports = addCash;
