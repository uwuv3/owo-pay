import * as Discord from "discord.js";
import * as Eris from "eris";

declare class SendOwO {
  public client: isDiDiscord.Client | Eris.Client;
  public message: Discord.Message | Eris.Message;
  public oldMessage: Discord.Message | Eris.Message;
  public channel: Discord.Channel | Eris.Channel;
  public guildID: string;
  public data: RegExpMatchArray;
  public sender: string;
  public receiver: string;
  public amount: number;

  constructor(
    client = Discord.Client | Eris.Client,
    data: RegExp,
    message: Discord.Message | Eris.Message
  );
}

export = SendOwO;
