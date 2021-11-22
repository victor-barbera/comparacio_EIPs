// check if metamask is installed.
if (typeof window.ethereum !== 'undefined') console.log('MetaMask is installed :)');
else console.warn('MetaMask is not installed :(');


document.getElementById("metamask-connect").addEventListener('click', ()=> {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    console.table(accounts);
});