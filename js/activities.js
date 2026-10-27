// counter for tweets for each activity type, skip unknown
function countActivities(tweets) {
	const counts = {};
	for (const tweet of tweets) {
		const activity = tweet.activityType;
		if (activity === "unknown") {
			continue;
		}

		if (counts[activity] === undefined) { // new activity
			counts[activity] = 1;
		} else {
			counts[activity]++;
		}
	}
	return counts;
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity
	const activityCounts = countActivities(tweet_array);

	// turn counts into list of objects for vega-lite
	const activityList = [];
	for (const activity in activityCounts) {
		activityList.push({activity: activity, count: activityCounts[activity]});
	}

	// sort from most to least tweeted activities
	activityList.sort(function(a, b) {
		return b.count - a.count;
	});

	document.getElementById('numberActivities').innerText = activityList.length;
	document.getElementById('firstMost').innerText = activityList[0].activity;
	document.getElementById('secondMost').innerText = activityList[1].activity;
	document.getElementById('thirdMost').innerText = activityList[2].activity;

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityList
	  },
	  //bar chart with activity on y-axis and count on x-axis sorted from most to least tweeted
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "count", "type": "quantitative", "title": "Number of Tweets"},
		"y": {"field": "activity", "type": "nominal", "sort": "-x", "title": "Activity"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	//list of every tweet that is one of the top three activities, with the day of the week and distance
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const topThree = [activityList[0].activity, activityList[1].activity, activityList[2].activity];

	const distanceList = [];
	for (const tweet of tweet_array) {
		const activity = tweet.activityType;
		if (topThree.includes(activity)) {
			distanceList.push({activity: activity, day: days[tweet.time.getDay()], distance: tweet.distance});
		}
	}

	// x-axis order: monday to sunday
	const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	// scatter plot of distance by day of the week for the three most-tweeted activities, with color for activity
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of the three most-tweeted activities by day of the week.",
	  "data": {
	    "values": distanceList
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "day", "type": "ordinal", "sort": dayOrder, "title": "Day of Week"},
		"y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
		"color": {"field": "activity", "type": "nominal", "title": "Activity"}
	  }

	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	// scatter plot of mean distance by day of the week for the three most-tweeted activities, with color for activity
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of the three most-tweeted activities by day of the week.",
	  "data": {
	    "values": distanceList
	  },
	  "mark": "point",
	  "encoding": {
		"x": {"field": "day", "type": "ordinal", "sort": dayOrder, "title": "Day of Week"},
		"y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean Distance (miles)"},
		"color": {"field": "activity", "type": "nominal", "title": "Activity"}
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	// hide averages chart until user click button
	document.getElementById('distanceVisAggregated').style.display = 'none';

	//button swaps between the two distance charts
	document.getElementById('aggregate').addEventListener('click', function() {
		const scatterChart = document.getElementById('distanceVis');
		const meanChart = document.getElementById('distanceVisAggregated');
		const button = document.getElementById('aggregate');

		if (meanChart.style.display === 'none') {
			meanChart.style.display = 'block';
			scatterChart.style.display = 'none';
			button.innerText = 'Show all points';
		} else {
			meanChart.style.display = 'none';
			scatterChart.style.display = 'block';
			button.innerText = 'Show means';
		}
	});

	//answer the questions about which activities tended to be longest and when
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekends';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});