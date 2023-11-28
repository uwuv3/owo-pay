const CroxyDB = require("croxydb");
const {
  Message,
  Client,
  User,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  Colors,
  ComponentType,
} = require("discord.js");
const { v4: uuidv4 } = require("uuid");
const SendOwO = require("./Classes/SendOwo");
const ms = require("ms");
const addCash = require("./Classes/addCash");
const successBuy = require("./Classes/successBuy");
const failBuy = require("./Classes/failBuy");
const {
  isMessage,
  isUndefined,
  isUser,
  isBoolean,
  isNumber,
  isString,
  isButtonInteraction,
  isChatInteraction,
  isInteraction,
} = require("./utils/is");
const { wait } = require("./utils/util");
const config = {
  owoBotID: "408785106942164992",
};
var version = require("discord.js").version.split("");
if (version.includes("("))
  version = version.join("").split("(").pop().split("");
version = parseInt(version[0] + version[1]);
const fs = require("fs");
const path = require("path");
const { Database } = require("./utils/Language_DB");
CroxyDB.setFolder("./owo_pay");
CroxyDB.setReadable(true);
const folderPath = "./owo_pay";
const targetFileName = "default.json";
const sourceFilePath = path.join(__dirname, "default_language.json");
const targetFilePath = path.join(folderPath, targetFileName);
const language = new Database();
module.exports.language = language;
/** @param {Client} client */
module.exports = (client, readable = true) => {
  CroxyDB.setReadable(readable);
  if (version != 14) {
    throw new Error(language.get("error.no_v14"));
  }
  if (!(client instanceof Client))
    throw new Error(language.get("error.invalid_client"));
  global.client = client;
  client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (newMsg.author.id == config.owoBotID) {
      //if (!oldMsg.embeds[0]?.footer?.text.includes("accepted")) return;
      const regex =
        /<@(.*?)> sent ((\d{1,3}(,\d{3})*)+|\d+) (\w+) to <@(.*?)>!/;
      const match = newMsg.content.replace(/\*/g, "").match(regex);
      if (!match) return;
      client.emit("sendOwo", new SendOwO(client, match, newMsg));
      const sender = match[1];
      const value = await CroxyDB.get(`${sender}`);
      if (!value.islem) return;
      const itemler = (await CroxyDB.get("itemler")) || [];
      const mappedItems = await Promise.all(
        itemler.map(async (x) => {
          if (x.id === value.islem) {
            return {
              value: value,
              fiyat: x.fiyat,
              emoji: x.emoji,
              who: x.kime,
            };
          } else {
            return undefined;
          }
        })
      );
      const get = mappedItems
        .filter((x) => typeof x !== "undefined")
        .find((x) => x);
      if (get.who !== match[6]) return;
      let fiyat = (await CroxyDB.get(`${value.islem}.${sender}`)) ?? 0;

      let amount =
        (parseFloat(match[2].replace(/,/g, "")) ?? 0) + (value.artan ?? 0);
      if (fiyat == "owned") {
        CroxyDB.delete(`${sender}.islem`);
        CroxyDB.add(`${sender}.artan`, amount);
        client.emit(
          "addCash",
          new addCash(client, { amount: amount, sender: sender }, newMsg)
        );
      }
      if (amount > fiyat) {
        amount -= fiyat;
        fiyat = 0;
      } else {
        fiyat -= amount;
        amount = 0;
      }
      if (fiyat > 0) {
        await CroxyDB.set(`${value.islem}.${sender}`, fiyat);
        client.emit(
          "failBuy",
          new failBuy(
            client,
            { item: get, sender: sender, needCash: fiyat },
            newMsg
          )
        );
      } else {
        await CroxyDB.set(`${value.islem}.${sender}`, "owned");
        CroxyDB.delete(`${sender}.islem`);
        client.emit(
          "successBuy",
          new successBuy(client, { item: get, sender: sender }, newMsg)
        );
      }
      if (amount > 0) {
        CroxyDB.add(`${sender}.artan`, amount);
        client.emit(
          "addCash",
          new addCash(client, { amount: amount, sender: sender }, newMsg)
        );
      }
    }
  });
};
/**
@param {string | User} user ID ile Filtrelemek için
 ** Bu işlem satın alınmayanları gösterir
 * @returns {Array<{ isim: string,fiyat: number,emoji: string | undefined,kime: string,id: string}>}
 */
