var assert = require('assert')

var Addresses = require('./addresses')
var Blocks = require('./blocks')
var Transactions = require('./transactions')

var NETWORKS = {
  testnet: "tbtc",
  bitcoin: "btc",
  litecoin: "ltc"
}

function Blockr(network) {
  network = network || 'bitcoin'
  assert(network in NETWORKS, 'Unknown network: ' + network)
  var BASE_URL = 'https://' + NETWORKS[network] + '.blockr.io/api/v1/'

  // end points
  this.transactions = new Transactions(BASE_URL + 'tx/')
  this.addresses = new Addresses(BASE_URL + 'address/', this.transactions)
  this.blocks = new Blocks(BASE_URL + 'block/', this.transactions)

  this.network = network
}

Blockr.Addresses = Addresses
Blockr.Blocks = Blocks
Blockr.Transactions = Transactions

Blockr.prototype.getNetwork = function() { return this.network }

module.exports = Blockr
