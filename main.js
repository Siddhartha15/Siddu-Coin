const {Blockchain,Transaction} = require('./blockchain');
const EC = require("elliptic").ec;// used generate public and private key, methods to sign and verify a signature
const ec = new EC("secp256k1"); // this algo is also basis of bitcoin wallets


const myKey = ec.keyFromPrivate('cfd6e9be9eddb4d1f9741f0591dfa9a8fafc5bd3447118277673ae7b1af80fb2');
const myWalletAddress = myKey.getPublic('hex');


let sidduCoin = new Blockchain();

const tx1 = new  Transaction(myWalletAddress,'public key goes here',100);
tx1.signTransaction(myKey);

sidduCoin.addTransaction(tx1);


console.log("\n Starting the miner....");
sidduCoin.minePendingTransactions(myWalletAddress);

console.log("balance is",sidduCoin.getBalanceOfAddress(myWalletAddress));


console.log("\n Starting the miner....");
sidduCoin.minePendingTransactions(myWalletAddress);

console.log("balance is",sidduCoin.getBalanceOfAddress(myWalletAddress));

console.log("Is chain valid?",sidduCoin.isChainValid());
sidduCoin.chain[1].transactions[0].amount = 1; // tampering the chain
console.log("Tamperred the chain");
console.log("Is chain valid?",sidduCoin.isChainValid());
// console.log(JSON.stringify(sidduCoin.chain,null,4));