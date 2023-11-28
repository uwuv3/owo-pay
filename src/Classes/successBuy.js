const { Client, Message } = require("discord.js");

class successBuy {
  /**
   *
   * @param {Client} client
   * @param {{item:{isim:String,fiyat:Number,kime:String,id:String},sender:String,system:boolean}} data
   * @param {Message} message
   */
  constructor(client, data, message) {
    this.client = client;
    this.message = message;
    this.channel = message?.channel;
    this.data = data;
    this.user = data.sender;
    this.item = data.item;
    this.isSystem = () => data.system;
  }
}
module.exports = successBuy;
