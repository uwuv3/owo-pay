import EventEmitter from "events";
import sendOwO from "./Classes/sendOwo";
declare class OwOpay extends EventEmitter {
  constructor(client: any);
  client: any;
  on(event: "error", listener: (data: string) => void): this;
  on(event: "debug", listener: (data: string) => void): this;
  on(event: "moduleLoaded", listener: (data: string) => void): this;
  on(event: "sendOwO", listener: (data: sendOwO) => void): this;
  /**
   * Required Action
   */
  loadModule(): Promise<void>;
  /**
   * Gets language value from language.json
   */
  getLanguage(args: string): void;
  /**
   * Adds cash to cash.json
   */
  addCash(user: string, number: number): Promise<boolean>;
  /**
   * Removes cash to cash.json
   */
  removeCash(user: string, number: number): Promise<boolean>;
  /**
   * Sets cash to cash.json
   */
  setCash(user: string, number: number): Promise<boolean>;
  /**
   * Gets cash to cash.json
   */
  getCash(user: string, number: number): Promise<number>;
}
export = OwOpay;
