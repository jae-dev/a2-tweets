// show date range of tweets
function dateRange(tweets) {
	let earliest = tweets[0].time;
	let latest = tweets[0].time;

	for (const tweet of tweets) {
		if (tweet.time < earliest) {
			earliest = tweet.time;
		}
		if (tweet.time > latest) {
			latest = tweet.time;
		}
	}

	const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateFormat);
}

// format fraction into a percentage with 2 decimals
function toPercent(part, whole) {
	let percent = part / whole * 100;
	return percent.toFixed(2) + "%";
}

// fill spans with given class name + value
function fillSpans(className, value) {
	const spans = document.getElementsByClassName(className);
	for (const span of spans) {
		span.innerText = value;
	}
}

// Counts how many tweets are in each category. fills in the counts and percentages
function categoryCounts(tweets) {
	let completed = 0;
	let live = 0;
	let achievement = 0;
	let miscellaneous = 0;

	for (const tweet of tweets) {
		if (tweet.source === "completed_event") {
			completed++;
		}
		else if (tweet.source === "live_event") {
			live++;
		}
		else if (tweet.source === "achievement") {
			achievement++;
		}
		else {
			miscellaneous++;
		}
	}

	const total = tweets.length;
	fillSpans('completedEvents', completed);
	fillSpans('completedEventsPct', toPercent(completed, total));
	fillSpans('liveEvents', live);
	fillSpans('liveEventsPct', toPercent(live, total));
	fillSpans('achievements', achievement);
	fillSpans('achievementsPct', toPercent(achievement, total));
	fillSpans('miscellaneous', miscellaneous);
	fillSpans('miscellaneousPct', toPercent(miscellaneous, total));
}

// count completed tweets that are human written
function writtenCounts(tweets) {
	let completed = 0;
	let written = 0;

	for (const tweet of tweets) {
		if (tweet.source === "completed_event") {
			completed++;
		}
		if (tweet.written) {
			written++;
		}
	}

	fillSpans('written', written);
	fillSpans('writtenPct', toPercent(written, completed));
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
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	dateRange(tweet_array);
	categoryCounts(tweet_array);
	writtenCounts(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});