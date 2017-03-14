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
        console.log(`fetched invites ${invites.array()}`);
        for (const invite of invites.array()) {
          if (invite.inviter && invite.inviter.id &&
            invite.inviter.id === myConfig.botID && invite.uses !== null &&
            invite.uses === 0)
            botInvites.push(invite.code);
        }
        console.log(botInvites);
      })
      .catch(console.error);
  }
});
bot.on('guildMemberAdd', (member) => {
  console.log("new member");
  let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    console.log("guild found / fetching invites");
    guild.fetchInvites()
      .then(invites => {
        console.log(`fetched invites ${invites.array()}`);
        for (const invite of invites.array()) {
          console.log(`all active invite ${invite.code}`);
          for (var i = 0; i < botInvites.length; i++) {
            console.log(invite.code);
            console.log(botInvites[i]);
            console.log(invite.uses);
            if (invite.code === botInvites[i] && invite.uses >= 1) {
              console.log("New Applicant");
              createApplicantUser(member, invite, i);
            }
          }
        }
      })
      .catch(console.error);
  }
});

const createApplicantUser = (member, invite, i) => {
  console.log("Adding Role");
  member.addRole(myConfig.applicantRoleID)
    .then((member) => {
      if (invite.channel) {
        console.log("Overwriting Applicant Channel Permissions");
        invite.channel.overwritePermissions(member, {
         SEND_MESSAGES: true
        })
        .then(() => console.log('Applicant User Created!'))
        .catch(console.error);
      }
    })
    .catch(console.error);
  console.log(`setting nickname of applicant ${invite.channel.name}`);
  member.setNickname(invite.channel.name)
    .then((member) => {
      console.log(`Applicant name set to ${invite.channel.name}`);
    })
    .catch(console.error);
  console.log(`Deleting the invite`);
  invite.delete()
    .then(invite => {
      console.log(`Deleted invite ${invite.code}`);
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
    const permissions = [{ id: '290360921467912192', type: 'role', deny: 1024, allow: 0 },
      { id: '290364473955581953', type: 'role', deny: 0, allow: 1024 },
      { id: '290372685731725312', type: 'role', deny: 0, allow: 1024 },
      { id: '290372821710798849', type: 'role', deny: 0, allow: 1024 }];
    guild.createChannel(channel, 'text', permissions)
     .then(channel => {
       console.log(`Created new channel ${channel}`);
       channel.createInvite({
         temporary: false,
         maxUses: 2
       }).then(invite => {
        console.log(`Sending invite url: ${invite.url} `);
        botInvites.push(invite.code);
        console.log(botInvites);
        res.send(invite.url);
       })
       .catch(console.error);
       channel.sendMessage(applicationText, {split:true})
       .then(message => {
         console.log("sent message");
       })
       .catch(console.error);
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