import { readFileSync } from "fs";
import type { SelfData } from "../types";
import { configDir } from "./utils";
import ECDH from "./ECDH";

export function encrypt(path: string, key: string) {
  const selfData: SelfData = JSON.parse(
    readFileSync(configDir("self.json")).toString(),
  );

  const self = new ECDH();
  self.setPrivate(Buffer.from(selfData.privateKey, "base64"));

  self.encrypt_file(path, Buffer.from(key, "base64"));
}

export function decrypt(path: string) {
  const selfData: SelfData = JSON.parse(
    readFileSync(configDir("self.json")).toString(),
  );

  const self = new ECDH();
  self.setPrivate(Buffer.from(selfData.privateKey, "base64"));

  self.decrypt_file(path);
}
