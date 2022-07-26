const WeeziVotingParser = require('./index')
const Web3 = require('web3')

// const rpc = 'https://mainnet.infura.io/v3/c228c742aafd4d15ba6842f3f7d3ae8c'
// const rpc = 'https://speedy-nodes-nyc.moralis.io/50bb4b751a7adee831fb8eeb/bsc/testnet'
const rpc = 'https://rinkeby.infura.io/v3/05acd7530eed4d43aae110a7b047549a'
const web3 = new Web3(rpc)


const installedApps = [
    { app: '0xf7637cbfa9d0636f984f407e29fd6513f09b8a6f', name: 'acl' },
    { app: '0x8a332640d47ffbfa29aa39cfae8b2582a3e14998', name: 'evmreg' },
    { app: '0x55e2564e09f34470817500123aff02f2d5993516', name: 'vault' },
    { app: '0x3db41c21e51670ab6303b7961bd035fbd595cf75', name: 'agent' },
    {
        app: '0xd23ae2d7938b7ed110aa65bf535bb89b9f001d64',
        name: 'dot-voting'
    },
    { app: '0xc061071e8b6f40b23161a2be5c0276b5ec9f09fe', name: 'voting' },
    {
        app: '0x01de2bd87c35e4124dd8808fd6d8160d3219c6c9',
        name: 'token-manager.hatch',
        token: '0xB8c089c657dCa546893334Dc889287D663C0575D',
        is_gp: true
    },
    {
        app: '0x9820de34c2ef4c86ea1ec0033be1099934fe81f0',
        name: 'token-manager.hatch',
        token: '0x72Fe9756B739A8780306778BcB0381BA751622e9'
    },
    {
        app: '0x5a81cb505dbbc5174f4330089adef45f995eac43',
        name: 'allocations'
    },
    {
        app: '0x2cfe4d553fe469d9e7211be4c1398a7f7d7af668',
        name: 'finance'
    },
    {
        app: '0xa72946dd23c635bfaf9341460e939701c94af402',
        name: 'rewards'
    },
    {
        app: '0xa54fce2032cc27412692dcdce07461c8352f4a8d',
        name: 'redemptions'
    },
    {
        app: '0x458783e0286262c9014c56bfcfa800b6f6cbe936',
        name: 'token-request'
    },
    { app: '0x4e3be1d3d318944231f90214e0838ae6f54b8366', name: 'delay' },
    { app: '0x965349576db420b032b7588e0a174355d95225ae' },
    { name: 'kernel', app: '0xe8151fc7f3a9e71f2bc1d1e10e38969a331c08de' },
    { app: '0xffffffffffffffffffffffffffffffffffffffff', name: 'ALL' }
]

const weeziVotingParser = new WeeziVotingParser({ web3, installedApps })


async function test() {
    let promises = []
    for (let i = 2; i < 3; i++) {
        // promises.push(weeziVotingParser.parse({ voteId: i }))
    }
    promises.push(weeziVotingParser.parse({ voteId: 7 }))
    Promise.all(promises).then((res) => {
        console.log(res[0])
    })
    // weeziVotingParser.parse({ voteId: 20 }).then((res, err) => {
    //     if (err) return console.log(err)
    //     console.log(res)
    // }).catch(function (err) {
    //     console.log(err);
    // });
}
test()