/* jshint esversion: 6 */
const myConfig = require('./config.json');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const request = require('request');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const bot = new Discord.Client();
app.set('serverPort', myConfig.serverPort);
app.use(bodyParser.urlencoded({
  extended: true
}));
let botInvites = [];
app.use(bodyParser.json());
bot.on('ready', () => {
  console.log('I am ready!');
  let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    guild.fetchInvites()
      .then(invites => {
        for (const invite of invites.array()) {
          if (invite.inviter && invite.inviter.id &&
            invite.inviter.id === myConfig.botID && invite.uses !== null &&
            invite.uses === 0)
            botInvites.push(invite.code);
        }
      })
      .catch(console.error);
  }
});
bot.on('guildMemberAdd', (member) => {
  let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    guild.fetchInvites()
      .then(invites => {
        for (const invite of invites.array()) {
          for (var i = 0; i < botInvites.length; i++) {
            if (invite.code === botInvites[i] && invite.uses >= 1) {
              createApplicantUser(member, invite, i);
            }
          }
        }
      })
      .catch(console.error);
  }
});

const createApplicantUser = (member, invite, i) => {
  member.addRole(myConfig.applicantRoleID)
    .then((member) => {
      if (invite.channel) {
        invite.channel.overwritePermissions(member, {
         SEND_MESSAGES: true,
         READ_MESSAGES: true,
         EMBED_LINKS: true,
         ATTACH_FILES: true
        })
        .then((applicant) => {
          member.setNickname(invite.channel.name)
            .then((member) => {
              invite.channel.sendMessage(`@${invite.channel.name}
                Thanks for applying to revive.
                You can find you application here please feel free
                to ask any questions.`);
            })
            .catch(console.error);
        })
        .catch(console.error);
      }
    })
    .catch(console.error);
  invite.delete()
    .then(invite => {
      botInvites.splice(i,1);
    })
    .catch(console.error);
};

app.post('/createGuildApp', (req,res) => {
  const applicationData = {
    name:req.body.name,
    loc:req.body.loc,
    tag:req.body.tag,
    armory:req.body.armory,
    sscombat:req.body.sscombat,
    headset:req.body.headset,
    logs:req.body.logs,
    role:req.body.role,
    awp:req.body.awp,
    prog:req.body.prog,
    left:req.body.left,
    rotation:req.body.rotation,
    resources:req.body.resources,
    hear:req.body.hear,
    crit:req.body.crit,
    sit:req.body.sit,
    schedule:req.body.schedule,
    beta:req.body.beta,
    about:req.body.about,
    joke:req.body.joke
  };
  const applicationText = `**What is your Name, Age and Sex?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.name}\n\n
**Provide the location you will primarily will be playing from and a speedtest.net screenshot from the Chicago server**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.loc}\n\n
**What is your Battle.net Tag**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.tag}\n\n
**Link to your main characters and alternate character's ADVANCED ARMORY**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.armory}\n\n
**Post a screenshot of your character in combat**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.sscombat}\n\n
**Do you have a functioning headset with microphone that you can use in Discord?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.headset}\n\n
**Post your recent warcraft logs**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.logs}\n\n
**What role and spec are you applying for**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.role}\n\n
**List your Artifact Weapon points for all Specs **\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.awp}\n\n
**List Pre Tier-19 Mythic/Heroic Progression Experiences**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.prog}\n\n
**Name your last TWO raiding guilds and the reason for leaving them?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.left}\n\n
**Take us through your opening rotation on a SINGLE TARGET fight. (Healers Ignore this)**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.rotation}\n\n
**What resources do you use to improve yourself?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.resources}\n\n
**How did you hear about us?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.hear}\n\n
**How do you handle criticism and adult humor?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.crit}\n\n
**You may be asked to sit on some fights for composition, gear, or general skill level how do you feel about that?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.sit}\n\n
**Do you have any commitments or schedule changes that we should know about?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.schedule}\n\n
**Are you willing to test new content in PTR/Alpha/Beta?**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.beta}\n\n
**Tell us a little bit about yourself. The more we know the better!**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.about}\n\n
**Tell us a joke**\n
━━━━━━━━━━━━━━━━━━━━━━━━\n
${applicationData.joke}\n\n`;
  let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  let _this = this;
  if (guild.available) {
    const channel = applicationData.tag.replace('#','-');
    const permissions = [
      { id: '231944378577321984', type: 'role', deny: 0, allow: 3072 },
      { id: '231933464201527298', type: 'role', deny: 1024, allow: 0 },
      {id: '231944387255336960',type: 'role',deny: 8192,allow: 3072 },
      {id: '231944378476658690',type:'role',deny:0,allow:3072},
      {id: '231948453737922580',type: 'role',deny: 8192,allow: 3072 }
    ];
    guild.createChannel(channel, 'text', permissions)
     .then(channel => {
       channel.createInvite({
         temporary: false,
         maxUses: 2
       }).then(invite => {
        botInvites.push(invite.code);
        res.send(invite.url);
       })
       .catch(console.error);
       channel.sendMessage(`@everyone New application please review.`).then(message => {
         channel.sendMessage(applicationText, {split:true})
         .then(message => {
         })
         .catch(console.error);
       }).catch(console.error());
     })
     .catch(console.error);
  }
});

app.get('/', (req,res) => {
  res.send("Revive-Discord-Bot");
});

app.get('/callback', (req,res) => {
  //Handle Discord Request URI?
});

bot.login(myConfig.discordKey);

server.listen(app.get('serverPort'));
console.log('Listening on port', app.get('serverPort'));