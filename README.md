# Safe CLI

Safe is a command line tool written in TypeScript that lets you encrypt and decrypt files using the AES encryption algorithm. It involves sharing your identity Diffie-Hellman public key with your contacts, and then generating an ephemeral keypair each time and encrypting the file with the recipient's public key. The recipient can then decrypt the file using their private key. This ensures security and absolute forward secrecy, because the ephemeral keypair is never stored and is generated each time a file is encrypted.

## Requirements

- **Bun:** Install it from [here](https://bun.sh)

## Installation

- Clone the repository
- Run `bun install` in the root directory
- From here, you have two options:
  - Run `bun run build` to build the project and then run `bun link` to link the project to your path
  - Run `bun run build-exec` to build a binary and then add it to your path

## Usage

### Initializing Safe

```bash
safe init
```

This creates a config directory in your home directory and generates a Diffie-Hellman keypair. It also creates `contacts.json` to store your contacts.

### Share your contact

```bash
safe contact share
```

This will generate a base64 encoded public key that you can share with your contact.

### Add a contact

```bash
safe contact add <contact-string>
```

This will add the contact to your contacts list, with the name that was specified by the contact.

### Encrypt a file

```bash
safe encrypt <file>
```

After choosing a contact, this will generate an ephemeral keypair and encrypt the file with the recipient's public key.

### Decrypt a file

```bash
safe decrypt <file>
```

After choosing a contact, this will decrypt the file with the recipient's private key.
