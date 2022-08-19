const Discord = require("discord.js")
const YouTube = require("discord-youtube-api");
const SQLite = require("better-sqlite3");
const Canvas = require('canvas');
const sql = new SQLite('./liste.sqlite');

var listeConfig = require("./configBot.json");


const queue = new Map();
const ytdl = require("discord-ytdl-core");

const Tenor = require("tenorjs").client({
  "Key": listeConfig["Token_Tenor"], // https://tenor.com/developer/keyregistration
  "Filter": "off", // "off", "low", "medium", "high", not case sensitive
  "Locale": "en_US", // Your locale here, case-sensitivity depends on input
  "MediaFilter": "minimal", // either minimal or basic, not case sensitive
  "DateFormat": "D/MM/YYYY" // Change this accordingly
});

const client = new Discord.Client();
client.login(listeConfig["Token_Discord"])


client.on("ready", () => {

  console.log(`${client.user.tag} connecté ! (~>.>)~`)
  client.user.setActivity("!Isla help", { type: "PLAYING" })
  const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'liste';").get();

  if (!table['count(*)']) {
    console.log("Create");
    // If the table isn't there, create it and setup the database correctly.
    sql.prepare("CREATE TABLE liste (id TEXT PRIMARY KEY, xp INTEGER, max INTEGER, lvl INTEGER);").run();
    // Ensure that the "id" row is always unique and indexed.
    sql.prepare("CREATE UNIQUE INDEX idx_liste_id ON liste (id);").run();
    sql.pragma("synchronous = 1");
    sql.pragma("journal_mode = wal");
  }

  // And then we have two prepared statements to get and set the score data.
  client.getUser = sql.prepare("SELECT * FROM liste WHERE id = ?");
  client.setXp = sql.prepare("UPDATE liste SET xp=? WHERE id=?");
  client.setLvl = sql.prepare("UPDATE liste SET xp=?,max=?,lvl=? WHERE id=?");
  client.getLvl = sql.prepare("SELECT lvl FROM liste WHERE id= ?");
  client.getMax = sql.prepare("SELECT max FROM liste WHERE id= ?");
  client.createUser = sql.prepare("INSERT OR REPLACE INTO liste (id, xp, max, lvl) VALUES (?, ?, ?, ?);");
  client.delUser = sql.prepare("DELETE FROM liste WHERE id = ?");
  client.topUser = sql.prepare("SELECT id, lvl, xp FROM liste ORDER BY lvl desc, xp desc LIMIT 10;");
  client.topTotal = sql.prepare("SELECT id FROM liste ORDER BY lvl desc, xp desc;");

})

client.on("guildMemberAdd", (member) => {

  const guild = member.guild;
  grpStart = guild.roles.cache.find(role => role.id === listeConfig["level_0"]);
  member.roles.add(grpStart);

});


