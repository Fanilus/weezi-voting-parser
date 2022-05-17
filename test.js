const WeeziVotingParser = require('./index')
const Web3 = require('web3')

const rpc = 'https://mainnet.infura.io/v3/c228c742aafd4d15ba6842f3f7d3ae8c'
const web3 = new Web3(rpc)

const installedApps = [
    { app: '1c26fde2ce92cd1d932a0afb8367108eac7f369b', name: 'kernel' },
    { app: 'd13a55705078d00fa53b99ec36e396c672b87b7e', name: 'acl' },
    { app: 'a91ca42446d02e9d562619749fc13e9fc10b2e70', name: 'evmreg' },
    { app: '24467575cca1497e352fcd99f875f03138650567', name: 'vault' },
    { app: '84b254d345f95fec2bdd0305c2faa34fdfa0f334', name: 'finance' },
    {
        app: 'e15528f5a49f099aaa24fe82ca99836d4a418f1a',
        name: 'token-manager',
        token: '0x4D98039AB1BfD7b7A7d6f0629BeBB7AeFd36286e',
        is_gp: true
    },
    { app: '27a4a7cd632fa69f092b05aeceffe8dd909228df', name: 'voting' },
    {
        app: 'e4b9dbc2c8333f7fcdbbb0035a58136968bc1d88',
        name: 'address-book'
    },
    {
        app: '5c76aca89d2540096de5e2b4537bce813925c964',
        name: 'allocations'
    },
    {
        app: '751bd96d664f9b3456cb7c0296b4e78d7e13fec1',
        name: 'dot-voting'
    },
    { app: '82ff0bc24ab4493dcf62f8353fcb340fd1a8988f', name: 'projects' },
    { app: '7c82a40565c6e4213ac14141859cf175b3e1aa6a', name: 'rewards' },
    { app: 'f8a8d25049ebfaf36cf1dd7ff51ebd0777fc9b32', name: 'agent' },
    {
        app: 'aec164f9b9524e950c70ec611592b4147e588a11',
        name: 'token-manager',
        token: '0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB',
        is_gp: true
    },
    {
        app: '11f0e63161289c52c62ca21f241da6ee8afaa68b',
        name: 'redemptions'
    },
    {
        app: 'ac3f8e8518139f732218ff542d21cd6968e8209d',
        name: 'token-request'
    },
    { app: '366793250f34ed87559996f58908b72e1863e6e9', name: 'delay' },
    { app: 'c4efc591d713280a07eb5c7022ef807ba0619b50', name: 'voting' }
]
const votingAddress = '0x27a4a7cd632fa69f092b05aeceffe8dd909228df'

const weeziVotingParser = new WeeziVotingParser({ web3, votingAddress, installedApps })

weeziVotingParser.parse({ voteId: 2 }).then((res, err) => {
    if (err) return console.log(err)
    console.log(res)
}).catch(function (err) {
    console.log(err);
});