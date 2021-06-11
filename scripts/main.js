// Chia
const xchEndpoint = 'https://api2.chiaexplorer.com/balance';

// Dubaicoin
const dbixEndpoint = 'https://scan.dbix.info/api/v1/address';

// Ethereum
const ethEndpoint = `https://mainnet.infura.io/v3/${infuraEthereumApiKey}`;
const ethWeb3Provider = new Web3.providers.HttpProvider(ethEndpoint);
const ethWeb3 = new Web3(ethWeb3Provider);

// Helium
const hntEndpoint = 'https://api.helium.io/v1/accounts'

// Nano
const nanoEndpoint = 'https://api.nanocrawler.cc/v2/accounts'

// Ravencoin
const rvnEndpoint = 'https://explorer-api.ravenland.org/address';

// Stellar
const xlmServer = new StellarSdk.Server('https://horizon.stellar.org');

function loadTableData() {
    wallets.forEach(processWallet);
}

function processWallet(wallet, index) {
    let table = $('#walletTable').DataTable();
    switch (wallet.coin) {
        case "DBIX":
            fetch(`${dbixEndpoint}/${wallet.address}`)
                .then(response => response.json())
                .then(json => json.info.find(item => item.hash.toLowerCase() === wallet.address.toLowerCase()))
                .then(account => table.row.add([wallet.coin, wallet.address, account.balance, wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "ETH":
            ethWeb3.eth.getBalance(wallet.address)
                .then(wei => convertDenominationToValue(1e18, wei))
                .then(balance => table.row.add([wallet.coin, wallet.address, balance.toFixed(18), wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "RVN":
            fetch(`${rvnEndpoint}/${wallet.address}/balances`)
                .then(response => response.json())
                .then(json => json.data.RVN)
                .then(balance => table.row.add([wallet.coin, wallet.address, balance, wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "XCH":
            fetch(`${xchEndpoint}/${wallet.address}`)
                .then(response => response.json())
                .then(json => convertDenominationToValue(1e12, json.netBalance))
                .then(balance => table.row.add([wallet.coin, wallet.address, balance.toFixed(12), wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "XLM":
            xlmServer.loadAccount(wallet.address)
                .then(account => account.balances[0].balance)
                .then(balance => table.row.add([wallet.coin, wallet.address, balance, wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "HNT":
            fetch(`${hntEndpoint}/${wallet.address}`)
                .then(response => response.json())
                .then(json => convertDenominationToValue(1e8, json.data.balance))
                .then(balance => table.row.add([wallet.coin, wallet.address, balance.toFixed(8), wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        case "NANO":
            fetch(`${nanoEndpoint}/${wallet.address}`)
                .then(response => response.json())
                .then(json => convertDenominationToValue(1e30, json.account.balance))
                .then(balance => table.row.add([wallet.coin, wallet.address, balance.toFixed(30), wallet.note]))
                .then(render => render.draw(false))
                .catch(error => console.log(error));
            break;
        default:
            table.row.add([wallet.coin, wallet.address, "-", wallet.note]).draw(false);
            break;
    }
}

function convertDenominationToValue(denomination, value) {
    return Number.parseFloat(value) / denomination;
}