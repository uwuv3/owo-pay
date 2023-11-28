const { Client, Message } = require("discord.js");

class failBuy {
  /**
   *
   * @param {Client} client
   * @param {{item:{isim:String,fiyat:Number,kime:String,id:String},sender:String,needCash:Number}} data
   * @param {Message} message
   */
  constructor(client, data, message) {
    this.client = client;
    this.message = message;
    this.channel = message?.channel;
    this.data = data;
    this.user = data.sender;
    this.needCash = data.needCash;
    this.item = data.item;
  }
}
module.exports = failBuy;
