'use strict';

import fetch from 'node-fetch';

const subscriberCallbackList = [];

const newResultsEndpoint = `${process.env.SNEKNET_API}y20/recent/`;

export const subscribeImposterData = (subCallback) => {
	if (!subscriberCallbackList.find(subCallback)) {
		subscriberCallbackList.push(subCallback);
	}
};

const pollForNewResults = () => {
	fetch(newResultsEndpoint)
		.then(response => response.json())
		.then(console.log)
		.then(parsedData => {
			for (const subscriberCallback of subscriberCallbackList) {
				subscriberCallback(parsedData);
			}
		})
		.catch(console.error);
};

//setInterval(pollForNewResults, 1000);