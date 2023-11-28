# OwO pay

## Geçmiş
1.0.2
- Dil sistemi eklendi!

1.0.1.8
- addCash functionunda client verisi kalktı
- addCash eventindeki hata kalktı

1.0.1
- addCash functionu eklendi
- Teknik hatalar düzeltildi

## Nasıl kullanılır

```js
const { Client } = require("discord.js");
const client = new Client(/* Ayarlamalar */);
const owoPay = require("@uwuv3/owo-pay");
owoPay(client);

//Eşya eklemek için
const id = owoPay.addItem(
  "OwO para",
  "<:owo:1170502167254269972>",
  2000,
  "1112945015132536943"
);
//Eşya silmek için
owoPay.removeItem(id);
//Tüm Liste
owoPay.getList();
//Kullanıcı silme
owoPay.removeUser("userID")
//[YENI] Para ekleme
OwOpay.addCash("1112945015132536943", 2000, client);

//Olaylar
client.on(
  "sendOwo",
  /** @param {import("@uwuv3/owo-pay/src/Classes/SendOwo")} test */ (test) => {/*Birine owo atıldımı gider*/});

client.on(
  "successBuy",
  /** @param {import("@uwuv3/owo-pay/src/Classes/SendOwo")} test */ (test) => {/*Biri başarılı bir şekilde eşya aldımı gider*/
       if (!test.isSystem()) await test.message.reply({
      allowedMentions: { users: [test.user, test.item.kime] },
      embeds: [{ title: "Satın alım başarılı", color: Colors.Green }],
    })});

client.on(
  "failBuy",
  /** @param {import("@uwuv3/owo-pay/src/Classes/SendOwo")} test */ (test) => {/*Biri hatalı bir şekilde eşya aldımı gider*/
     if (!test.isSystem()) await test.message.reply({
      allowedMentions: { users: [test.user] },
      embeds: [
        {
          title: "Eksik para verdin",
          color: Colors.Red,
          description: `${test.needCash} kadar para daha vermen lazım`,
        },
      ],
    })});

//Embedler
client.on("messageCreate", async (message) => {
  if (message.content == "ben")
    return await OwOpay.sendUser(message.author, message);
  if (message.content == "satın-al") return await OwOpay.sendList(message);
});
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName == "satın-al")
    return await OwOpay.sendList(interaction);
});
```

[DISCORD](https://discord.gg/WZssb4FkU4) | [\[\_\_uwu.v3\]](https://discord.com/users/1112945015132536943)
