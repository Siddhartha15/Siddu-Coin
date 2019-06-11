const EC = require("elliptic").ec;// used generate public and private key, methods to sign and verify a signature
const ec = new EC("secp256k1"); // this algo is also basis of bitcoin wallets

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log("\n Private key",privateKey);
console.log("\n public key",publicKey);