//array of written tweets, used by functions below
let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	// filter to only written tweets
	for (const tweet of tweet_array) {
		if (tweet.written) {
			writtenTweets.push(tweet);
		}
	}

	//start with empty search
	document.getElementById('searchCount').innerText = 0;
	document.getElementById('searchText').innerText = "";
}

// update table everytime user inputs or deletes text in the search box
function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchBox = document.getElementById('textFilter');

	searchBox.addEventListener('input', function() {
		const search = searchBox.value;
		const table = document.getElementById('tweetTable');
		document.getElementById('searchText').innerText = search;

		// empty search box clears the table
		if (search === "") {
			table.innerHTML = "";
			document.getElementById('searchCount').innerText = 0;
			return;
		}

		//lower case for case insensitive search
		let rows = "";
		let count = 0;
		for (const tweet of writtenTweets) {
			if (tweet.writtenText.toLowerCase().includes(search.toLowerCase())) {
				count++;
				rows += tweet.getHTMLTableRow(count);
			}
		}

		table.innerHTML = rows;
		document.getElementById('searchCount').innerText = count;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});