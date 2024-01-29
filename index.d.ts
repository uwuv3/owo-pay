import { Client } from "discord.js";
import sendOwO from "./Classes/sendOwo";
class OwOpay {
  constructor(client: Client | any);
  client: Client;
  on(event: "error", listener: (data: string) => void): this;
  on(event: "debug", listener: (data: string) => void): this;
  on(event: "moduleLoaded", listener: (data: string) => void): this;
  on(event: "sendOwO", listener: (data: sendOwO) => void): this;
  /**
   * Required Action
   */
  async loadModule(): void;
  /**
   * Gets language value from language.json
   */
  getLanguage(args: string): void;
  /**
   * Adds cash to cash.json
   */
  async addCash(user: string, number: number): boolean;
  /**
   * Removes cash to cash.json
   */
  async removeCash(user: string, number: number): boolean;
  /**
   * Sets cash to cash.json
   */
  async setCash(user: string, number: number): boolean;
  /**
   * Gets cash to cash.json
   */
  async getCash(user: string, number: number): number;
}
export = OwOpay;
