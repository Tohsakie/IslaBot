# Bot Discord ISLA

![Alt Text](https://media.giphy.com/media/GvbEnwqiGCsk8/giphy.gif)

First attempt to make a discord bot in Javascript for a community server in 2020. <br>
Isla manages the level management, displays gif / meme, play musique for you and it's the most cutest bot ♥

***

## Commands
All command must start with `!Isla` or `!isla` or `@Isla`
* `info` => Display the current level of the user
* `about` => Display informataion about the bot
* `help` / `aled` => Display all commands 
* `top` => Display top 10 most active user
* `hug` => Isla hug you ♥
* `hug @someone` => You hug @someone 
* `gif [tag(s)]` => Display a gif about the tag
* `gif [tag(s)] @someone` => Send a gif to someone about the tag
* `play [url]` => play the music (add the url into the queue)
* `skip` => To the next music 
* `stop` => stop music
* `ban [id_channel] [msg]` => if admin, display a old french meme
* `tg` => :c
* `attaque` => Isla angry  
***
## Deployment
### Using docker
#### download source code
```
$ git clone https://github.com/Tohsakie/IslaBot.git
$ cd IslaBot
```
#### generate Discord & Tenor tokens
* Create a new application <a href="https://discord.com/developers/applications">here</a> and retrieve the token  
then replace the placeholder in the `configBot.json` file
* Get the Tenor API token on <a href="https://tenor.com/developer/dashboard"> this link </a>  
then replace the placeholder in the `configBot.json` file
#### Build & Run Isla
```bash
$ docker build -t isla-image .
$ docker run -d isla-image
```
#### Miscellaneous
in case of odd behavior, restart the container
```bash
docker ps #find container id
docker stop <container_id>
docker rm -f <container_id>
```
***
### Manually
A list of technologies used within the project:
* [Node.JS](https://nodejs.org/en/) : Version > 12
***
## Setup
If you want to just add Isla into your server, click on this <a href="https://discord.com/oauth2/authorize?client_id=701873239135223949&scope=bot&permissions=8">link</a>.
<br>
If you want your own version of isla, then :
* Create a new application <a href="https://discord.com/developers/applications">here</a> and retrieve the token
* Get the Tenor API token on <a href="https://tenor.com/developer/dashboard"> this link </a>
* On your computer :
```
$ git clone https://example.com
$ cd BotIsla
$ npm install
```
* Create 10 different role on your Discord server (from level 0 to level 100)

* On the `configBot.json`, replace the "level_X" value to your role ID
* Replace the value "Token_Discord" and "Token_Tenor" with your Token

Great !
Now you can type 
```
$ npm start bot.js
```

### (BONUS)
If you want to host your Bot, I highly recommand you to use <a href="https://pm2.keymetrics.io/"> PM2 </a>, it's allow you to keep your bot online !
```
// To install
$ npm install pm2 -g

// To launch
$ pm2 start bot.js
``` 
***

## Improvement
Improvements must be made :
* Separate commands / functions in several files
* Update Discord.js from 12 to lattest
* Add new commands
* Use slash commands
* Command in English

***

