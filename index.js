// import radspec from 'radspec'
// import fs from 'fs'
const fs = require('fs')
const path = require('path')
const radspec = require('radspec')
const ABI_FOLDER = './abi/'
const debug = true
// const debug = false
function Parser(params) {
    this.web3 = params.web3
    this.installedApps = params.installedApps
    if (params.votingAddress) {
        this.votingAddress = params.votingAddress
    } else {
        const votingApp = this.installedApps.find((obj) => { return obj.name == 'voting' })
        this.votingAddress = votingApp.app
    }
    const votingAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${ABI_FOLDER}voting.json`)))
    this.voting = new this.web3.eth.Contract(votingAbi.abi, this.votingAddress)
    trace('Init success. VotingAddress: ' + this.votingAddress)
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
        const appAddress = '0x' + vote.script.substring(10, 50)

        const findApp = this.installedApps.find((obj) => { return obj.app == appAddress })

        if (findApp == undefined) return reject({ error: 'Unknown app', success: false })
        trace(findApp)
        const appNameL = "name" in findApp ? findApp.name.replace('-', '') : ''
        try {
            this.abi = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${ABI_FOLDER}${appNameL}.json`)))
            this.methodByte = '0x' + vote.script.replace('0x', '').substring(56, 64)
            trace('methodByte:')
            trace(this.methodByte)
            this.getMethodName()
            trace('methodName:')
            trace(this.methodName)
            expression = this.abi.userdoc.methods[this.methodName].notice
            this.methodCall = '0x' + vote.script.replace('0x', '').substring(56)
            trace('methodCall:')
            trace(this.methodCall)
            trace(expression)
            call = {
                abi: this.abi.abi,
                transaction: {
                    data: this.methodCall
                }
            }
        } catch {
            return reject({ error: 'Unknown method', success: false })
        }
        let parsedMessage, method
        try {
            method = 'radspec'
            parsedMessage = await radspec.evaluate(expression, call)
        } catch (error) {
            method = 'weezi'
            parsedMessage = this.replaceParamsValues(expression)
        }
        method = 'weezi'
        parsedMessage = this.replaceParamsValues(expression)
        const message = this.replaceAddressWithName(parsedMessage)
        const { template, replacements } = this.replaceForTemplate(parsedMessage)
        const appName = this.replaceAddressWithName(appAddress)
        return resolve({ message, success: true, template, replacements, method, appName, voteId })

    })
}
Parser.prototype.replaceAddressWithName = function replaceAddressWithName(txt) {
    for (const app of this.installedApps) {
        try {
            const patern = new RegExp(app.app, 'gi')
            txt = "name" in app && "app" in app ? txt.replace(patern, app.name.capitalize()) : txt
        } catch (error) {
            trace(error)
        }
    }
    return txt
}
Parser.prototype.replaceForTemplate = function replaceForTemplate(txt) {
    let count = 0
    let replacements = []
    for (const app of this.installedApps) {
        try {
            const patern = new RegExp(app.app, 'gi')
            if ("name" in app && "app" in app && txt.match(patern) > 0) {
                txt = txt.replace(patern, `{{${count}}}`)
                count++
                replacements.push({ title: app.name.capitalize(), value: app.app })
            }

        } catch (error) {
            trace(error)
        }
    }
    return { template: txt, replacements }
}
Parser.prototype.replaceParamsValues = function replaceParamsValues(txt) {
    try {
        const paramsTypes = this.methodName.split('(')[1].split(')')[0].split(',')
        const paramsNames = Object.keys(this.abi.devdoc.methods[this.methodName].params)
        const paramsObj = paramsTypes.map((p, i) => ({ type: p, name: paramsNames[i] }))
        const paramsValues = this.web3.eth.abi.decodeParameters(paramsObj, this.methodCall.substring(10))
        if (paramsNames && paramsNames.length) {
            for (const param of paramsNames) {
                txt = txt.replace(param, paramsValues[param])
            }
        }
    } catch (error) {
        trace(error)
    }
    return txt
}
Parser.prototype.getMethodName = function getMethodName() {
    const abiMethods = Object.keys(this.abi.userdoc.methods)
    for (const method of abiMethods) {
        const decodedName = this.web3.eth.abi.encodeFunctionSignature(method)
        if (decodedName == this.methodByte) this.methodName = method
    }
}
Object.defineProperty(String.prototype, 'capitalize', {
    value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});
function trace(msg) { if (debug) console.log(msg) }

module.exports = Parser