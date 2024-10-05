export type Contact = {
  name: string;
  email: string;
  publicKey: string;
};

export type ContactData = {
  contacts: Contact[];
};

export interface SelfData extends Contact {
  privateKey: string;
}
