//=============================================================================
// Get random numbers for Brownian motion simulator
// Algorithms - Jose Blanchet
// Implementation - Kaitlin Huben
// (c) Kaitlin Huben 2013
//=============================================================================

/* Sends the GET request to RANDOM.org and parses the reply */
function sendRequest() {
	var urlToSend = "http://www.random.org/integers/?num=";
	urlToSend += numbersToRequest;
	urlToSend += "&min=0&max=999999999&col=1&base=10&format=plain&rnd=new";
	$.ajax({
		// requests 10000 numbers (max allowed) between 0 and 999999999
		// documentation here: http://www.random.org/clients/http/
		url: urlToSend
	})
	.done(function(data){
		parseReply(data);
	});
}

/* does the reply parsing for sendRequest() */
function parseReply(reply) {
	//split the string at each newline
	//keep in mind response has final newline at end 
	//(e.g., one more newline than element)
	var splitString = reply.split("\n");
	
	// see if you have all 10000 elements
	// again, +1 because extra newline
	if(splitString.length != numbersToRequest + 1) {
		//you don't have all elements - aka, error occurred
		//put error message in randomNumbers
		haveRandomNumbers = false;
		randomNumbers = [reply];
		randIndex = 0;
	} 
	//otherwise you're good to go - fill randomNumbers
	else {
		haveRandomNumbers = true;
		randomNumbers = [];
		randIndex = 0;
		
		//go through all elements (except last - it's empty)
		//parse as Int and then divide by 1000000000 to get
		//random number [0,1)
		for(var i = 0; i < splitString.length - 1; i++) {
			var intValue = parseInt(splitString[i]);
			randomNumbers.push( intValue / 1000000000);
		}
	}
	console.log(randomNumbers);
}