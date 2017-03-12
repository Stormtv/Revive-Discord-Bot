/* jshint esversion: 6 */
const myConfig = require('./config.json');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const request = require('request');
const bodyParser = require('body-parser');
const Discord = require('discord.js');
const client = new Discord.Client();
app.set('serverPort', myConfig.serverPort);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.post('/createGuildApp', (req,res) => {

});
server.listen(app.get('serverPort'));
console.log('Listening on port', app.get('serverPort'));