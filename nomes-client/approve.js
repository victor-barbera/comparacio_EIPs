let toAddress = "0xDa5E6B7f172847d63676aA6aC51e108a06c2044D";
// test contracts
let sender = "0xDeCD84708c75258F8D491A324077fFd846C1884c";
// test 2
let spender = "0x1f58f419c0108bcaA78457E6a190AcF984E6bC3b";
// calculate ERC20 token amount ( 18 decimals )
let amount = 2;
console.log("amount: " + amount);
let tokenAmount = web3.utils.toWei(amount.toString(), 'ether')
console.log("token amount: " + tokenAmount);

// How many tokens do I have before sending?
let balance = await contract.methods.balanceOf(sender).call();
console.log(`Balance before send: ${balance}`);
// The gas price is determined by the last few blocks median gas price.
const avgGasPrice = await web3.eth.getGasPrice();
// current transaction gas prices from https://ethgasstation.info/
//const currentGasPrices = await getCurrentGasPrices();

/**
 * With every new transaction you send using a specific wallet address,
 * you need to increase a nonce which is tied to the sender wallet.
 */

let nonce = await web3.eth.getTransactionCount(sender);
console.log("nonce",nonce);

// Will call estimate the gas a method execution will take when executed in the EVM without.
let estimateGas = await web3.eth.estimateGas({
    "value": web3.utils.toHex(amount), 
    "data": contract.methods.approve(sender, spender, tokenAmount).encodeABI(),
    "from": sender,
    "to": toAddress
});
console.log({
    estimateGas: estimateGas
});
// Build a new transaction object.
/*
const transaction = {
    "value": '0x0', // Only tokens
    "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
    "from": fromAddress,
    "to": toAddress,
    "gas": web3.utils.toHex(estimateGas * 1.10),
    "gasLimit": web3.utils.toHex(estimateGas * 1.10),
    "gasPrice": web3.utils.toHex(Math.trunc(currentGasPrices.medium * 1e9)),
    "chainId": web3.utils.toHex(chainList.mainnet)
};*/

const transaction = {
    //"value": web3.utils.toHex(amount),                           
    "nonce": web3.utils.toHex(nonce),      
    //"contractAddress":"0xd9145CCE52D386f254917e481eB44e9943F39138",
    "data": contract.methods.approve(sender, spender, tokenAmount).encodeABI(),
    "from": sender,
    "to": toAddress,
    "gas": web3.utils.toHex(54000)
};
// Creates an account object from a private key.

// Addressa amb la que sa connectat el remix al ( metamask )

let privateKey = "9fd7eacee2513982efcab817ef22fc3555cb52ace60ac78bae68e04a8972cd00";
const senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
/**
* This is where the transaction is authorized on your behalf.
* The private key is what unlocks your wallet.
*/
const signedTransaction = await senderAccount.signTransaction(transaction);
console.log({
    transaction: transaction,
    amount: amount,
    tokenAmount: tokenAmount,
    avgGasPrice: avgGasPrice,
    signedTransaction: signedTransaction
});