client.on("message", async msg => {

  
  const guild = msg.guild;
  
  //si msg provient d'un bot OSEF
  if (msg.author.bot) return;

  
    //si l'utilisateur du message n'existe pas dans la BDD on le créer =>
    if(!(client.getUser.get(msg.author.id))){
      client.createUser.run(msg.author.id,0,30,0);
    }

    if(!(msg.content.startsWith("!") || (msg.mentions.has(client.user.id)) )){
    // On augmente l'xp de 1 à chaque msg
    client.setXp.run((client.getUser.get(msg.author.id).xp+1),msg.author.id);

    //Si l'xp est au dessus de l'xp max alors =>
    if(client.getUser.get(msg.author.id).xp >= client.getUser.get(msg.author.id).max){
      
      //LVL = LVL + 1
      client.setLvl.run(0,(parseInt(client.getUser.get(msg.author.id).max)*1.25),(parseInt(client.getLvl.get(msg.author.id).lvl)+1), msg.author.id);

      //msg 
      msg.channel.send({embed: {
        color: "#00BFFF",
        title: "Félicitation " + msg.author.username + " !",
        thumbnail: {
          url: msg.author.avatarURL(),
        },
        description: "Tu passe au **niveau " + client.getUser.get(msg.author.id).lvl + "** (~>.>)~" 
      }
      });

      switch(client.getLvl.get(msg.author.id).lvl){
        case 10:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_10"]);
          msg.author.roles.add(grpStart);
          break;
        case 20:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_20"]);
          msg.author.roles.add(grpStart);
          break;
        case 30:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_30"]);
          msg.author.roles.add(grpStart);
          break;
        case 40:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_40"]);
          msg.author.roles.add(grpStart);
          break;
        case 50:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_50"]);
          msg.author.roles.add(grpStart);
          break;  
        case 60:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_60"]);
          msg.author.roles.add(grpStart);
          break;
        case 70:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_70"]);
          msg.author.roles.add(grpStart);
          break;
        case 80:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_80"]);
          msg.author.roles.add(grpStart);
          break;
        case 90:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_90"]);
          msg.author.roles.add(grpStart);
          break;
        case 100:
          grpStart = msg.guild.roles.cache.find(role => role.id === listeConfig["level_100"]);
          msg.author.roles.add(grpStart);
          break;

      }

    }    
    if(msg.content.startsWith("Isla<3")){
      msg.channel.send("love ❤");
    }
  

    // Si le message est une commande :
  } else {

    if(msg.content.startsWith("!turbo")){
      msg.channel.send("```Graouuuu```");
    }


    else if((msg.content.startsWith("!Isla")) || msg.mentions.has(client.user.id) || msg.content.startsWith("!isla")){
      islaCmd(msg);
    }
  
  }
})








