var headline, headlines;

function HeadlineList(url) {
    // Object that retrieves a list of headlines from a JSON file
    this.url = url;

    this.isEmpty = function() {
        return (this.quantity === 0 || this.quantity === undefined);
    };

    this.getRandom = function(remove) {
        // Selects and returns a random headline object
        if (this.isEmpty()) {
            this.refreshContent();
        }
        var headlineNumber = Math.floor(Math.random()*this.quantity);
        var headlinePick = this.list[headlineNumber];
        if (remove) {
            this.deleteHeadline(headlineNumber);
        }
        return headlinePick;
    };

    this.getHeadline = function(number, remove) {
        // Returns a headline specified by index
        if (this.isEmpty()) {
            this.refreshContent();
        }
        var headlinePick = this.list[number];
        if (remove) {
            this.deleteHeadline(number);
        }
        return headlinePick;
    };

    this.deleteHeadline = function(number) {
        // Deletes a headline specified by index
        this.list.splice(number, 1);
        this.quantity -= 1;
    };

    this.fillFromJSON = function(data) {
        // Sets object properties with results from the AJAX call
        this.list = data.headlines;
        this.quantity = this.list.length;
    };

    this.refreshContent = function() {
        // Reloads JSON file
        $.ajax(this.url, {
            async: false,
            success: this.fillFromJSON.bind(this),
            type: 'GET',
            data: {},
            datatype: 'json'
        });
    };

    // Initial content load
    this.refreshContent();
}

function Headline(object) {
    this.title = object.title;
    this.url = object.url;
    // Grabs the portion of the URL between the second and third slashes
    this.domain = this.url.split('/')[2];
    this.onion = object.onion;

    this.isOnion = function(){
        return this.onion;
    };
}

function quoted(text) {
    // Returns the text with the HTML entities for proper quotes
    return '&#8220;' + text + '&#8221;';
}

function newHeadline() {
    // Remove inline styles added by jQuery
    $('#feedback, #answer, #white').removeAttr('style');
    $('#white').css('overflow', 'hidden');

    setTimeout(function(){$('#feedback').removeClass('correct wrong');},400);


    // Initial sizing of the #white div
    $("#white").height($("#answer").outerHeight());

    // Initial positioning of #feedback div
    $("#feedback").css('bottom', $('#answer').outerHeight() + $('#feedback').outerHeight()+ 'px');

    // Give a message when the player has seen all the headlines
    if (headlines.quantity === 0) {
        alert("You've been through all the headlines. I'll load them up again so you can keep playing.");
    }

    headline = new Headline(headlines.getRandom(true));
    $("#headline").html(quoted(headline.title));
}

function showResponse(response) {
    // Fill the response in the appropriate element
    $("#feedback .message").text(response);

    // Animate the response
    $("#answer").css({
        // 'transition': '400ms ease-out',
        'bottom': 0 - $('#feedback').outerHeight(),
        'opacity': 0
    });
    $("#feedback").css({
        // 'transition': '400ms ease-out',
        'opacity': 1,
        'top': 0 - $('#answer').outerHeight() + 'px'
    });
    $("#white").css({
        // 'transition': '400ms ease-out',
        'height': $("#feedback").outerHeight()
        // 'background': 'green'
        // 'background': 'linear-gradient(to bottom, rgba(86,154,127,.9) 15%,rgba(230,234,242,.85) 50%)'
    });

    // Remove overflow: hidden after animations complete to allow the Facebook like content to display fully
    setTimeout(function(){$('#white').css('overflow', '');},400);
}

function answerResponse() {
    // Grabs the portion of the URL between the second and third slashes and lists it as the source. Uses the full link as the href.
    $("#source").text(headline.domain).attr('href', headline.url);

    var response;
    // Compare button clicked with headline's onion value. Starts building a response based on whether the response was correct or not.
    if ( (this.id === "not" && !headline.onion) || (this.id === "onion" && headline.onion) ) {
        response = "Yup. ";
        // $("body").css("background", "url('imgs/FullGreen.jpg')").css("background-size", "cover");
        // setTimeout(function(){$("#white").toggleClass("correct");},50);
        $("#feedback").toggleClass("correct");
    } else {
        response = "Nope. ";
        // setTimeout(function(){$("#white").toggleClass("wrong");},50);
        $("#feedback").toggleClass("wrong");
        // $("body").css("background", "url('imgs/NoGreen.jpg')").css("background-size", "cover");
    }
    // Appends to reflect the fakeness or realness of the story.
    if (headline.onion) {
        response += "Just a joke";
    } else {
        response += "This happened.";
    }
    showResponse(response);
}

// Click event bindings for the buttons
$('#onion, #not').on("click",answerResponse);
$('#next').on("click", newHeadline);

// Initial load of headlines and first random headline
headlines = new HeadlineList('js/headlines.json');
newHeadline();
