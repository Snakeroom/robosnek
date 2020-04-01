'use strict';

// TODO: This will be role audit stuff that doesn't have to be Snakeroom-specific

export const performRoleAudit = () => {

};


/*/
findAllMemberJoinDates(Snakeroom)
	.then(memberJoinDates => {
		for(const [memberID, timestamp] of memberJoinDates) {
			Snakeroom.members.fetch(memberID)
				.then(member => {
					if(timestamp < ogSnekCutoffDate) {
						member.roles.add(originalSnekRoleID);
					} else if (timestamp < vet19CutoffDate) {
						member.roles.add(veteran19RoleID);
					}
				})
		}
		timestampLog("Fucking did it.");
	});
//*/

/*

const hasRole = (member, roleID) => {
	return member.roles.cache.has(roleID);
};

const makeAuditResult = ({stepPassed=true, reason='No reason given.', rolesToRemove=[], rolesToAdd=[]}) => {
	return {
		stepPassed: stepPassed,
		reason: reason,
		rolesToRemove: rolesToRemove,
		rolesToAdd: rolesToAdd
	};
};
const defaultPassResult = makeAuditResult({});

const auditRoles = () => {
	const roleErrors = {
	};

	const roleAuditStepList = [
		sneklingAuditStep,
		trustedDeveloperAuditStep
	];

	Snakeroom.members.fetch()
		.then(snekList => {
			snekList.each(snekMember => {
				for (const auditStep of roleAuditStepList) {
					const stepResult = auditStep(snekMember);

					if (!stepResult.stepPassed) {
						if (!(snekMember in roleErrors)) {
							roleErrors[snekMember] = [];
						}
						for (const roleToRemove of stepResult.rolesToRemove) {
							if (hasRole(snekMember, roleToRemove.id)) {
								roleErrors[snekMember].push({
									action: RoleAction.remove,
									role: roleToRemove,
									reason: stepResult.reason
								})
							}
						}
						for (const roleToAdd of stepResult.rolesToAdd) {
							if (!hasRole(snekMember, roleToAdd.id)) {
								roleErrors[snekMember].push({
									action: RoleAction.add,
									role: roleToAdd,
									reason: stepResult.reason
								})
							}
						}
					}
				}
			});
			console.log(roleErrors)
		})
		.catch(err => {
			console.error(err);
		});
	console.log(Snakeroom.memberCount);
};


const isBot = (member) => {
	return member.user.bot;
};

//*/