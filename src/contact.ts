import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { configDir } from "./utils";
import ECDH from "./ECDH";
import type { ContactData, Contact } from "../types";

export function init(name: string, email: string) {
  // create config directory
  mkdirSync(configDir() as string, { recursive: true });

  // generate keys and write config file
  const ecdh = new ECDH();

  const data = {
    name,
    email,
    privateKey: ecdh.getPrivate("base64"),
    publicKey: ecdh.getPublic("base64"),
  };

  writeFileSync(configDir("self.json") as string, JSON.stringify(data));

  // create contacts file
  const contactData = {
    contacts: [],
  };

  writeFileSync(
    configDir("contacts.json") as string,
    JSON.stringify(contactData),
  );
}

export function share() {
  const selfdata = JSON.parse(readFileSync(configDir("self.json")).toString());
  delete selfdata["privateKey"];
  const data = `${Buffer.from(selfdata.name).toString("base64")}.${Buffer.from(selfdata.email).toString("base64")}.${selfdata.publicKey}`;
  return data;
}

export function add(contact: string) {
  const [name, email, publicKey] = contact.split(".");

  const contactData: ContactData = JSON.parse(
    readFileSync(configDir("contacts.json")).toString(),
  );
  contactData.contacts.push({
    name: Buffer.from(name, "base64").toString(),
    email: Buffer.from(email, "base64").toString(),
    publicKey,
  });

  writeFileSync(configDir("contacts.json"), JSON.stringify(contactData));
  return Buffer.from(name, "base64").toString();
}

export function get() {
  return JSON.parse(readFileSync(configDir("contacts.json")).toString())
    .contacts as Contact[];
}

export function del(name: string) {
  let contactData: ContactData = JSON.parse(
    readFileSync(configDir("contacts.json")).toString(),
  );
  contactData.contacts = contactData.contacts.filter((x) => x.name !== name);
  writeFileSync(configDir("contacts.json"), JSON.stringify(contactData));
}
