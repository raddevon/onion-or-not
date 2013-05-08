var headline, headlines, response;

function HeadlineList(url) {
    this.url = url;

    this.checkEmpty = function() {
        if (this.quantity === 0) {
            this.refreshContent();
        }
    };

    this.getRandom = function(remove) {
        var headlineNumber = Math.floor(Math.random()*this.quantity);
        var headline = this.list[headlineNumber];
        if (remove) {
            this.deleteHeadline(headlineNumber);
        }
        return headline;
    };

    this.getHeadline = function(number, remove) {
        var headline = this.list[number]
        if (remove) {
            this.deleteHeadline(number);
        }
        return headline;
    };

    this.deleteHeadline = function(number) {
        this.list.splice(number, 1);
        this.quantity -= 1;
    };

    this.fillFromJSON = function(data) {
        this.list = data.headlines;
        this.quantity = this.list.length;
    };

    this.refreshContent = function() {
        response = $.when($.getJSON(this.url, this.fillFromJSON.bind(this)));
    };

    this.refreshContent();
}

function Headline(object) {
    this.title = object.title;
    this.url = object.url;
    this.onion = object.onion;

    this.isOnion = function(){
        return this.onion;
    }
}

function quoted(text) {
    // Returns the text with the HTML entities for proper quotes
    return '&#8220;' + text + '&#8221;';
}

function setupPage() {
    $("#headline").html(quoted(headline.title))
}

function answerResponse() {
    // Grabs the portion of the URL between the second and third slashes and lists it as the source. Uses the full link as the href.
    var site = headline.url.split('/')[2];
    $("#source").text(site).attr('href', headline.url);

    var response;
    // Compare button clicked with headline's onion value. Starts building a response based on whether the response was correct or not.
    if ( (this.id === "not" && !headline.onion) || (this.id === "onion" && headline.onion) ) {
        response = "Yup. ";
        $("body").css("background", "url('imgs/Fullgreen.jpg')").css("background-size", "cover");
    } else {
        response = "Nope. ";
        $("body").css("background", "url('imgs/nogreen.jpg')").css("background-size", "cover");
    }
    // Appends to reflect the fakeness or realness of the story.
    if (headline.onion) {
        response += "It's fake.";
    } else {
        response += "This happened.";
    }
    // Fill the response in the appropriate element
    $("#response .message").text(response);

    // Animate the response
    $("#question").css({
        'transition': '400ms ease-out',
        'bottom': '-500px'
    });
    $("#response").css({
        'transition': '400ms ease-out',
        'opacity': 1,
        'top': 0 - $('#question').outerHeight() + 'px'
    });
    $("#white").css({
        'transition': '400ms ease-out',
        'height': $("#response").outerHeight()
    });
}

function nextHeadline() {

}

$('#onion, #not').on("click",answerResponse);



$('#next').on("click", function() {



	$.getJSON('js/links.json', function(data) {
		// SetA = data.list.slice(0);
		$("#response").removeClass("answer");
		$("#question").removeClass("answer");
		$("#white").removeClass("answer");

		item = SetA[Math.floor(Math.random()*SetA.length)];
		console.log(item);
		$('#headline').replaceWith('<h1 id = "headline">' + '"' + item.headline+ '"' + '</h1>');
		$('#source').replaceWith("<a target='_blank' id='source' href = " + item.url + "></a>");
		$('#source').text(domain(item.url));
		SetA.splice(item,1);

		if (SetA.length === 0) {
			SetA = data.list.slice(0);
		}




		// list[0].headline
  });

	});
// });

// Initial load of headlines and first random headline
headlines = new HeadlineList('js/headlines.json');
response.done(function() {
    headline = new Headline(headlines.getRandom(true));
    setupPage();
});

// Initial sizing of the #white div
$("#white").height($("#question").outerHeight());

$("#response").css('bottom', $('#question').outerHeight() + $('#response').outerHeight()+ 'px');