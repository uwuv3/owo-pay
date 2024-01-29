# OwO pay

## Geçmiş
1.0.3
- Çoklu versiyon sistemi eklendi.
- Birçok function kaldırıldı.

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

const owopay = new OwOpay(client);

owopay.loadModule(); // Gerekli

owopay.addCash("31", 31); //Para ekler
owopay.removeCash("31", 31); //Para siler
owopay.setCash("31", 31); //Parayı düzenler
owopay.getCash("31"); //Parayı gösterir
owopay.getLanguage("error.resetCash"); // Dil konfigurasyonunda veri çeker

owopay.on("moduleLoaded", console.log); // Modül yüklendimi söyler
owopay.on("error", console.log); // Hata çıktım söyler
owopay.on("sendOwO", console.log); //Birisi owo gönderdimi söler


```

[DISCORD](https://discord.gg/WZssb4FkU4) | [\[\_\_uwu.v3\]](https://discord.com/users/1112945015132536943)
