const EventEmitter = require("events");
const fs = require("fs");
const path = require("path");
const { isString, isNumber, isUser } = require("./utils/is.js");
const load = (file) => JSON.parse(fs.readFileSync(file, "utf-8"));
const write = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 4));
module.exports = class OwOpay extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
    this.owoBotID = "408785106942164992";
    this.module;
    this.cwd = process.cwd();
    this.folder = "owo_pay";
    this.languageFile = "language.json";
    this.cash = "cash.json";
    const folderPath = path.join(this.cwd, this.folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const languageFilePath = path.join(folderPath, this.languageFile);
    const cashFilePath = path.join(folderPath, this.cash);

    try {
      load(languageFilePath);
    } catch (error) {
      fs.copyFileSync(
        "./default_language.json",
        path.join(this.cwd, this.folder, this.languageFile)
      );
      this.emit("error", this.getLanguage("error.loadedDefaultLanguage"));
    }

    try {
      load(cashFilePath);
    } catch (error) {
      write(cashFilePath, {});
      this.emit("error", this.getLanguage("error.resetCash"));
    }
  }
  getLanguage(args) {
    this.emit("debug", "Trying to get langugage: ", args);
    try {
      const db = load(path.join(this.cwd, this.folder, this.languageFile));
      if (!isString(args)) throw new Error();
      return db[args];
    } catch (error) {
      const db = require("./default_language.json");
      if (!isString(args)) {
        const language = db["error.noString"];
        throw new Error(language);
      }
      return db[args];
    }
  }
  async addCash(user, number) {
    if (isNaN(parseInt(`${user}`)) && !(await isUser(user)))
      throw new Error(language.get("error.invalidUser"));
    if (!isNumber(number)) throw new Error(this.getLanguage("error.noNumber"));
    this.emit("debug", "Adding cash ", user, "=>", number);
    try {
      let db = load(path.join(this.cwd, this.folder, this.cash));
      const userID = (await isUser(user)) ? user.id : user;
      let veri = db[userID] ?? 0;
      veri = veri + number;
      db[userID] = veri;
      write(path.join(this.cwd, this.folder, this.cash), db);
      return true;
    } catch (error) {
      this.emit("error", "[OWO PAY] [ADD CASH] " + error);
      return false;
    }
  }
  async removeCash(user, number) {
    if (isNaN(parseInt(`${user}`)) && !(await isUser(user)))
      throw new Error(language.get("error.invalidUser"));
    if (!isNumber(number)) throw new Error(this.getLanguage("error.noNumber"));
    this.emit("debug", "Removing cash ", user, "=>", number);
    try {
      let db = load(path.join(this.cwd, this.folder, this.cash));
      const userID = (await isUser(user)) ? user.id : user;
      let veri = db[userID] ?? 0;
      veri = veri - number;
      db[userID] = veri;
      write(path.join(this.cwd, this.folder, this.cash), db);
      return true;
    } catch (error) {
      this.emit("error", "[OWO PAY] [REMOVE CASH] " + error);
      return false;
    }
  }
  async setCash(user, number) {
    if (isNaN(parseInt(`${user}`)) && !(await isUser(user)))
      throw new Error(language.get("error.invalidUser"));
    if (!isNumber(number)) throw new Error(this.getLanguage("error.noNumber"));
    this.emit("debug", "Removing cash ", user, "=>", number);
    try {
      let db = load(path.join(this.cwd, this.folder, this.cash));
      const userID = (await isUser(user)) ? user.id : user;

      db[userID] = number;
      write(path.join(this.cwd, this.folder, this.cash), db);
      return true;
    } catch (error) {
      this.emit("error", "[OWO PAY] [REMOVE CASH] " + error);
      return false;
    }
  }
  async getCash(user, number) {
    if (isNaN(parseInt(`${user}`)) && !(await isUser(user)))
      throw new Error(language.get("error.invalidUser"));
    if (!isNumber(number)) throw new Error(this.getLanguage("error.noNumber"));
    this.emit("debug", "Removing cash ", user, "=>", number);
    try {
      let db = load(path.join(this.cwd, this.folder, this.cash));
      const userID = (await isUser(user)) ? user.id : user;

      return db[userID] ?? 0;
    } catch (error) {
      this.emit("error", "[OWO PAY] [REMOVE CASH] " + error);
      return false;
    }
  }
  async loadModule() {
    const discordVersion = await import("discord.js")
      .catch((x) => undefined)
      .then(async function (djs) {
        try {
          let discordVersion = djs.version.split("");
          if (discordVersion.includes("("))
            discordVersion = discordVersion.join("").split("(").pop().split("");
          discordVersion = parseInt(discordVersion[0] + discordVersion[1]);
          let moduleFunction;
          if (discordVersion == 12) {
            moduleFunction = "./versions/DiscordJS/v12/";
          } else if (discordVersion == 13) {
            moduleFunction = "./versions/DiscordJS/v13/";
          } else if (discordVersion == 14) {
            moduleFunction = "./versions/DiscordJS/v14/";
          } else {
            return undefined;
          }
          return moduleFunction;
        } catch (error) {
          return undefined;
        }
      });
    this.moduleFunction = discordVersion;

    if (!this.moduleFunction) {
      const erisVersion = await import("eris")
        .catch((x) => undefined)
        .then(async function (eris) {
          try {
            return "./versions/Eris/";
          } catch (error) {
            console.log(error);
            return undefined;
          }
        });
      this.moduleFunction = erisVersion;
    }
    if (this.moduleFunction) {
      this.emit("debug", "Loading module");
      this.moduleFunction = require(this.moduleFunction + "index.js").bind(
        null,
        this
      );
      this.moduleFunction();
    }
    if (!this.moduleFunction)
      this.emit("error", this.getLanguage("error.unsupportedversion"));
  }
};
