var async = require('async')
var utils = require('./utils')
var bitcoinjs = require('bitcoinjs-lib')

function Addresses(url, txEndpoint) {
  this.url = url
  this.txEndpoint = txEndpoint
}

Addresses.prototype.summary = function(addresses, callback) {
  var uri = this.url +"addr/"

  validateAddresses(addresses, function(err) {
    if(err) return callback(err)

    utils.batchRequest(uri, addresses, {params: ["noTxList=0"]}, function(err, data) {
      if(err) return callback(err);

      var results = data.map(function(address) {
        return {
          address: address.addrStr,
          balance: address.balance,
          totalReceived: address.totalReceived,
          txCount: address.txApperances
        }
      })

      callback(null, Array.isArray(addresses) ? results : results[0])
    })
  })
}

Addresses.prototype.transactions = function(addresses, blockHeight, done) {
  // optional blockHeight
  if ('function' === typeof blockHeight) {
    done = blockHeight
    blockHeight = 0
  }

  if (blockHeight > 0) {
    console.warn('Blockr API does not support blockHeight filter for addresses.transactions')
  }

  var url = this.url +"addrs/txs/"
  var txIds = {}

  var self = this
  validateAddresses(addresses, function(err) {
    if(err) return done(err)

     
        utils.batchRequest(url, addresses, {params: ["from=0","to=20"]}, function(err, data) {
          if (err) return done(err)

          data.forEach(function(batch) {
            batch.items.forEach(function(tx) {
              txIds[tx.txid] = true
            })
          })

          self.txEndpoint.get(Object.keys(txIds), done)
        })
          })
}

Addresses.prototype.unspents = function(addresses, callback) {
  var uri = this.url + "addrs/utxo/"

  validateAddresses(addresses, function(err) {
    if(err) return callback(err)

    utils.batchRequest(uri, addresses, {params: []}, function(err, data) {
      if (err) return callback(err)

      var results = data.map(function(unspent) {
        return {
          address: unspent.address,
          confirmations: unspent.confirmations,
          vout: unspent.vout,
          txId: unspent.txid,
          value: unspent.amount
        }
      })

      callback(null, results)
    })
  })
}

function validateAddresses(addresses, callback) {
  addresses = [].concat(addresses)
  var invalidAddresses = addresses.filter(function(address) {
    try {
      bitcoinjs.Address.fromBase58Check(address)
    } catch(e) {
      return true
    }
  })

  if(invalidAddresses.length > 0) {
    return callback(new Error("There are " + invalidAddresses.length + " invalid addresses: " + invalidAddresses.join(', ')))
  }

  callback(null)
}

module.exports = Addresses