const getList = async (user, reserve) => {
  const itemler = (await CroxyDB.get("itemler")) || [];
  const mapItem = async (x, index, array, userID) => {
    const value =
      array.findIndex((item) => item.isim === x.isim) !== index
        ? `${x.isim}${index + 1}`
        : x.isim;

    const data = await CroxyDB.get(`${x.id}.${userID}`);
    if ((reserve && data === "owned") || (!reserve && data !== "owned")) {
      return {
        isim: value,
        fiyat: x.fiyat,
        emoji: x.emoji,
        kime: x.kime,
        id: x.id,
      };
    }
    return undefined;
  };

  if (!user && isNaN(parseInt(user)) && !isUser(user)) {
    const list = await Promise.all(
      itemler.map(async (x, index, array) => mapItem(x, index, array, null))
    );
    return list.filter((x) => x);
  }

  const userID = isUser(user) ? user.id : user;
  const list = await Promise.all(
    itemler.map(async (x, index, array) => mapItem(x, index, array, userID))
  );
  return list.filter((x) => x);
};

/**
 * @param {string} id Item ID
 * @returns {{isim:String,fiyat:Number,kime:String,id:String}}
 */
const getItem = async (id) => {
  const itemler = await getList();
  return itemler.find((x) => x.id == id);
};
/** @param {string | User} user ID ile Filtrelemek için*/
const getUser = async (user) => {
  if (isNaN(parseInt(user)) && !isUser(user))
    throw new Error(language.get("error.invalid_user"));
  const userID = isUser(user) ? user.id : user;
  const itemler = (await CroxyDB.get(userID)) || {};
  let json = {};
  json.id = userID;
  if (itemler.artan) json.artanPara = itemler.artan;

  if (itemler.islem) {
    json.suankiIslem = await getItem(itemler.islem);
    json.gerekenPara = (await CroxyDB.get(`${itemler.islem}.${userID}`)) ?? 0;
  }
  const list2 = await getList(userID, true);
  if (list2.length > 0) json.satınAlınanlar = list2;
  return json;
};
/**
 * @param {string | User} user ID ile Filtrelemek için
 * @param {number} cash ID ile Filtrelemek için
 */
