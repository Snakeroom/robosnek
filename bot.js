'use strict';

import dotenv from 'dotenv';
// Reads .env file and sets environment variables
dotenv.config();


import Discord from 'discord.js';
import moment from 'moment';
import commander from 'commander';

import {promises as fs} from 'fs';

import {findAllMemberJoinDates} from './member-join-dates.js';
import {subscribeImposterData} from "./imposter.js";
import {performRoleAudit} from "./role-audit.js";

// I don't know what this person is doing differently from every other node module...
import stringArgv from 'string-argv';
const createArgvArray = stringArgv.parseArgsStringToArgv;


const snakeroomServerID = '429823323585773568';
const welcomeChannelID = '429829794897723403';
const imposterUpdatesChannelID = '694974723154640978';

const sneklingRoleID = '560999332002922506';
const originalSnekRoleID = '692180758311469077';
const veteran19RoleID = '692180904239431711';
const trustedRoleID = '688762713756926032';
const developerRoleID = '562359091196854282';
const trustedDeveloperRoleID = '692180684218826752';

const allRoleIDs = [
	sneklingRoleID,
	originalSnekRoleID,
	veteran19RoleID,
	trustedRoleID,
	developerRoleID,
	trustedDeveloperRoleID
];

const melissaMemberID = '430911637948727296';

const today = moment();
const ogSnekCutoffDate = new Date('2018-05-17');
const vet19CutoffDate = new Date('2019-04-05');
const sixMonthsAgo = today.subtract(6, 'months');

let Snakeroom = null;
let imposterUpdateChannel = null;

// set up DRY access to roles prior to the bot logging in and knowing about them.
const rolesMap = new Map();


const RoleAction = Object.freeze({add: 1, remove: 2});

const roleAuditMethodMap = new Map();
const roleAuditRuleMap = new Map();

export const bot = new Discord.Client();

const usersWhoTriedIt = [];

const getRoleByName = (guild, roleName) => {
	return guild.roles.cache.find(role => role.name === roleName);
};


const timestampLog = (message) => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss.SSS')}] ${message}`);
};

bot.on('ready', () => {
	timestampLog(`Logged in as ${bot.user.tag}`);
	Snakeroom = bot.guilds.resolve(snakeroomServerID);

	imposterUpdateChannel = Snakeroom.channels.resolve(imposterUpdatesChannelID);


	for (const roleID of allRoleIDs) {
		rolesMap.set(roleID, Snakeroom.roles.resolve(roleID));
	}

	subscribeImposterData(onNewImposterUpdate);
});


const onNewImposterUpdate = (updateData) => {
	sendImposterUpdate(imposterUpdateChannel, updateData);
};

const sendImposterUpdate = (channel, update) => {
	channel.send(update);
	//console.log(update);
};

const extractCommandString = (inputMessage) => {
	let matchResult = inputMessage.match(/^rs\s+(?<commandString>.*)/);
	if (matchResult) {
		matchResult = matchResult.groups.commandString;
	}
	return matchResult;
};

bot.on('message', inputMessage => {
	const commandString = extractCommandString(inputMessage.content);
	if (commandString) {
		commander.parse(createArgvArray(commandString), {from: 'user'});
		const senderMemberID = inputMessage.member.id;
		if(senderMemberID === melissaMemberID) {
			inputMessage.channel.send('Hi Melissa.')
				.then(response => console.log(`Responded to '${inputMessage.content}'.`))
				.catch(console.error);
		} else {
			inputMessage.react('❌');
			if (!(senderMemberID in usersWhoTriedIt)) {
				usersWhoTriedIt.push(senderMemberID);
				message.channel.send('Only Melissa can use me rn.')
					.then(response => console.log(`${inputMessage.member.displayName} tried it!`))
					.catch(console.error);
			}
		}
	}
});

/*/
commander
	.command('audit-roles')
	.description('Run a role audit to ensure user roles make sense')
	.action(auditRoles);

//*/

bot.login(process.env.BOT_TOKEN);