////////////////////////////////////////:
////////////////////////////////////////

  function islaCmd(msg){
    var cmd = msg.content.split(" ");
    var tcmd = msg.content.toLowerCase();


    if((msg.content.includes("merci")) || (msg.content.includes("Merci"))){
      msg.channel.send("De rien ! ❤️")
    }

    else if(cmd[1] == "info"){
        const progressBar = new ProgressBar(client.getUser.get(msg.author.id).xp, client.getUser.get(msg.author.id).max, 20); 
        let bar = progressBar.createBar();
        id = '';
        num = 1;
        listeUser = client.topTotal.all();
        for(var i = 0; msg.author.id != listeUser[i].id; i++){
          num++;
        }

        if(num == 1){
          num = "1er"
        } else{
          num = num + "ème"
        }

        msg.channel.send({embed: {
          color: "#00BFFF",
          title: "Informations " + msg.author.username + " : ",
          thumbnail: {
            url: msg.author.avatarURL(),
          },
          description: "Tu es au **niveau " + client.getUser.get(msg.author.id).lvl + "** "+ " (" + client.getUser.get(msg.author.id).xp + "/" + client.getUser.get(msg.author.id).max + ")"+ "\nEt tu es **" + num + "** sur "+ listeUser.length +"\n" +" \n"+ bar
        }
        });
    }

    else if(cmd[1] == "about"){
      let totalSeconds = (client.uptime / 1000);
      let days = Math.floor(totalSeconds / 86400);
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.round(totalSeconds % 60);

      msg.channel.send({embed: {
        color: 3447003,
        title: "Isla : ",
        thumbnail: {
          url: 'https://avatarfiles.alphacoders.com/111/111629.png',
        },
        description: "\n **Uptime** : " + days + " jours | " + hours + " heures | " + minutes + " minutes | " + seconds + " secondes " + "\n **Dev** : Oreki (Hacquard Grégorie) " + "\n **Version** : V0.1" + "\n **Notes** : Première version d'Isla."
      }
    });
    }

    else if((cmd[1] == "help") || (cmd[1] == "aled")){
      msg.channel.send({embed: {
        color: 3447003,
        title: "Isla aide :",
        thumbnail: {
          url: 'https://b.thumbs.redditmedia.com/s5F_d8qfoJD6N-Rlr8F376VcWs1xLXtelkwE5-Ks8Do.png',
        },
        description:"`!Isla help/aled` : Vous donne cette aide\n`!Isla about` : Information sur Isla\n`!turbo` : Ping de dernier recours.\n\n`!Isla info` : Vous donne des informations sur votre niveau.\n`!Isla top` : Vous donnes le top 10 des BG\n\n`!Isla hug` : Isla vous envoies un gif tout mignion <3.\n`!Isla hug @quelqu'un` : Vous envoyez de l'amour à @quelqu'un.\n`!Isla gif [tag]` : Isla envoie un gif à propos de votre tag.\n`!Isla gif [tag] @quelqu'un` : Envoie un gif à propos de votre tag à quelqu'un."
      }});
    }

    else if(cmd[1]=="top"){

      listeUser = client.topUser.all();
      listeUserS = "\n";

      for(var i = 0; i < listeUser.length; i++){

          listeUserS = listeUserS + ((i+1) + " - <@" + listeUser[i].id  + "> | Niveau : " + listeUser[i].lvl + " (" + listeUser[i].xp + "xp)\n");
        
        }
     
      msg.channel.send({embed: {
        color: "#FFFF00",
        title: "Le TOP 10 des BG",
        thumbnail: {
          url: 'http://assets.stickpng.com/images/580b585b2edbce24c47b2af5.png',
        },
        description: listeUserS
      }});
    }

    else if((tcmd.includes("calin")) || (tcmd.includes("câlin")) || (tcmd.includes("hug"))){
      hug = Math.floor(Math.random() * Math.floor(10));
      hugg = '';

      Tenor.Search.Random("anime hug", "1").then(Results => {
        Results.forEach(Post => {
          tempHeho = 0;
          for(var i = 0; i < cmd.length ; i++){
            var user = getUserFromMention(cmd[i]);
            if ((user) && (user.id != "701873239135223949")) {
              tempHeho++;
              msg.channel.send("<@" + user.id + ">, tu viens de recevoir un calin de la part de <@" + msg.author.id + "> ! <3")
              msg.channel.send(Post.url)
            } 
          }
          if(tempHeho == 0) {
            msg.reply("(づ￣ ³￣)づ ");
            msg.channel.send(Post.url);
          }
        });
        }).catch(console.error);
      
    } 



    else if(tcmd.includes("gif")){
      var action = '';
      for(var i=2; i < cmd.length; i++){
        user = getUserFromMention(cmd[i]);
        if(user){
          null
        } else{
          action = action + cmd[i] + " ";
        }
      }

      console.log(action);
      Tenor.Search.Random(action, "1").then(Results => {
        Results.forEach(Post => {
          tempHeho = 0;
          for(var i = 0; i < cmd.length ; i++){
            var user = getUserFromMention(cmd[i]);
            if ((user) && (user.id != "701873239135223949")) {
              tempHeho++;
              msg.channel.send("<@" + msg.author.id + "> " + action + "<@" + user.id + "> ! ")
              msg.channel.send(Post.url)
            } 
          }
          if(tempHeho == 0) {
            msg.channel.send(Post.url);
          }
        });
        }).catch(console.error);


    }


    else if((tcmd.includes("tg")) || (tcmd.includes("méchant")) || (tcmd.includes("mechant")) ){
      msg.channel.send("https://tenor.com/view/isla-plastic-memories-sad-gif-12807002")
    }

    else if(tcmd.includes("attaque")){
      msg.channel.send("https://gfycat.com/waterloggedbabyishcrossbill");
    }


    //Musique side
    else if (cmd[1]=="play"){
      const serverQueue = queue.get(msg.guild.id);
      execute(msg, serverQueue);
      return;
    } else if (cmd[1]=="skip"){
      const serverQueue = queue.get(msg.guild.id);
      skip(msg, serverQueue);
      return;
    } else if (cmd[1]=="stop"){
      const serverQueue = queue.get(msg.guild.id);
      stop(msg, serverQueue);
      return;
    } 

    else if (cmd[1] == "ban"){

      if((msg.member.hasPermission("ADMINISTRATOR"))){

      
      temp = msg.guild.channels.cache.find(channel => channel.id === cmd[2]);
        const canvas = Canvas.createCanvas(470, 470);
        const ctx = canvas.getContext('2d');

        Canvas.loadImage('./img/aa1.jpeg').then( background => {
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

          ctx.strokeStyle = '#74037b';
          ctx.strokeRect(0, 0, canvas.width, canvas.height);
  
          // Assign the decided font to the canvas
          ctx.font = applyText(canvas, "test");
          ctx.font ='19px Helvetica'
          ctx.fillStyle = '#ffffff';
          ctx.fillText(cmd[3], 320, 348);
  
          ctx.beginPath();
          ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
  
  
          const attachment1 = new Discord.MessageAttachment(canvas.toBuffer(), 'oh.png');
          const attachment2 = new Discord.MessageAttachment('./img/aa2.jpg', 'tkt.png');
          const attachment3 = new Discord.MessageAttachment('./img/aa3.jpeg', 'shit.png');
  
          temp.send(attachment1);
          temp.send(attachment2);
          temp.send(attachment3);
        });
      } else{
        msg.channel.send({embed: {
          color: "#ff0000",
          title: "Dommage",
          description: "Bien tenté :)."
        }})
    
      }
    }

    else if(cmd[1] == "aie"){
    

      msg.guild.fetchAuditLogs({
        limit: 1,
        type: 'MEMBER_MOVE',
      }).then(fetchedLogs => {
        const deletionLog = fetchedLogs.entries.first();
      
        const { executor, target } = deletionLog;
      console.log(`${target.tag} left the guild; kicked by ${executor.tag}?`);

 
    })}

  
    else{
      msg.reply("Ce n'est pas une commande correcte !")
      console.log("rip");
    }
  }

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return ctx.font;
};


