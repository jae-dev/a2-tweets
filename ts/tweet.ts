class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    //only RunKeeper style templates count

    get source(): string {
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")) {
            return "completed_event";
        } else if (this.text.includes("@Runkeeper Live") || this.text.includes("#RKLive")) {
            return "live_event";
        } else if (this.text.startsWith("Achieved a new") || this.text.startsWith("I just set")) {
            return "achievement";
        }
        return "miscellaneous";
    }

    //returns true if written for completed events
    get written():boolean {
        // only completed events have user text
        if (this.source !== 'completed_event') {
            return false;
        }
        // written text only after -
        if (!this.text.includes(" - ")) {
            return false;
        }
        //written by apps/devices
        if(this.text.includes("TomTom MySports Watch") || this.text.includes("Fat Burner")){
            return false;
        }

        return true;
    }

    //return written text
    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //user text is after the -
        let afterDash = this.text.split(" - ")[1];
        let userText = afterDash.split("http")[0].trim();
        return userText;
    }

    // word 4 is unit for distance, then word 5 is activity type
    get activityType():string {
        if (this.source !== 'completed_event') {
            return "unknown";
        }
        let words = this.text.split(" ");

        if (words[4] !== "km" && words[4] !== "mi") {
            return "unknown";
        }

        let activity = words[5];

        //merge activites with common multiple word names into respective categories
        if (activity === "mtn") {
            activity = "bike";
        }
        if(activity === "nordic") {
            activity = "walk";
        }
        return activity;
    }

    //word 3 is distance, word 4 is unit
    get distance():number {
        if(this.source !== 'completed_event') {
            return 0;
        }
        let words = this.text.split(" ");
        let number = parseFloat(words[3]);

        if (words[4] === "mi") {
            return number;
        }
        if (words[4] === "km") { //conver to miles
            return number / 1.609;
        }

        return 0;
    }

    // builds a table row with row number, activity and tweet text with links
    getHTMLTableRow(rowNumber:number):string {
        let words = this.text.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (words[i].startsWith("http")) {
                words[i] = "<a href='" + words[i] + "' target='_blank'>" + words[i] + "</a>";
            }
        }
        let tweetWithLinks = words.join(" ");

        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetWithLinks + "</td></tr>";
    }
}