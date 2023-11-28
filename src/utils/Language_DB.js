const fs = require("fs");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const write = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 4));

class Database {
  constructor() {
    this.file = "./owo_pay/language.json"
      if (!this.file.includes("./")) this.file = "./" + this.file;
      try {
        load(this.file);
      } catch {
        write(this.file, require("../default_language.json"));
        console.log("Bir hata oluştu, varsayılan dil konfigurasyonu yükleniyor...")
      }
    
  }
  all() {
    return load(this.file);
  }

  get(data) {
    if (!data) throw Error("[err] No data to get");
    let fileData = load(this.file);
    if (!fileData[data]) fileData[data] = null;
    return fileData[data];
  }

}

module.exports = { Database };
