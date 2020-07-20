"use strict";

import dotenv from "dotenv";
// Reads .env file and sets environment variables
dotenv.config();


import Discord from "discord.js";
import moment from "moment";
import commander from "commander";

import { subscribeImposterData } from "./imposter.js";

// I don't know what this person is doing differently from every other node module...
import stringArgv from "string-argv";
const createArgvArray = stringArgv.parseArgsStringToArgv;


const snakeroomServerID = "429823323585773568";
const imposterUpdatesChannelID = "694974723154640978";

const sneklingRoleID = "560999332002922506";
const originalSnekRoleID = "692180758311469077";
const veteran19RoleID = "692180904239431711";
const trustedRoleID = "688762713756926032";
const developerRoleID = "562359091196854282";
const trustedDeveloperRoleID = "692180684218826752";

const allRoleIDs = [
	sneklingRoleID,
	originalSnekRoleID,
	veteran19RoleID,
	trustedRoleID,
	developerRoleID,
	trustedDeveloperRoleID,
];

const melissaMemberID = "430911637948727296";

let Snakeroom = null;
let imposterUpdateChannel = null;

// Set up DRY access to roles prior to the bot logging in and knowing about them.
const rolesMap = new Map();

export const bot = new Discord.Client();

const usersWhoTriedIt = [];

const timestampLog = message => {
	process.stdout.write(`[${moment().format("YYYY-MM-DD HH:mm:ss.SSS")}] ${message}\n`);
};

bot.on("ready", () => {
	timestampLog(`Logged in as ${bot.user.tag}`);
	Snakeroom = bot.guilds.resolve(snakeroomServerID);

	imposterUpdateChannel = Snakeroom.channels.resolve(imposterUpdatesChannelID);


	for (const roleID of allRoleIDs) {
		rolesMap.set(roleID, Snakeroom.roles.resolve(roleID));
	}

	subscribeImposterData(onNewImposterUpdate);
});


const onNewImposterUpdate = updateData => {
	sendImposterUpdate(imposterUpdateChannel, updateData);
};

const sendImposterUpdate = (channel, update) => {
	channel.send(update);
};

const extractCommandString = inputMessage => {
	let matchResult = inputMessage.match(/^rs\s+(?<commandString>.*)/);
	if (matchResult) {
		matchResult = matchResult.groups.commandString;
	}
	return matchResult;
};

bot.on("message", inputMessage => {
	const commandString = extractCommandString(inputMessage.content);
	if (commandString) {
		commander.parse(createArgvArray(commandString), { from: "user" });
		const senderMemberID = inputMessage.member.id;
		if(senderMemberID === melissaMemberID) {
			inputMessage.channel.send("Hi Melissa.")
				.then(() => process.stdout.write(`Responded to '${inputMessage.content}'.\n`))
				.catch(error => process.stderr.write(error + "\n"));
		} else {
			inputMessage.react("❌");
			if (!(senderMemberID in usersWhoTriedIt)) {
				usersWhoTriedIt.push(senderMemberID);
				inputMessage.channel.send("Only Melissa can use me rn.")
					.then(() => process.stdout.write(`${inputMessage.member.displayName} tried it!\n`))
					.catch(error => process.stderr.write(error + "\n"));
			}
		}
	}
});

/* /
commander
	.command('audit-roles')
	.description('Run a role audit to ensure user roles make sense')
	.action(auditRoles);

//*/

bot.login(process.env.BOT_TOKEN);
