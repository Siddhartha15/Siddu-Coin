const {Blockchain,Transaction} = require('./blockchain');

let sidduCoin = new Blockchain();


sidduCoin.createTransaction( new Transaction('a1','a2',100));
sidduCoin.createTransaction( new Transaction('a2','a1',50));

console.log("\n Starting the miner....");
sidduCoin.minePendingTransactions('x-a');

console.log("balance of x-a is",sidduCoin.getBalanceOfAddress('x-a'));

console.log("\n Starting the miner again....");
sidduCoin.minePendingTransactions('x-a');

console.log("balance of x-a is",sidduCoin.getBalanceOfAddress('x-a'));

console.log(JSON.stringify(sidduCoin.chain,null,4));