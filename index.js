require('dotenv').config();
const Discord = require('discord.js');
const { prefix, token, emojis } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  if (!message.channel.name.startsWith('trivia')) return;

  if (message.content.startsWith(prefix)) {
    const msg = await message.channel.send(`:mega: Timer Starting!`);
    let i = 0;
    const interval = setInterval(() => {
      if (i === 15) {
        msg.edit(':mega: TIME’S UP :alarm_clock: Submit your answer!');
        clearInterval(interval);
      } else if (i % 5 === 0 || (i >= 12 && i <= 14)) {
        msg.edit(':mega: Submit your answer in ' + emojis[i] + ' seconds!');
      }
      i++;
    }, 1000);
  }
});

client.login(process.env.DISCORD_TOKEN);
