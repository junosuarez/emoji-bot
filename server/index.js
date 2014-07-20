var EmojiBot = require('./lib/EmojiBot')
var yaml = require('js-yaml')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')
var config = yaml.safeLoad(fs.readFileSync('config.yaml'))


var emojiBot = new EmojiBot('irc.freenode.net', 'emoji-bot', {
  channels: config.channels || []
})

emojiBot.debug = config.debug || false
emojiBot.emoji = yaml.safeLoad(fs.readFileSync('../emoji.yaml'))

emojiBot.client.addListener('message', function (from, to, message) {
  emojiBot.read(from, to, message)
})

emojiBot.client.addListener('error', function (err) {
  console.log('Error: ' + err)
})
