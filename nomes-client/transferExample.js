
//     const fromAddress='0xDa5E6B7f172847d63676aA6aC51e108a06c2044D';
//     const SMART_CONTRACT_ADDRESS = "0xbf7c4DEF48D4314dF20BC77A98b86400B3d8C73C";
//     //const { FT_ABI } = import('./FT_ABI.json');
//     const FT_ABI= [

//         {
//             "anonymous": false,
//             "inputs": [
//                 {
//                     "indexed": true,
//                     "internalType": "address",
//                     "name": "_from",
//                     "type": "address"
//                 },
//                 {
//                     "indexed": true,
//                     "internalType": "address",
//                     "name": "_to",
//                     "type": "address"
//                 },
//                 {
//                     "indexed": false,
//                     "internalType": "uint256",
//                     "name": "_value",
//                     "type": "uint256"
//                 }
//             ],
//             "name": "Transfer",
//             "type": "event"
//         },
//         { "constant": true,
//             "inputs": [
//                 {
//                     "internalType": "address",
//                     "name": "",
//                     "type": "address"
//                 }
//             ],
//             "name": "balanceOf",
//             "outputs": [
//                 {
//                     "internalType": "uint256",
//                     "name": "",
//                     "type": "uint256"
//                 }
//             ],
//             "stateMutability": "view",
//             "type": "function"
//         },
//         {
//           "constant": true,
//             "inputs": [],
//             "name": "totalSupply",
//             "outputs": [
//                 {
//                     "internalType": "uint256",
//                     "name": "",
//                     "type": "uint256"
//                 }
//             ],
//             "stateMutability": "view",
//             "type": "function"
//         },
//         {
//             "inputs": [
//                 {
//                     "internalType": "address",
//                     "name": "_to",
//                     "type": "address"
//                 },
//                 {
//                     "internalType": "uint256",
//                     "name": "_value",
//                     "type": "uint256"
//                 }
//             ],
//             "name": "transfer",
//             "outputs": [
//                 {
//                     "internalType": "bool",
//                     "name": "success",
//                     "type": "bool"
//                 }
//             ],
//             "stateMutability": "payable",
//             "type": "function"
//         }
//     ]
        
// web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/15a6a4951e1345ebaecccbf617140e64"));

// contract = new web3.eth.Contract(FT_ABI, SMART_CONTRACT_ADDRESS, {
//     from: fromAddress
// });

//contract = web3.eth.contract(FT_ABI).at(SMART_CONTRACT_ADDRESS);
console.log(contract);
let totalSupply = await contract.methods.totalSupply().call();
console.log("TOTAL SUPPLY",totalSupply)

//let tokenAddress = "0xbf7c4DEF48D4314dF20BC77A98b86400B3d8C73C";
let toAddress = "0x1f58f419c0108bcaA78457E6a190AcF984E6bC3b";
// calculate ERC20 token amount ( 18 decimals )
let amount = 2000000000000000;
//let amount = 20;
console.log("amount: " + amount);
//let tokenAmount = web3.utils.toWei(amount.toString(), 'ether')
let tokenAmount = web3.utils.toBN(amount.toString())//toHex(amount);
console.log("token amount: " + tokenAmount);

// How many tokens do I have before sending?
let balance = await contract.methods.balanceOf(fromAddress).call();
console.log(`Balance before send: ${balance}`);

// The gas price is determined by the last few blocks median gas price.
const avgGasPrice = await web3.eth.getGasPrice();
// current transaction gas prices from https://ethgasstation.info/
//const currentGasPrices = await getCurrentGasPrices();

/**
 * With every new transaction you send using a specific wallet address,
 * you need to increase a nonce which is tied to the sender wallet.
 */

let nonce = await web3.eth.getTransactionCount(fromAddress);
console.log("nonce",nonce);

// Will call estimate the gas a method execution will take when executed in the EVM without.
let estimateGas = await web3.eth.estimateGas({
    "value": web3.utils.toHex(amount), 
    "data": contract.methods.transfer(toAddress, amount).encodeABI(),
    "from": fromAddress,
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
    "value": tokenAmount,                           
    "nonce": web3.utils.toHex(nonce),      
    //"contractAddress":"0xd9145CCE52D386f254917e481eB44e9943F39138",
    "data": contract.methods.transfer( toAddress, amount).encodeABI(),
    "from": fromAddress,
    "to": toAddress,
    "gas": web3.utils.toHex(24200)
};
// Creates an account object from a private key.

// Addressa amb la que sa connectat el remix al ( metamask )

let privateKey = "3b7159170c5041d497bcb1788f27ed2e8efe89cf4be17afb980e709c023f3033";
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

// We're ready! Submit the raw transaction details to the provider configured above.
try {
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

    console.log({
        receipt: receipt
    });
    
} catch (error) {
    console.log({
        error: error.message
    });
}
