// Ethereum
const ethEndpoint = `https://mainnet.infura.io/v3/${infuraEthereumApiKey}`;
const ethWeb3Provider = new Web3.providers.HttpProvider(ethEndpoint);
const ethWeb3 = new Web3(ethWeb3Provider);

// Stellar
const xlmServer = new StellarSdk.Server('https://horizon.stellar.org');

async function loadTableData() {
    var data = [];

    for (i = 0; i < wallets.length; ++i) {
        var wallet = wallets[i];
        switch (wallet.coin) {
            case "ETH":
                await ethWeb3.eth.getBalance(wallet.address)
                    .then(wei => convertWeiToEther(wei))
                    .then(ether => makeRow(wallet, ether))
                    .then(row => data.push(row))
                    .catch(error => console.log(error));
                break;
            case "XLM":
                await xlmServer.loadAccount(wallet.address)
                    .then(account => makeRow(wallet, account.balances[0].balance))
                    .then(row => data.push(row))
                    .catch(error => console.log(error));
                break;
        }
    }

    $('#walletTable').bootstrapTable({ data: data })
}

function makeRow(wallet, balance) {
    var row = {
        coin: wallet.coin,
        address: wallet.address,
        balance: balance
    };
    return row;
}

function convertWeiToEther(ether) {
    return parseFloat(ether) / 1e18;
}