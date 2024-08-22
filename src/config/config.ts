import { createConfig, createSignerWithPrivateKey } from '@lawallet/react';

const signer = createSignerWithPrivateKey(
  '5d2c60d751b43f1154095a21f28f531f3806838230fe393b4e12753aebbf264c',
);

export const RELAYS = [
  'wss://relay.damus.io',
  'wss://relay.hodl.ar',
  'wss://relay.lawallet.ar',
  'wss://nostr-pub.wellorder.net',
  'wss://nos.lol',
  'wss://soloco.nl',
  'wss://relay.primal.net',
  'wss://nostr.wine',
];

export const config = createConfig({
  federationId: 'lawallet.ar',
  endpoints: {
    lightningDomain: 'https://lawallet.ar',
    gateway: 'https://api.lawallet.ar',
  },
  relaysList: RELAYS,
  signer,
});
