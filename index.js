require('dotenv').config();
const Discord = require('discord.js');
const { prefix, emojis } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', async (message) => {
  // Check if role includes Trivia Master
  const roles = message.member.roles.cache;
  if (!roles.some((role) => role.name.includes('Trivia Master'))) return;
  // Only start timer on Channel names that start with 'trivia'
  if (!message.channel.name.startsWith('trivia')) return;
  // Start timer with ::Q prefix
  if (message.content.startsWith(prefix)) {
    const msg = await message.channel.send(`:mega: Timer Starting!`);
    let i = 0;
    const interval = setInterval(() => {
      if (i === 15) {
        // Time's up stop interval
        msg.edit(':mega: TIME’S UP :alarm_clock: Submit your answer!');
        clearInterval(interval);
      } else if (i % 5 === 0 || (i >= 12 && i <= 14)) {
        // Update timer at 15, 10, 5, 3, 2, 1
        msg.edit(`:mega: Submit your answer in ${emojis[i]} seconds!`);
      }
      i++;
    }, 1000);
  }
});

client.login(process.env.DISCORD_TOKEN);
