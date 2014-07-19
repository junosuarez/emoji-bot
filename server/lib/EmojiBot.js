var irc = require('irc')
var markov = require('markov')
var path = require('path')
var Q = require('q')
var fs = require('fs')
var _ = require('lodash')

function EmojiBot (server, nick, opts) {
  opts = opts || {}
  this.client = new irc.Client(server, nick, opts)
  this.nick = nick
  this.debug = false
  this.server = server
  this.markov = markov()
  console.log(this.nick + ': *stretching and yawning* waking up now.')
}

EmojiBot.prototype.log = function () {
  var log = console.log.bind(this, this.nick + ': ')
  if (this.debug) {
    return log.apply(this, arguments)
  }
}

EmojiBot.prototype.read = function (from, to, message) {
  var that = this
  // Look for emoji
  var words = message.split(' ')
  var emoji = _(words)
    .find(function (word) {
      return word.match(/^:.+:$/)
    })
    .map(function (word) {
      return word.replace(':', '')
    })
    .each(function (emoji) {
      that.generateEmoji(emoji)
    })
}

EmojiBot.prototype.generateEmoji = function (emoji) {
  var that = this
  if (emoji instanceof Array) {
    _.each(emoji, function (em) {
      that.log('Emoji detected: ' + em)
    })
  }
}

EmojiBot.prototype.feed = function (filePath) {
  var that = this
  var deferred = Q.defer()
  that.log('input! input! woo-ie!')
  that.log('this ' + filePath + ' is delicious!')
  var food = fs.createReadStream(filePath)
  this.markov.seed(food, function () {
    that.log('*burp* done eating')
    deferred.resolve()
  })
  return deferred.promise
}

EmojiBot.prototype.respond = function (from, message) {
  this.log('I heard, ' + from + ' say, '
      + '"' + message + '" ' + 'privately to me.')
  var response = this.markov.respond(message)
  this.log('I replied to ' + from + ' with, ' + '"' + response + '"')
  this.client.say(from, response)
}

exports = module.exports = EmojiBot
