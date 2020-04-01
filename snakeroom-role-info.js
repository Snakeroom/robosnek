'use strict';

// TODO: This is very stubbed out.  Snakeroom role stuff will be here.  Probably the snakeroom-specific audit methods, too.

/*/

const sneklingAuditStep = (member) => {
	let auditResult = defaultPassResult;

	if (!isBot(member) && !hasRole(member, sneklingRoleID)) {
		auditResult = makeAuditResult({
			stepPassed: false,
			reason: `Every non-bot in Snakeroom should be a snekling.`,
			rolesToAdd: [rolesMap.get(sneklingRoleID)]
		});
	} else if (isBot(member) && hasRole(member, sneklingRoleID)) {
		auditResult = makeAuditResult({
			stepPassed: false,
			reason: `${member.displayName} is a bot, and Sneklings are people only.`,
			rolesToRemove: [rolesMap.get(sneklingRoleID)]
		});
	}
	return auditResult;
};

const trustedDeveloperAuditStep = (member) => {
	let auditResult = defaultPassResult;

	if (hasRole(member, developerRoleID) && hasRole(member, trustedRoleID)) {
		auditResult = makeAuditResult({
			stepPassed: false,
			reason: `${member.displayName} is Trusted and a Developer.  They should simply be a Trusted Developer.`,
			rolesToRemove: [rolesMap.get(trustedRoleID), rolesMap.get(developerRoleID)],
			rolesToAdd: [rolesMap.get(trustedDeveloperRoleID)]
		});
	} else if (hasRole(member, trustedDeveloperRoleID)) {
		if (hasRole(member, trustedRoleID)) {
			auditResult = makeAuditResult({
				stepPassed: false,
				reason: `${member.displayName} is a Trusted Developer.  The Trusted role is redundant.`,
				rolesToRemove: [rolesMap.get(trustedRoleID)]
			});
		} else if (hasRole(member, developerRoleID)) {
			auditResult = makeAuditResult({
				stepPassed: false,
				reason: `${member.displayName} is a Trusted Developer.  The Developer role is redundant.`,
				rolesToRemove: [rolesMap.get(developerRoleID)]
			});
		}
	}

	return auditResult;
};

const shouldBeOGSnek = (member) => {
	return isBot(member)
		&& member.joinedAt < ogSnekCutoffDate;
};

//*/
