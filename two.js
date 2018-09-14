const Discord = require("discord.js");
const fs = require("fs");
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
let xp = require("./xp.json");
const moment = require("moment");
require("moment-duration-format");
moment.locale("pt-BR")
const bot = new Discord.Client({fetchAllMembers: true});

const PREFIX = "tw!";
const COR = "#cc0099";
const LOGO = "https://i.imgur.com/UrZ9CwT.jpg";

const youtube = new YouTube(process.env.YTKEY);

const queue = new Map();


bot.login(process.env.BOT_TOKEN);



//ready & Gamer bot//
bot.on("ready", async => {
    console.log(`${bot.user.username} Está online!`)
    let gamesale = ["Two!", "tw!ajuda", `Online em ${bot.guilds.size} grupos com ${bot.users.size} membros.`];
    var randomi = Math.round(Math.random() * gamesale.length)
    bot.user.setActivity(`${gamesale[gamesale.length == 1 ? 0 : randomi == 0 ? randomi + 1 : randomi - 1]}`, "https://www.twitch.tv/gustavoluii");
    setInterval(() => {
    randomi = Math.round(Math.random() * gamesale.length)
    bot.user.setPresence({ status: 'STREAMING', game: { name: `${gamesale[gamesale.length == 1 ? 0 : randomi == 0 ? randomi + 1 : randomi - 1]}`, url: "https://www.twitch.tv/gustavoluii"}});
},20 * 1000)
            
});

//Count members in topic add//
bot.on('guildMemberAdd', guild => {
    const TwoTopic = `${bot.guilds.get('485105513437331456').memberCount}`
    const TwoTopicMessage = bot.channels.get("488480417155121162")
    TwoTopicMessage.setTopic("<a:hypersquad:471788546466775061> Membros: " +TwoTopic.replace("1", ":one:").replace("2", ":two:").replace("3", ":three:").replace("4", ":four:").replace("5", ":five:").replace("6", ":six:").replace("7", ":seven:").replace("8", ":eight:").replace("9", ":nine:").replace("0", ":zero:"))
});

//Count members in topic remove//
bot.on('guildMemberRemove', guild => {
    const TwoTopic = `${bot.guilds.get('485105513437331456').memberCount}`
    const TwoTopicMessage = bot.channels.get("488480417155121162")
    TwoTopicMessage.setTopic("<a:hypersquad:471788546466775061> Membros: " +TwoTopic.replace("1", ":one:").replace("2", ":two:").replace("3", ":three:").replace("4", ":four:").replace("5", ":five:").replace("6", ":six:").replace("7", ":seven:").replace("8", ":eight:").replace("9", ":nine:").replace("0", ":zero:"))
});

//Welcome message//
bot.on("guildMemberAdd", async member => {
    console.log(`${member} Entrou no servidor.`);

    let Welcomechannel = member.guild.channels.get('485837607452803093');
    let Welcomeembed = new Discord.RichEmbed()
    .setDescription(`${member.user} Entrou em nosso servidor! Sejá bem Vindo`)
    .setImage("https://i.imgur.com/NgZG0hI.gif")
    .setColor("#2E2E2E")
    Welcomechannel.send(Welcomeembed);
});

//bye message//
bot.on("guildMemberRemove", async member => {
    console.log(`${member} Saiu do servidor.`);

    let Leavechannel = member.guild.channels.get('485837607452803093');
    let Leaveembed = new Discord.RichEmbed()
    .setDescription(`${member.user} Saiu do servidor! Espero que um dia ele possa voltar.`)
    .setImage("https://i.imgur.com/1U2fpA4.gif")
    .setColor("#2E2E2E")
    Leavechannel.send(Leaveembed);
});

