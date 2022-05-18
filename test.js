const WeeziVotingParser = require('./index')
const Web3 = require('web3')

// const rpc = 'https://mainnet.infura.io/v3/c228c742aafd4d15ba6842f3f7d3ae8c'
const rpc = 'https://speedy-nodes-nyc.moralis.io/50bb4b751a7adee831fb8eeb/bsc/testnet'
const web3 = new Web3(rpc)


const installedApps = [
    { app: 'b104f3133e9a04d9048feb2e26ed1e72036c078c', name: 'acl' },
    { app: 'b1198586d39f533477104e2bf9186a87785d1bd5', name: 'evmreg' },
    { app: '8507f9cd4bbe41664865c5cb3e6503e234f67f98', name: 'vault' },
    { app: 'd422c73fa1df211f232e162746293bff411beaaf', name: 'agent' },
    {
        app: '0f109bf1d4cca3dc64cf0ccb89898445529699f3',
        name: 'dot-voting'
    },
    { app: '2abe7c3bb9d84560e75bb698697a35fd390093a9', name: 'voting' },
    {
        app: 'c1a8df07504adb6437b923168cb49236b0cbf2b8',
        name: 'token-manager',
        token: '0xDaa3867b1b7cc90a6b0586a55098725628A98E60',
        is_gp: true
    },
    {
        app: 'c0eede8a66398f3f850604e220471b961ac37314',
        name: 'token-manager',
        token: '0x302B5F75C4016C358A9d09283A13f69400E8D4A6'
    },
    {
        app: '91a87142a85a4f3afbee01dd9e02135f3eab382d',
        name: 'allocations'
    },
    { app: '08ea318a839df7b5901afdfba7f7b2e31edd8b63', name: 'finance' },
    { app: '29abc1fe6b5d8933c4b351e9d63c0f43ea4ed3c2', name: 'rewards' },
    {
        app: 'f27e3077afd927e7188006dcb43dcfeaa91cc3fe',
        name: 'redemptions'
    },
    {
        app: '448ed925a5ed0fcb289429e45617f9e4f3298a2f',
        name: 'token-request'
    },
    { app: '83d4b7581fef427e6bfb61c311a3f31139f25057', name: 'delay' },
    { name: 'kernel', app: 'fa35141ed7032840f70badb1cc0715a9ced4d966' }
]

const weeziVotingParser = new WeeziVotingParser({ web3, installedApps })


async function test() {
    let promises = []
    for (let i = 0; i < 1; i++) {
        promises.push(weeziVotingParser.parse({ voteId: i }))
    }
    Promise.all(promises).then((res) => {
        console.log(res)
    })
    // weeziVotingParser.parse({ voteId: 20 }).then((res, err) => {
    //     if (err) return console.log(err)
    //     console.log(res)
    // }).catch(function (err) {
    //     console.log(err);
    // });
}
test()