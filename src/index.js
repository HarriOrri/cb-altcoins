var assert = require('assert')

var Addresses = require('./addresses')
var Blocks = require('./blocks')
var Transactions = require('./transactions')
var utils = require('./utils')

var NETWORKS = {
testnet: {symbol:"tbtc" , api:"blockr",tx:"tx",block:"block",address:"address"},
bitcoin:{  symbol: "btc",api:"blockr",tx:"tx",block:"block",address:"address"},
litecoin: { symbol: "ltc",api:"blockr",tx:"tx",block:"block",address:"address"},
auroracoin:{  symbol:'aur',api:"aurinsight",tx:"tx",block:"block",address:"addr"}
}

function CBAltcoins(network, proxyURL) {
  network = network || 'bitcoin'
  assert(network in NETWORKS, 'Unknown network: ' + network)
  var BASE_URL = ''
  if(NETWORKS[network].api==="blockr")
  {
  BASE_URL='https://' + NETWORKS[network] + '.blockr.io/api/v1/'
}else if(NETWORKS[network].api==="aurinsight")
{
  BASE_URL='http://insight.' + NETWORKS[network] + '.io'
}
  // end points
  this.transactions = new Transactions(BASE_URL + NETWORKS[network].tx)
  this.addresses = new Addresses(BASE_URL + NETWORKS[network].addr , this.transactions)
  this.blocks = new Blocks(BASE_URL + NETWORKS[network].block, this.transactions)

  this.network = network

  utils.setProxyURL(proxyURL)
  this.proxyURL = proxyURL
}

CBAltcoins.Addresses = Addresses
CBAltcoins.Blocks = Blocks
CBAltcoins.Transactions = Transactions

CBAltcoins.prototype.getNetwork = function() { return this.network }
CBAltcoins.prototype.getProxyURL = function() { return this.proxyURL }

module.exports = CBAltcoins