function clean(text) {
    if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
    return text;
    }
    
    bot.on("message", message => {
    const args = message.content.split(" ").slice(1);
    
    if (message.content.startsWith(`${PREFIX}eval`)) {
    if(message.author.id !== "231611977053503488") return;
    try {
    const code = args.join(" ");
    let evaled = eval(code);
    
    if (typeof evaled !== "string")
    evaled = require("util").inspect(evaled);
    
    message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
    }
});


//commands & events//
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    //prefix custom system//
    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: PREFIX
    };
}
    
    //XP & Level system//
    let xpAdd = Math.floor(Math.random() * 7) + 8;
    //console.log(xpAdd);

    if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
}
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 300;
    xp[message.author.id].xp =  curxp + xpAdd;
    if(nxtLvl <= xp[message.author.id].xp){
    xp[message.author.id].level = curlvl + 1;
    let lvlup = new Discord.RichEmbed()
    .setColor(COR)
    .setDescription(`**YEAH!!!** ${message.author} Você subiu para o Level: **${curlvl + 1}**`);

      message.channel.send(lvlup);
    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if(err) console.log(err)
    }); 

    let nxtLvlXp = curlvl * 500;
    let difference = nxtLvlXp - curxp;

    let prefix = prefixes[message.guild.id].prefixes;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    //chat on command//
    if(cmd === `${prefix}chaton`){
        if (message.member.hasPermission("ADMINISTRATOR")) {
            var da = message.guild.roles.find("name","@everyone")
            message.channel.overwritePermissions(da, {
                SEND_MESSAGES: true
                
                
              })
              let onembed = new Discord.RichEmbed()
              .setDescription(`:unlock: | O canal ${message.channel} foi liberado pelo ${message.author}`)
              .setColor("f0000")
              message.channel.send(onembed);
            }
    }

    //chat off command//
    if(cmd === `${prefix}chatoff`){
        if (message.member.hasPermission("ADMINISTRATOR")) {
            var da = message.guild.roles.find("name","@everyone")
            message.channel.overwritePermissions(da, {
                SEND_MESSAGES: false
                
              })
              let offembed = new Discord.RichEmbed()
              .setDescription(`:lock: | O canal ${message.channel} foi **mutado** pelo ${message.author}`)
              .setColor("f0000")
              message.channel.send(offembed);
        }   
    }

    //votação command//
    if(cmd === `${prefix}votação`){
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const text = args.slice(0.5).join(" ");
             if (text.length < 0.5) return message.channel.send("Você precisa por alguma mensagem!").then((value) => {
               setTimeout(() => {
                    value.delete();
                }, 5000);
            });
            const embed = new Discord.RichEmbed()
            .setColor(COR)
            .setAuthor("Votação:", `https://i.imgur.com/DRE2Syf.gif`)
            .setFooter(`Votação iniciada por: ${message.author.username}`,message.member.user.displayAvatarURL)
            .setDescription(text);
            message.delete().catch();
            message.channel.send("@everyone")
            let msg = await message.channel.send({embed})
            await msg.react('👍');
            await msg.react('👎');

        }
    }

    //anunciar command//
    if(cmd === `${prefix}anunciar`){
        if (message.member.hasPermission("ADMINISTRATOR")) {
            const text = args.slice(0.5).join(" ");
             if (text.length < 0.5) return message.channel.send("Você precisa por alguma mensagem!").then((value) => {
               setTimeout(() => {
                    value.delete();
                }, 3000);
            });
            const embed = new Discord.RichEmbed()
            .setColor(COR)
            .setAuthor(`Anúncio - ${message.guild.name}`, "https://i.imgur.com/qX4nK3l.gif")
            .setFooter(`Anúncio realizado por: ${message.author.username}`,message.member.user.displayAvatarURL)
            .setTimestamp(new Date())
            .setDescription(text);
            message.channel.send("@everyone")
            message.delete().catch();
            message.channel.send({embed}).then(msg=> {
            msg.react('📢');
            
      });
     }
    }

    //uptime bot//
    if(cmd === `${prefix}uptime`){
        let duration = moment.duration(bot.uptime).format('D[d], H[h], m[m], s[s]');

        let uptimeembed = new Discord.RichEmbed()
        .setDescription(`${message.author}, Estou online à: **${duration}**`)
        .setColor(COR)
        message.channel.send(uptimeembed)
    }
    
    //Servers bot//
    if(cmd === `${prefix}servidores`){
    let string = '';
    bot.guilds.forEach(guild => {
    string += guild.owner + " - "+ guild.name + " - " + guild.members.size + '\n';})
    let Serversembed = new Discord.RichEmbed()
        .setColor(COR)
        .addField("Servidores:", `${string}`)
        .setTimestamp()
        .setFooter("Servidores em que estou online", LOGO);
    message.channel.send(Serversembed);
    }

    //XP & Level command info//
    if(cmd === `${prefix}level`){
    let lvlEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username+ " - Level Info", message.author.displayAvatarURL)
    .setColor(COR)
    .setDescription(`Você está no Level **${curlvl}** com **${curxp}** de XP.`)
    .setFooter(`Você precisa de ${difference} XP para o próximo level`, LOGO);
    message.channel.send(lvlEmbed);
  
    }

    //message mention//
    if (message.content == `<@${bot.user.id}>`) {
        message.channel.send("Olá, meu nome é Two! para saber mais sobre meus comandos digite `tw!ajuda`");
    }

    //clear chat//
    if(cmd === `${prefix}limpar`){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
        if(!args[0]) return message.channel.send("Especifique quantas linhas.").then(msg => msg.delete(5000));
            message.channel.bulkDelete(args[0]).then(() => {
            let clearembed = new Discord.RichEmbed()
            .setDescription(`**${args[0]}** `)
            .setColor(COR)
            message.channel.send(clearembed).then(msg => msg.delete(10000));
        });
    }

    //Information of bot//
    if(cmd === `${prefix}botinfo`){
        let bicon = bot.user.displayAvatarURL;
        let botembed = new Discord.RichEmbed()
        .setDescription(`Informações do **${bot.user.username}**`)
        .setColor(COR)
        .setThumbnail(bicon)
        .addField("Dono do Bot:", `<@231611977053503488>`, true)
        .addField("Nome do Bot:", bot.user.username, true)
        .addField("Versão do Bot:", `1.0`, true)
        .addField("Prefix:", `${prefix}`, true)
        .addField("Convite:", "[Clique aqui](https://goo.gl/8EYoEJ)", true)
        return message.channel.send(botembed);
    }

    //prefix custom//
    if(cmd === `${prefix}prefix`){
        if(!message.member.hasPermission("MANAGE_SERVER")) return;
        if(!args[0] || args[0 == "help"]) return message.reply("Use: tw!prefix <prefix>");

        let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
      
        prefixes[message.guild.id] = {
          prefixes: args[0]
        };
      
        fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
          if (err) console.log(err)
        });
      
        let sEmbed = new Discord.RichEmbed()
        .setColor(COR)
        .setDescription(`Prefix Definido: **${args[0]}**`);
        message.channel.send(sEmbed);
    }

    //server info//
    if (cmd === `${prefix}serverinfo`){
        let online = message.guild.members.filter(a => a.presence.status == "online").size;
        let ocupado = message.guild.members.filter(a => a.presence.status == "dnd").size;
        let ausente = message.guild.members.filter(a => a.presence.status == "idle").size;
        let offline = message.guild.members.filter(a => a.presence.status == "offline").size;
        let bot = message.guild.members.filter(a => a.user.bot).size;
        let totalmembros = message.guild.memberCount;
        let canaistexto = message.guild.channels.filter(a => a.type === "text").size;
        let canaisvoz = message.guild.channels.filter(a => a.type === "voice").size;
        let cargos = message.guild.roles.map(a => a).join(", ")
            const embed = new Discord.RichEmbed()
            .setDescription(`Informações do servidor **${message.guild.name}**`)
            .setColor(COR)
            .addField('Dono', `<@${message.guild.owner.id}>`, true)
            .addField("ID", message.guild.id, true)
            .addField(`Membros: ${totalmembros}`, `Online: ${online}\nAusente: ${ausente}\n Ocupado: ${ocupado}\n Offline: ${offline}\n Bots: ${bot}`, true)
            .addField(`Canais: ${canaistexto+canaisvoz}`, `Texto: ${canaistexto}\n Voz: ${canaisvoz}`, true)
            .addField('Criado em:', moment(message.guild.createdAt).format('LLLL'), true)
            .addField(`Cargos: ${message.guild.roles.size}`, cargos, true)
            .setThumbnail(message.guild.iconURL)
            .setTimestamp()
            .setFooter(`Comando solicitado por: ${message.author.tag}`, message.author.avatarURL)
            message.channel.send(embed)
    }

    //user info//
    if(cmd === `${prefix}userinfo`){
        let usuario = message.guild.member(message.mentions.users.first() || bot.users.get(args[0]) || message.author);
        let administrador;
        if(usuario.hasPermission("ADMINISTRATOR") === true) administrador = "sim";
        if(usuario.hasPermission("ADMINISTRATOR") === false) administrador = "não";
        let statusmebro;
        if(usuario.presence.status === "dnd") statusmebro = "Não pertubar";
        if(usuario.presence.status === "idle") statusmebro = "Ausente";
        if(usuario.presence.status === "stream") statusmebro = "Transmitindo";
        if(usuario.presence.status === "offline") statusmebro = "Invisível";
        if(usuario.presence.status === "online") statusmebro = "Disponível";
        let userinfoembed = new Discord.RichEmbed()
          .setThumbnail(usuario.user.displayAvatarURL)
          .setTimestamp()
          .setFooter(message.author.tag, message.author.displayAvatarURL)
          .addField(`Informações principais:`, `:white_small_square:**Usuário**: ${usuario.user.tag}\n:white_small_square:**ID**: ${usuario.user.id}\n:white_small_square:**Status**: ${statusmebro}\n:white_small_square:**Jogando**: ${usuario.user.presence.game ? usuario.user.presence.game.name : 'jogando nada no momento'}\n:white_small_square:**Criada em**: ${moment(usuario.createdAt).format("LLLL")}`)
          .addField(`Informações no servidor:`, `:white_small_square:**Apelido**: ${usuario.user.nickname || "sem apelido"}\n:white_small_square:**Entrou** ${moment(usuario.user.joinedAt).format('LLLL')}\n:white_small_square:**Cargos**: ${usuario.roles.size || "sem cargos"}\n:white_small_square:**Administrador**: ${administrador}`)
          .setDescription(`Informações do usuário: **${usuario.user.username}**`, bot.user.displayAvatarURL)
          .setColor(COR)
            message.channel.send(userinfoembed);
    }

    //temp help//
    //if(cmd === `${prefix}ajuda`){
    //    message.reply("Comando em manutenção!");
   // }

    //help command//
    if(cmd === `${prefix}ajuda`){
        let ajudamebed = new Discord.RichEmbed()
        .setColor(COR)
        .setAuthor("Two - Ajuda", LOGO)
        .setDescription("Clique no Emoji da categoria que você deseja usar:\n:tools: » Relacionado à Moderação.\n:musical_note: » Relacionado à Música.\n:gear: » Relacionado à Comandos.\n\n<a:hypersquad:471788546466775061> Me convide para seu servidor [Clicando aqui!](https://goo.gl/8EYoEJ)")
        message.member.send(ajudamebed).then(msg=> {
        msg.react("🛠").then(r => {
        msg.react("🎵").then(r => {
        msg.react("⚙").then(r => {
        msg.react("⏪").then(r => {

            const Moderação = (reaction, user) => reaction.emoji.name === '🛠' && user.id === message.author.id;
            const musica = (reaction, user) => reaction.emoji.name === '🎵' && user.id === message.author.id;
			const geral = (reaction, user) => reaction.emoji.name === '⚙' && user.id === message.author.id;
            const menu = (reaction, user) => reaction.emoji.name === '⏪' && user.id === message.author.id;

            const mod = msg.createReactionCollector(Moderação);
            const msc = msg.createReactionCollector(musica);
			const ger = msg.createReactionCollector(geral);
			const men = msg.createReactionCollector(menu);
	
			mod.on('collect', r => { 
				const embedmod = new Discord.RichEmbed()
                .setColor(COR)
                .setAuthor("🛠 Moderação")
				.setDescription("tw!chatoff - `Silenciar o canal`\ntw!chaton - `Remover o silencio do canal`")
				msg.edit(embedmod);
				
			  })
			msc.on('collect', r1 => { 
				const embedmsc = new Discord.RichEmbed()
                .setColor(COR)
                .setAuthor("🎵 Música")
                .setDescription("tw!play - `diciona uma musica a lista para tocar.`\ntw!stop - `Para a música e limpa a lista.`\ntw!skip - `Pular uma música.`\ntw!np - `Informação da música que está tocando.`\ntw!queue - `Lista de músicas.`\ntw!pause - `Pausar uma música.`\ntw!resume - `Tirar música do modo Pause.`")
				msg.edit(embedmsc);
			  })
			ger.on('collect', r2 => { 
				const embedger = new Discord.RichEmbed()
                .setColor(COR)
                .setAuthor("⚙ Comandos")
                .setDescription("tw!userinfo - `Informações de um membro`\ntw!botinfo - `Informações do Two`\ntw!serverinfo - `Informações do servidor`\ntw!prefix - `Alterar prefix do Two`\ntw!limpar - `Limpar mensagens`\ntw!level - `Ver seu Level & XP`\ntw!uptime - `Meu tempo online`\ntw!anunciar - `fazer um anúncio`\ntw!votação - `iniciar uma votação`")
				msg.edit(embedger);
			  })
			  men.on('collect', r3 => {
				msg.edit(ajudamebed);
                })

                })
            })
        })
    })
})      



        let ajudachatembed = new Discord.RichEmbed()
        .setDescription("**Okay!** Foi enviado uma lista com todos os meus comandos em seu privado!")
        .setColor(COR)
        message.channel.send(ajudachatembed); 

    }

});


