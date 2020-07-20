"use strict";

const subscriberCallbackList = [];

export const subscribeImposterData = subCallback => {
	if (!subscriberCallbackList.find(subCallback)) {
		subscriberCallbackList.push(subCallback);
	}
};
