import { Channel, Client, Guild, Message } from "discord.js";

export = class sendOwO {
  constructor(client: any | Client, data: RegExp, message: Message);
  client = Client | any;
  message = Message | any;
  channel = Channel | any;
  guild = Guild | any;
  data = any;
  sender = string | any;
  receiver = string | any;
  amount = number;
};
