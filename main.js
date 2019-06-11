const SHA256 = require("crypto-js/sha256");

class Transaction{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }
}

class Block{
    constructor(timestamp,transactions,prevHash='')
    {
        this.timestamp=timestamp;
        this.transactions=transactions;
        this.prevHash=prevHash;
        this.hash=this.calculateHash();
        // random vlaue for proof of work to be vlaid
        this.nonce = 0; // this is random value which keeps changing while mining the block, once mined it doesnt change

    }
    
    calculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.prevHash + this.nonce).toString();
    }

    // mining genearally takes 10mins in BitCoin
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block mined "+this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    // creating the first Block
    createGenesisBlock(){
        return new Block("11/06/2019","GenesisBlock Data","0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    // Adding a Block to chain is not so simple in real scenario..
    //Proof of Work needs to be done
    // addBlock(newBlock){
    //     newBlock.prevHash=this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(minRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.prevHash=this.getLatestBlock().hash;
        block.mineBlock(this.difficulty);

        console.log("Block Successfully mined");
        this.chain.push(block);

        this.pendingTransactions=[
            new Transaction(null, minRewardAddress, this.miningReward)
        ];

    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain)
        {
            for(const trans of block.transactions){
                if(trans.fromAddress === address)
                {
                    balance-=trans.amount;
                }
                if(trans.toAddress == address)
                {
                    balance+=trans.amount;
                }
            }
        }

        return balance;
    }

    //to check the integrity of Block Chain
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash != currentBlock.calculateHash())
            {
                return false;
            }
            if(currentBlock.prevHash != prevBlock.hash)
            {
                return false;
            }
        }
        return true;
    }

}

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