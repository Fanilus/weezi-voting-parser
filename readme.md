# Weezi Voting Parser


[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Module for parsing votes in Aragon.
## Features
- Can decrypt the byte code of the script being called
- Replaces known addresses with the names of contracts in the dao
- ✨Magic ✨

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i weezi-voting-parser
```


## Example
```js
import WeeziVotingParser from 'weezi-voting-parser'
const weeziVotingParser = new WeeziVotingParser({ web3, votingAddress = '0x01..', installedApps = [{name:'kernel', app:'0x01..'}] })

weeziVotingParser.parse({ voteId: 2 }).then((res, err) => {
    if (err) return console.log(err)
    console.log(res)
}).catch(function (err) {
    console.log(err);
});
```
## License

MIT

**Free Software, Hell Yeah!**
