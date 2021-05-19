const ethereumNode = `https://mainnet.infura.io/v3/${infuraEthereumApiKey}`;
const web3Provider = new Web3.providers.HttpProvider(ethereumNode);
const web3 = new Web3(web3Provider);

async function loadTableData() {
    var data = [];

    for (i = 0; i < wallets.length; ++i) {
        var wallet = wallets[i];
        switch (wallet.coin) {
            case "ETH":
                var balance = await web3.eth.getBalance(wallet.address)
                balance = convertToEth(balance);
                var row = makeRow(wallet, balance);
                data.push(row);
                break;
        }
    }

    $('#walletTable').bootstrapTable({ data: data })
}

function makeRow(wallet, balance) {
    var row = {
        coin: wallet.coin,
        address: wallet.address,
        balance: convertToEth(balance)
    };
    return row;
}

function convertToEth(ether) {
    return parseFloat(ether) / 1e9;
}