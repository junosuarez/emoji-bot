var irc = require('irc')
var markov = require('markov')
var path = require('path')
var Q = require('q')
var fs = require('fs')
var _ = require('lodash')

function EmojiBot (server, nick, opts) {
  var that = this
  opts = opts || {}
  this.client = new irc.Client(server, nick, opts)
  this.nick = nick
  this.debug = false
  this.emoji = {}
  this.server = server
  this.markov = markov(9)

  this.log('*stretching and yawning* Waking up!')
  this.client.addListener('join', function (channel, nick) {
    if (nick === this.nick) {
      that.log('I\'ve connected to: ' + channel)
    }
  })
}


EmojiBot.prototype.log = function () {
  var log = console.log.bind(this, this.nick + ': ')
  if (this.debug) {
    return log.apply(this, arguments)
  }
}

EmojiBot.prototype.read = function (from, to, message) {
  var that = this
  that.log('Reading...')
  // Look for emoji
  var emoji = message.match(/:.+[^\s]:/g)
  if (emoji) {
    that.log('Emoji detected. Processing...')
    return that.generateEmoji(from, to, emoji)
  }
}

EmojiBot.prototype.generateEmoji = function (from, to, emoji) {
  var that = this
  // parse the emoji to plain text
  var emoji = _(emoji)
    .map(function (word) {
      return word.replace(/:/g, '').trim()
    })
  // do something with them
  emoji.each(function (em) {
    var url = that.emoji[em];
    that.log('Emoji matched: ' + em + ' => ' + that.emoji[em])
    if (url) {
      that.log('Message to: ' + to)
      that.client.say(to, url)
    } else {
      that.log('No emoji url found in records for: ' + em)
    }
  })
}

EmojiBot.prototype.feed = function (filePath) {
  var that = this
  var deferred = Q.defer()
  that.log('Let me devour ' + filePath)
  var food = fs.createReadStream(filePath)
  this.markov.seed(food, function () {
    that.log('*burp* Done eating.')
    deferred.resolve()
  })
  return deferred.promise
}

EmojiBot.prototype.respond = function (from, message) {
  this.log('I heard ' + from + ' say, '
      + '"' + message + '" ' + 'privately to me.')
  var response = this.markov.respond(message)
  this.log('I replied to ' + from + ' with, ' + '"' + response + '"')
  this.client.say(from, response)
}

exports = module.exports = EmojiBot
