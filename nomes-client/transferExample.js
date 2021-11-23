// ABI to transfer ERC20 Token
let abi = JSON.parse(fs.readFileSync(path.join(__dirname, '.', 'main_contract.json'), 'utf-8'));
// calculate ERC20 token amount ( 18 decimals )
let amount = 1;
let tokenAmount = web3.utils.toWei(amount.toString(), 'ether')
// Get ERC20 Token contract instance
let contract = new web3.eth.Contract(abi, tokenAddress, {
    from: fromAddress
});
// How many tokens do I have before sending?
let balance = await contract.methods.balanceOf(fromAddress).call();
console.log(`Balance before send: ${balance}`);
// EIP 155 - List of Chain ID's:
const chainList = {
    mainnet: 1,
    morden: 2,
    ropsten: 3,
    rinkeby: 4,
    ubiqMainnet: 8,
    ubiqTestnet: 9,
    rootstockMainnet: 30,
    rootstockTestnet: 31,
    kovan: 42,
    ethereumClassicMainnet: 61,
    ethereumClassicTestnet: 62,
    ewasmTestnet: 66,
    gethPrivateChains: 1337
};
// The gas price is determined by the last few blocks median gas price.
const avgGasPrice = await web3.eth.getGasPrice();
// current transaction gas prices from https://ethgasstation.info/
const currentGasPrices = await getCurrentGasPrices();
/**
 * With every new transaction you send using a specific wallet address,
 * you need to increase a nonce which is tied to the sender wallet.
 */
let nonce = web3.eth.getTransactionCount(fromAddress);
// Will call estimate the gas a method execution will take when executed in the EVM without.
let estimateGas = await web3.eth.estimateGas({
    "value": '0x0', // Only tokens
    "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
    "from": fromAddress,
    "to": toAddress
});
console.log({
    estimateGas: estimateGas
});
// Build a new transaction object.
const transaction = {
    "value": '0x0', // Only tokens
    "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
    "from": fromAddress,
    "to": toAddress,
    "gas": web3.utils.toHex(estimateGas * 1.10),
    "gasLimit": web3.utils.toHex(estimateGas * 1.10),
    "gasPrice": web3.utils.toHex(Math.trunc(currentGasPrices.medium * 1e9)),
    "chainId": web3.utils.toHex(chainList.mainnet)
};
// Creates an account object from a private key.
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
