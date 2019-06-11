const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;// used generate public and private key, methods to sign and verify a signature
const ec = new EC("secp256k1"); // this algo is also basis of bitcoin wallets


class Transaction{
    constructor(fromAddress, toAddress, amount)
    {
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress+this.toAddress+this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress)
        {
            throw new Error('You cannot sign transactions for other wallets!!!');
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx,'base64'); //signing the hash of our Transaction
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) 
            return true;
        
        if(!this.signature || this.signature.length === 0)
        {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex'); // remember fromAddress is a public key
        return publicKey.verify(this.calculateHash(),this.signature);
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

    hasValidTransactions(){
        for(const tx of this.transactions){
                if(!tx.isValid()){
                    return false;
                }
        }

        return true;
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

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress)
        {
            throw new Error("Transaction must include from and to address");
        }
        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }
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

            if(!currentBlock.hasValidTransactions()){
                return false;
            }

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

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;