//funciont Music//


bot.on('warn', console.warn);

bot.on('error', console.error);

bot.on('ready', () => console.log('Função de música funcionando!'));

bot.on('disconnect', () => console.log('Eu apenas desconectei, mais já estou reconectando agora...'));

bot.on('reconnecting', () => console.log('Estou me reconectando agora!'));

bot.on('message', async msg => { // eslint-disable-line
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    let messageArray = msg.content.split(" ");
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
    if(!prefixes[msg.guild.id]){
        prefixes[msg.guild.id] = {
            prefixes: PREFIX
    };
}   
    let prefix = prefixes[msg.guild.id].prefixes;
    let command = messageArray[0];
    

	if (command === `${prefix}play`) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('Me desculpe, mas você precisa estar em um canal de voz para tocar música!');
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** foi adicionado à lista!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    msg.channel.send(`__**RESULTADO DA PESQUISA**__\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\n`+"`Forneça um valor para selecionar um dos resultados da pesquisa que vão de 1 a 10.`");
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('Você não respondeu a `Seleção de músicas` e o tempo acabou.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('Não consegui obter nenhum resultado de pesquisa.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === `${prefix}skip`) {
		if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Apenas pessoas com a permissão de `Gerenciar mensagens` tem acesso a esse comando.");
		if (!msg.member.voiceChannel) return msg.channel.send('Você não está em um canal de voz!');
		if (!serverQueue) return msg.channel.send('Não há nada tocando que eu possa pular para você.');
		serverQueue.connection.dispatcher.end('O comando Skip foi usado!');
		return undefined;
	} else if (command === `${prefix}stop`) {
		if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Apenas pessoas com a permissão de `Gerenciar mensagens` tem acesso a esse comando.");
		if (!msg.member.voiceChannel) return msg.channel.send('Você não está em um canal de voz!');
		if (!serverQueue) return msg.channel.send('Não há nada que eu possa fazer para você.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('O comando de parada foi usado!');
		return undefined;
	} else if (command === `${prefix}np`) {
		if (!serverQueue) return msg.channel.send('Não há nada Tocando.');
		return msg.channel.send(`🎶 Tocando agora: **${serverQueue.songs[0].title}**`);
	} else if (command === `${prefix}queue`) {
		if (!serverQueue) return msg.channel.send('Não há nada Tocando.');
		return msg.channel.send(`__**Lista de Músicas:**__\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n\n**Tocando agora:** ${serverQueue.songs[0].title}`);
	} else if (command === `${prefix}pause`) {
		if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Apenas pessoas com a permissão de `Gerenciar mensagens` tem acesso a esse comando.");
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Música pausada!');
		}
		return msg.channel.send('Não há nada Tocando.');
	} else if (command === `${prefix}resume`) {
		if (!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Apenas pessoas com a permissão de `Gerenciar mensagens` tem acesso a esse comando.");
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Música não está mais pausada!');
		}
		return msg.channel.send('Não há nada Tocando.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Eu não pude entrar no canal de voz: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Eu não pude entrar no canal de voz: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** foi adicionado à Lista!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'O fluxo não está gerando com rapidez suficiente.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    let tocandoembed = new Discord.RichEmbed()
    .setDescription(`Tocando: **${song.title}**`)
    .setColor(COR)
	serverQueue.textChannel.send(tocandoembed);
}
