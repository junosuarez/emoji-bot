# EmojiBot - custom emoji for your IRC

## The Basics

```javascript
var EmojiBot = require('EmojiBot')

var emojiBot = new EmojiBot('irc.freenode.net', 'emoji-bot', {
  channels: [
    #yourchannel
  ]
})

// Give it a dictionary
// format: {emojiName: url}
emojiBot.emoji = {
  sadhorse: 'https://camo.githubusercontent.com/61dc0e91dc18d5d4c81eef51252af5acbed7f646/687474703a2f2f342e62702e626c6f6773706f742e636f6d2f5f34502d39417764302d4e342f53324268534877644f59492f4141414141414141416e6b2f35497176366d51624473302f733430302f686f727365343630625f31303132313734632e6a7067'
}

// Wanna see what is going on?
emojiBot.debug = true

emojiBot.client.addListener('message', function (from, to, message) {
 emojiBot.read(from, to, message)
})
```

# Note
The instantiation of EmojiBot takes the same parameters as
[node-irc](https://github.com/martynsmith/node-irc/tree/0.3.x) and
emojiBot.client is an instance of
[node-irc](https://github.com/martynsmith/node-irc/tree/0.3.x)

# Want some Markov?

```javascript
emojiBot.feed('path/to/file.txt').then(function () {
  emojiBot.client.addListener('message', function (from, to, message) {
    emojiBot.respond(from, to, message)
  })
})
```
