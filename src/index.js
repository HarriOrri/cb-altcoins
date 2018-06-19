var assert = require('assert')

var Addresses = require('./addresses')
var Blocks = require('./blocks')
var Transactions = require('./transactions')
var utils = require('./utils')

var NETWORKS = {
//testnet: {symbol:"tbtc" , api:"blockr"},
//bitcoin:{  symbol: "btc",api:"blockr"},
//litecoin: { symbol: "ltc",api:"blockr"},
auroracoin:{  symbol:'auroracoin',api:"aurinsight"}
smileycoin:{  symbol:'smileycoin',api:"smileyinsight"}
}

function CBAltcoins(network, proxyURL) {
  network = network || 'smileycoin'
  assert(network in NETWORKS, 'Unknown network: ' + network)
  var BASE_URL = ''
  if(NETWORKS[network].api==="blockr")
  {
  BASE_URL='https://' + NETWORKS[network].symbol + '.blockr.io/api/v1/'
}else if(NETWORKS[network].api==="smileyinsight")
{
  //BASE_URL='http://insight.' + NETWORKS[network].symbol + '.io/api/'
  BASE_URL='https://blocks.harri.is/api/'
}
  // end points
  this.transactions = new Transactions(BASE_URL)
  this.addresses = new Addresses(BASE_URL , this.transactions)
  this.blocks = new Blocks(BASE_URL , this.transactions)

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