const addCashFunction = async (user, cash, message) => {
  if (isNaN(parseInt(user)) && !isUser(user))
    throw new Error(language.get("error.invalid_user"));
  if (!isNumber(cash)) throw new Error(language.get("error.invalid_number"));
  if (!isInteraction(message) && !isMessage(message))
    throw new Error(language.get("error.invalid_message"));

  try {
    const userID = isUser(user) ? user.id : user;
    CroxyDB.add(`${userID}.artan`, cash);
    const veri = (await CroxyDB.get(`${userID}`)) ?? {};
    if (veri.islem) {
      let artanveri = veri.artan ?? 0;
      let gereken = (await CroxyDB.get(`${veri.islem}.${userID}`)) ?? 0;
      const item = await getItem(veri.islem);

      if (gereken > artanveri) {
        gereken -= artanveri;
        artanveri = 0;
      } else {
        artanveri -= gereken;
        gereken = 0;
      }

      if (artanveri > 0) {
        await CroxyDB.set(`${userID}.artan`, artanveri);
        if (global.client instanceof Client)
          global.client.emit(
            "addCash",
            new addCash(
              global.client,
              {
                amount: artanveri,
                sender: userID,
                system: true,
              },
              message
            )
          );
      } else {
        CroxyDB.delete(`${userID}.artan`);
      }

      if (gereken > 0) {
        await CroxyDB.set(`${item.id}.${userID}`, gereken);
      } else {
        CroxyDB.delete(`${userID}.islem`);
        await CroxyDB.set(`${item.id}.${userID}`, "owned");
        if (global.client instanceof Client)
          global.client.emit(
            "successBuy",
            new successBuy(
              global.client,
              {
                item: item,
                sender: userID,
                system: true,
              },
              message
            )
          );
      }
    } else {
      if (global.client instanceof Client)
        global.client.emit(
          "addCash",
          new addCash(
            global.client,
            {
              amount: cash,
              sender: userID,
              system: true,
            },
            message
          )
        );
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
/** @param {string | User} user ID ile Filtrelemek için */
const removeUser = async (user) => {
  if (isNaN(parseInt(user)) && !isUser(user))
    throw new Error(language.get("error.invalid_user"));
  let userID = user;
  if (isUser(user)) userID = user.id;
  await getList(userID, true).forEach((x) => {
    CroxyDB.delete(`${x.id}.${userID}`);
  });
  return CroxyDB.delete(userID);
};
/**
 * @param {string | User} user ID ile Filtrelemek için
 * @param {ChatInputCommandInteraction | Message} message mesaj
 */
const sendUser = async (user, message) => {
  if (!isMessage(message) && !isInteraction(message))
    throw new Error(language.get("error.invalid_message"));
  const list = await getUser(user);
  const embed = new EmbedBuilder()
    .setTitle(
      language.get("embed.title.user_info").replace(/\{userID\}/g, list.id)
    )
    .setColor(Colors.Aqua)
    .setDescription(
      language
        .get("embed.user_info")
        .replace(/\{userID\}/g, list.id)
        .replace(/\{artanPara\}/g, list.artanPara ?? 0)
        .replace(/\{gerekenPara\}/g, list.gerekenPara ?? 0)
        .replace(
          /\{nowBuying\}/g,
          list.suankiIslem?.isim ?? language.get("text.nothing")
        )
        .replace(
          /\{buyed\}/g,
          list.satınAlınanlar
            ? list.satınAlınanlar.map((x) => x.isim)
            : language.get("text.nothing")
        )
    )
    .setFooter({
      text: language.get("embed.footer.default"),
    });
  await message.reply({
    embeds: [embed],
  });
};

/**
 * @param {Strig} name Eşyanın adı
 * @param {String} emoji Eşyanın emojisi
 * @param {Number} cash Eşyanın parası
 * @param {User | String} who Paranın kime gideceği
 */
const addItem = (name, emoji, cash, who) => {
  if (!isString(name)) throw new Error(language.get("error.invalid_string"));
  if (!isNumber(cash)) throw new Error(language.get("error.invalid_number"));
  if (isNaN(parseInt(who)) && !isUser(who))
    throw new Error(language.get("error.invalid_user"));

  let user = who;
  if (isUser(who)) user = who.id;
  let emojii;
  if (isString(emoji)) emojii = emoji;
  try {
    const randomID = uuidv4();
    CroxyDB.push("itemler", {
      isim: name,
      fiyat: cash,
      emoji: emojii,
      kime: user,
      id: randomID,
    });
    return randomID;
  } catch (error) {
    return false;
  }
};
/** @param {String} name Eşyanın idsi */
const removeItem = async (id) => {
  if (!isString(id)) throw new Error(language.get("error.invalid_string"));

  try {
    let get = (await CroxyDB.get("itemler")) || [];
    get = get.filter((item) => item.id !== id);
    let get2 = Object.keys((await CroxyDB.get(id)) || {});
    get2.forEach((x) => {
      if (CroxyDB.has(`${x}.islem`)) CroxyDB.delete(`${x}.islem`);
    });
    CroxyDB.delete(id);
    return await CroxyDB.set("itemler", get);
  } catch (error) {
    return false;
  }
};
/**
 * @param {ChatInputCommandInteraction | Message} message ID ile Filtrelemek için
 ** Bu işlem satın alınmayanları gösterir
 */
const sendList = async (message) => {
  let userID;
  let interaction;

  if (isMessage(message)) {
    userID = message.author.id;
    interaction = message;
  } else if (isChatInteraction(message) || isButtonInteraction(message)) {
    userID = message.user.id;
    interaction = message;
  } else {
    throw new Error(language.get("error.invalid_message"));
  }

  const itemList = (await getList(userID)).slice(0, 25);

  if (itemList.length <= 0) {
    return await sendError(language.get("error.no_item"), interaction);
  }

  const islem = await CroxyDB.get(`${userID}.islem`);
  if (islem) {
    return await sendError(
      language
        .get("error.now_buying")
        .replace(/\{itemName\}/g, itemList.find((x) => x.x.id == islem)?.value)
        .replace(/\{itemID\}/g, x.x.id),
      interaction
    );
  }

  const selectMenuOptions = itemList.map((x) => {
    return {
      label: x.isim + " -> " + x.fiyat,
      value: x.id,
      emoji: x.emoji,
      x: x,
    };
  });

  const selectMenuRow = new ActionRowBuilder().setComponents(
    new StringSelectMenuBuilder()
      .setPlaceholder(language.get("text.select_buy_item"))
      .setCustomId("itemal")
      .addOptions(selectMenuOptions)
  );

  const sendMessage = await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(language.get("embed.title.buy_item"))
        .setColor(Colors.Aqua)
        .setDescription(language.get("embed.buy_item"))
        .setFooter({
          text: language.get("embed.footer.default"),
        }),
    ],
    components: [selectMenuRow],
  });

  const collector = sendMessage.createMessageComponentCollector({
    max: 1,
    componentType: ComponentType.StringSelect,
    filter: (i) => i.user.id == userID,
    time: ms("10m"),
  });

  collector.on("collect", async (int) => {
    const values = int.values[0];
    let selectedItem = selectMenuOptions.find((x) => x.value == values);

    if (!selectedItem) {
      return await sendError(language.get("error.fail_item"), int);
    }

    let artanveri = (await CroxyDB.get(`${userID}.artan`)) ?? 0;

    if (selectedItem.x.fiyat > artanveri) {
      selectedItem.x.fiyat -= artanveri;
      artanveri = 0;
    } else {
      artanveri -= selectedItem.x.fiyat;
      selectedItem.x.fiyat = 0;
    }
    const client = message.client;
    if (artanveri > 0) {
      await CroxyDB.set(`${userID}.artan`, artanveri);
    } else {
      CroxyDB.delete(`${userID}.artan`);
    }

    if (selectedItem.x.fiyat > 0) {
      await CroxyDB.set(`${userID}.islem`, selectedItem.x.id);
    }

    if (selectedItem.x.fiyat > 0) {
      await CroxyDB.set(`${selectedItem.x.id}.${userID}`, selectedItem.x.fiyat);
    } else {
      if (global.client instanceof Client)
        global.client.emit(
          "successBuy",
          new successBuy(client, {
            item: selectedItem.x,
            sender: userID,
            system: true,
          })
        );
      await CroxyDB.set(`${selectedItem.x.id}.${userID}`, "owned");
    }

    sendMessage
      .edit({
        components: [],
        embeds: [
          new EmbedBuilder()
            .setTitle(language.get("embed.title.buy_item_started"))
            .setDescription(
              language
                .get("embed.title.buy_item_started")
                .replace(/\{itemName\}/g, selectedItem.x.isim)
                .replace(/\{itemID\}/g, selectedItem.x.id)
                .replace(
                  /\{price\}/g,
                  selectedItem.x.fiyat > 0
                    ? selectedItem.x.fiyat
                    : language.get("text.buyed")
                )
                .replace(/\{sendUserID\}/g, selectedItem.x.kime)
            )
            .setColor(Colors.Green)
            .setFooter({
              text: language.get("embed.footer.buy_item_started"),
            }),
        ],
      })
      .then(
        async (x) =>
          (await wait(5000)) &&
          isMessage(message) &&
          x.delete().catch((x) => true) &&
          message.delete().catch((x) => true)
      );
  });
};

async function sendError(text, message) {
  const embed = new EmbedBuilder()
    .setTitle(language.get("embed.title.error"))
    .setDescription(text)
    .setColor(Colors.Red)
    .setFooter({
      text: language.get("embed.footer.default"),
    });
  return await message
    .reply({
      embeds: [embed],
      ephemeral: true,
    })
    .then(
      async (x) =>
        (await wait(5000)) &&
        isMessage(message) &&
        x.delete().catch((x) => true) &&
        message.delete().catch((x) => true)
    );
}
module.exports.sendList = sendList;
module.exports.getList = getList;
module.exports.addItem = addItem;
module.exports.removeItem = removeItem;
module.exports.getUser = getUser;
module.exports.sendUser = sendUser;
module.exports.getItem = getItem;
module.exports.removeUser = removeUser;
module.exports.addCash = addCashFunction;
