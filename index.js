// import radspec from 'radspec'
// import fs from 'fs'
const fs = require('fs')
const radspec = require('radspec')
const ABI_FOLDER = './abi/'
const debug = false
// const debug = false
function Parser(params) {
    this.web3 = params.web3
    this.installedApps = params.installedApps
    if (params.votingAddress) {
        this.votingAddress = params.votingAddress
    } else {
        const votingApp = this.installedApps.find((obj) => { return obj.name == 'voting' })
        this.votingAddress = '0x' + votingApp.app
    }
    const votingAbi = JSON.parse(fs.readFileSync('./abi/voting.json'))
    this.voting = new this.web3.eth.Contract(votingAbi.abi, this.votingAddress)
    trace('Init success')
}

Parser.prototype.parse = function parse(params) {
    return new Promise(async (resolve, reject) => {
        const voteId = params.voteId
        let call, expression, vote
        try {
            vote = params.vote ? params.vote : await this.voting.methods.getVote(voteId).call()
        } catch (error) {
            return reject({ error: 'Can\'t get vote', success: false })
        }
        trace('Vote got')
        const events = await this.voting.getPastEvents("allEvents", {
            fromBlock: 'earliest',
            topics: ['0x4d72fe0577a3a3f7da968d7b892779dde102519c25527b29cf7054f245c791b9', this.web3.eth.abi.encodeParameter('uint256', voteId)]
        });
        trace(vote.script)
        if (events.length) {
            vote.author = '0x' + events[0].raw.topics[2].substring(events[0].raw.topics[2].length - 40)
            const app = vote.script.replace('0x', '').substring(8, 48)
            const findApp = this.installedApps.find((obj) => { return obj.app == app })
            if (findApp == undefined) return reject({ error: 'Unknown app', success: false })
            const appName = findApp.name.replace('-', '')
            trace(appName)

            try {
                const abiFile = JSON.parse(fs.readFileSync(`${ABI_FOLDER}${appName}.json`))
                const methodByte = '0x' + vote.script.replace('0x', '').substring(56, 64)
                const methodName = getMethodName({ web3: this.web3, abi: abiFile, methodByte })
                expression = abiFile.userdoc.methods[methodName].notice
                trace(expression)
                call = {
                    abi: abiFile.abi,
                    transaction: {
                        data: '0x' + vote.script.replace('0x', '').substring(56)
                    }
                }
            } catch {
                return reject({ error: 'Unknown method', success: false })
            }
            try {
                const message = await radspec.evaluate(expression, call)
                trace(message)
                resolve({ message: `${app}: ${message}`, success: true })
            } catch (error) {
                return resolve({ message: `!${app}: ${expression}`, success: true })
            }
        } else {
            return reject({ error: 'events length is 0', success: false })
        }
    })
}
function getMethodName(params) {
    const { web3, abi, methodByte } = params
    const abiMethods = Object.keys(abi.userdoc.methods)
    for (const method of abiMethods) {
        const decodedName = web3.eth.abi.encodeFunctionSignature(method)
        if (decodedName == methodByte) return method
    }
    return null
}
function trace(msg) { if (debug) console.log(msg) }
module.exports = Parser