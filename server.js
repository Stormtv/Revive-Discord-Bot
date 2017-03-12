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
app.use(bodyParser.json());
bot.on('ready', () => {
  console.log('I am ready!');
  //createChannel("Dimination#1672");
});
app.post('/createGuildApp', (req,res) => {
  let applicationData = {
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
});

var createChannel = (tag) => {
  let guild = bot.guilds.find(val => val.id === myConfig.guildID);
  if (guild.available) {
    var channel = tag.replace('#','-');
    let permissions = [{ id: '290360921467912192', type: 'role', deny: 1024, allow: 0 },
      { id: '290364473955581953', type: 'role', deny: 0, allow: 1024 },
      { id: '290372685731725312', type: 'role', deny: 0, allow: 1024 },
      { id: '290372821710798849', type: 'role', deny: 0, allow: 1024 }];
    guild.createChannel(channel, 'text', permissions)
     .then(channel => {
       console.log(`Created new channel ${channel}`);
       channel.createInvite({
         temporary: false,
         maxUses: 1
       }).then(invite => {
         console.log(invite.url);
       })
       .catch(console.error);
     })
     .catch(console.error);
  }
};

app.get('/callback', (req,res) => {
  //Handle Discord Request URI?
});

bot.login(myConfig.discordKey);

server.listen(app.get('serverPort'));
console.log('Listening on port', app.get('serverPort'));