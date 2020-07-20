"use strict";

const memberJoinDates = new Map();

const updateMemberJoinDate = message => {
	let memberID;
	// TODO: Actually add reading Dyno's Join notifs
	if (message.author !== "DYNO") {
		const member = message.channel.guild.member(message.author);
		if (member) {
			memberID = member.id;
			const memberExistingTimestamp = memberJoinDates.get(memberID);
			const newMessageTimestamp = message.createdTimestamp;
			if (memberExistingTimestamp) {
				if (newMessageTimestamp < memberExistingTimestamp) {
					memberJoinDates.set(memberID, newMessageTimestamp);
				}
			} else {
				memberJoinDates.set(memberID, newMessageTimestamp);
			}
		}
	}
};

const updateAllMemberJoinDates = async (channel, searchBeforeMessage = null) => {
	if (searchBeforeMessage === null) {
		const listOfOneMessage = await channel.messages.fetch({ limit: 1 });
		if (listOfOneMessage.size > 0) {
			updateMemberJoinDate(listOfOneMessage.last());
			return updateAllMemberJoinDates(channel, listOfOneMessage.last());
		}
	} else {
		let nextMessageBatch = await channel.messages.fetch({
			before: searchBeforeMessage.id,
			limit: 100,
		});

		if (nextMessageBatch.size > 0) {
			/* eslint-disable-next-line no-unused-vars */
			for (const [messageID, message] of nextMessageBatch) {
				updateMemberJoinDate(message);
			}

			const earliestFetchedMessage = nextMessageBatch.last();
			nextMessageBatch = null;

			return updateAllMemberJoinDates(channel, earliestFetchedMessage);
		}
	}
};

export const findAllMemberJoinDates = async guild => {

	guild.members.cache.each(member => {
		memberJoinDates.set(member.id, member.joinedTimestamp);
	});

	const guildTextChannels = guild.channels.cache.filter(channel => channel.type === "text");


	const memberJoinDatePromises = [];
	/* eslint-disable-next-line no-unused-vars */
	for (const [channelID, channel] of guildTextChannels) {
		memberJoinDatePromises.push(updateAllMemberJoinDates(channel));
	}

	await Promise.all(memberJoinDatePromises);

	return memberJoinDates;
};
