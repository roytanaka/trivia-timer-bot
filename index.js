require('dotenv').config();
const Discord = require('discord.js');
const { prefix, emojis } = require('./config.json');
const client = new Discord.Client();

let triviaRoleId;

client.once('ready', () => {
  console.log('Ready!');
  // get Trivia Master role ID for use later
  triviaRoleId = client.guilds.cache.first().roles.cache.find((role) => {
    return role.name.includes('Trivia Master');
  }).id;
});

// Only Trivia Master Role can add ✅
client.on('messageReactionAdd', (reaction, user) => {
  if (reaction.emoji.name !== '✅') return;
  // Members with Trivia Master Role
  const membersWithRole = reaction.message.guild.roles.cache.get(triviaRoleId)
    .members;
  // Remove ✅ if not Trivia Master
  if (!membersWithRole.some((member) => member.id === user.id)) {
    reaction.remove(user);
  }
});

client.on('message', async (message) => {
  // Check if role includes Trivia Master
  const roles = message.member.roles.cache;
  if (!roles.some((role) => role.name.includes('Trivia Master'))) return;
  // Only start timer on Channel names that start with 'trivia'
  if (!message.channel.name.startsWith('trivia')) return;
  // Start timer with ::Q prefix
  if (message.content.startsWith(`${prefix}Q`)) {
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

  // Display scores with::scores command
  if (message.content.startsWith(`${prefix}scores`)) {
    // get nicknames of all users on server
    const nicknames = {};
    message.guild.members.cache.forEach((member) => {
      nicknames[member.user.id] = member.nickname;
    });
    const yesterday = new Date().setDate(new Date().getDate() - 1);
    const messages = message.channel.messages.cache
      .array()
      //filter out bots and messages earlier than today
      .filter((msg) => !msg.author.bot && msg.createdTimestamp > yesterday);

    const contestants = new Map();
    // unique contestants list
    for (const message of messages) {
      contestants.set(message.author.id, message.author);
    }

    // filter for correct answers i.e. msg with ✅ reaction
    const correctMessages = messages.filter((msg) =>
      msg.reactions.cache.find((reaction) => reaction._emoji.name === '✅')
    );
    for (const id of contestants.keys()) {
      const score = correctMessages.filter((msg) => msg.author.id === id);
      const user = contestants.get(id);
      user.score = score.length;
      user.nickname = nicknames[id];
      contestants.set(id, user);
    }

    const scores = [];
    contestants.forEach((contestant) => {
      scores.push({
        score: contestant.score,
        user: contestant.nickname || contestant.username,
      });
    });

    scores.sort((a, b) => b.score - a.score);

    let currentScores = 'Current scores:\n';
    scores.forEach((score) => {
      currentScores += `*${score.user}* - **${score.score}**\n`;
    });
    console.log(currentScores);

    await message.channel.send(currentScores.trim());
    // message.delete();
  }
});

client.login(process.env.DISCORD_TOKEN);
