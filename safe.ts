#!/bin/env bun

import { Command } from "commander";
import { add, del, get, init, share } from "./src/contact";
import { input, select } from "@inquirer/prompts";
import ECDH from "./src/ECDH";
import chalk from "chalk-template";
import { existsSync } from "fs";
import { configDir } from "./src/utils";
import { decrypt, encrypt } from "./src/file";

const program = new Command();

program
  .name("safe")
  .description(
    "Text or file encryption and decryption using ephemeral Diffie-Hellman keys.",
  );

program
  .command("init")
  .description(
    "initialize safe by creating the config directory and generating keys",
  )
  .action(async () => {
    const name = await input({ message: "Enter your name:" });
    const email = await input({ message: "Enter your email:" });

    init(name, email);

    console.log(chalk`{green Initialized sucessfully!}`);
  });

const contact = new Command("contact");

contact
  .command("share")
  .description("share your contact for others to add")
  .action(() => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    console.log(chalk`{yellow Your contact:}`);
    console.log(chalk`{magenta ${share()}}`);
  });

contact
  .command("add")
  .description("add a contact")
  .argument("contact", "encoded contact string to add")
  .action((contact) => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    const name = add(contact);
    console.log(chalk`{green Sucessfully added "{yellow ${name}}"!}`);
  });

contact
  .command("list")
  .description("list all added contacts")
  .action(() => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    const contacts = get();
    if (contacts.length === 0) {
      console.log(chalk`{red No contacts.}`);
      return;
    }
    contacts.map(({ name, email }) => {
      console.log(chalk`{yellow • ${name}} {magenta <${email}>}`);
    });
  });

contact
  .command("delete")
  .description("delete a contact")
  .action(async () => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    const contacts = get();
    if (contacts.length === 0) {
      console.log(chalk`{red No contacts found.}`);
      return;
    }

    const name = await select({
      message: "Pick a contact to delete:",
      choices: contacts.map(({ name, email }) => ({
        name: chalk`{yellow ${name}} {magenta <${email}>}`,
        value: name,
      })),
    });
    del(name);
    console.log(chalk`{green Contact "{yellow ${name}}" deleted sucessfully!}`);
  });

program.addCommand(contact);

program
  .command("encrypt")
  .argument("file", "path to file to encrypt")
  .action(async (file) => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    if (!existsSync(file)) {
      console.error("File not found.");
      process.exit(1);
    }

    const name = await select({
      message: "Pick a contact to send to:",
      choices: get().map(({ name, email }) => ({
        name: chalk`{yellow ${name}} {magenta <${email}>}`,
        value: name,
      })),
    });

    const key = get().find((x) => x.name === name)!.publicKey;
    encrypt(file, key);
    console.log(chalk`{green File encrypted sucessfully!}`);
  });

program
  .command("decrypt")
  .argument("file", "path to file to decrypt")
  .action(async (file) => {
    if (!existsSync(configDir())) {
      console.error("Safe is not initialized. Run `safe init` to start.");
      process.exit(1);
    }

    if (!existsSync(file)) {
      console.error("File not found.");
      process.exit(1);
    }

    const name = await select({
      message: "Pick the contact to receive to:",
      choices: get().map(({ name, email }) => ({
        name: chalk`{yellow ${name}} {magenta <${email}>}`,
        value: name,
      })),
    });

    const key = get().find((x) => x.name === name)!.publicKey;
    decrypt(file);
    console.log(chalk`{green File decrypted sucessfully!}`);
  });

program.parseAsync();