function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

// Music fonctions

async function execute(msg, serverQueue) {
  const args = msg.content.split(" ");

  const voiceChannel = msg.member.voice.channel;
  if (!voiceChannel)
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "Vous n'êtes pas dans un channel vocal !" 
    }
    });
  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "ISLA N'AS PAS LES PERM"
    }
    });
  }

  const songInfo = await ytdl.getInfo(args[2]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: msg.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(msg.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(msg.guild, queueContruct.songs[0], args);
    } catch (err) {
      console.log(err);
      queue.delete(msg.guild.id);
      return msg.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "Musique ajouté. ",
      description: `${song.title} sera joué prochainement !`  
    }
    });
  }
}

function skip(msg, serverQueue) {
  if (!msg.member.voice.channel)
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "Vous n'êtes pas dans un channel vocal."
    }
    });
  if (!serverQueue)
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "(!) Il n'y a pas de musique à skip ! " 
    }
    });
  serverQueue.connection.dispatcher.end();
}

function stop(msg, serverQueue) {
  if (!msg.member.voice.channel)
    return msg.channel.send({embed: {
      color: "#00BFFF",
      title: "Vous n'êtes pas dans un channel vocal."
    }
    });
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song, args) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(args[2],{
      filter: "audioonly",
      opusEncoded: false,
      fmt: "mp3",
      encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
  })
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error)));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Musique: **${song.title}**`);
}




class ProgressBar {
  constructor(value, maxValue, barSize) {
          this.value = value;
          this.maxValue = maxValue;
          this.barSize = barSize;
  }


  // Create a text progress bar

  createBar() {
      let percentage = this.value / this.maxValue; //Calculate the percentage of the bar
      let progress = Math.round((this.barSize * percentage)); //Calculate the number of square caracters to fill the progress side.
      let emptyProgress = this.barSize - progress; //Calculate the number of dash caracters to fill the empty progress side.

      let progressText = "▇".repeat(progress); //Repeat is creating a string with progress * caracters in it
      let emptyProgressText = "—".repeat(emptyProgress); //Repeat is creating a string with empty progress * caracters in it
      let percentageText = Math.round(percentage * 100) + "%"; //Displaying the percentage of the bar

      let bar = "[" + progressText + emptyProgressText + "] " + percentageText; //Creating the bar
      return bar;
  }

}