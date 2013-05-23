var currentHeadline, headlines;

function Headline(title, url, onion) {
    this.title = title;
    this.url = url;
    // Grabs the portion of the URL between the second and third slashes
    this.domain = this.url.split('/')[2];
    this.onion = onion;

    this.isOnion = function(){
        return this.onion;
    };
}

function HeadlineList(url) {
    // Object that retrieves a list of headlines from a JSON file
    this.url = url;

    this.loaded = $.Deferred();

    this.isEmpty = function() {
        return (this.quantity === 0 || this.quantity === undefined);
    };

    this.getRandom = function(remove) {
        // Selects and returns a random headline object
        var listObject = this;

        if (listObject.isEmpty()) {
            listObject.refreshContent();
        }

        return listObject.ajaxPromise.pipe(function() {
            var headlineNumber = Math.floor(Math.random() * listObject.quantity);
            var headlinePick = listObject.list[headlineNumber];
            if (remove) {
                listObject.deleteHeadline(headlineNumber);
            }
            return headlinePick;
        });
    };

    this.getHeadline = function(number, remove) {
        // Returns a headline specified by index
        var listObject = this;

        if (this.isEmpty()) {
            this.refreshContent();
        }

        listObject.ajaxPromise.success(function() {
            var headlinePick = listObject.list[number];
            if (remove) {
                listObject.deleteHeadline(number);
            }
            return headlinePick;
        });
    };

    this.deleteHeadline = function(number) {
        // Deletes a headline specified by index
        this.list.splice(number, 1);
        this.quantity -= 1;
    };

    this.fillFromJSON = function(data) {
        // Sets object properties with results from the AJAX call
        this.list = [];
        for (var i = 0; i < data.headlines.length; i++) {
            var currentHeadline = data.headlines[i];
            this.list[i] = new Headline(currentHeadline.title, currentHeadline.url, currentHeadline.onion);
        }
        this.quantity = this.list.length;
        $(this).trigger('ajaxSuccess');
        this.loaded.resolve();
    };

    this.refreshContent = function() {
        // Reloads JSON file
        var listObject = this;

        listObject.ajaxPromise = $.ajax(listObject.url, {
            success: function(data) {
                listObject.fillFromJSON(data);
            },
            beforeSend: function() {
                $(listObject).trigger('ajaxLoading');
            },
            complete: function() {
                $(listObject).trigger('ajaxComplete');
            },
            error: function() {
                $(listObject).trigger('ajaxError');
            },
            type: 'GET',
            data: {},
            datatype: 'json'
        });
    };
}

function quoted(text) {
    // Returns the text with the HTML entities for proper quotes
    return '&#8220;' + text + '&#8221;';
}

function newHeadline() {
    headlines.getRandom(true).done(function(randomHeadline) {
        currentHeadline = randomHeadline;
        fillHeadline(randomHeadline);
    });

    // Give a message when the player has seen all the headlines
    if (headlines.quantity === 0) {
        alert("You've been through all the headlines. I'll load them up again so you can keep playing.");
    }
}

function fillHeadline() {
    if (currentHeadline) {
        var w = $("#hidden").html(quoted(currentHeadline.title));
        height = w.height();
        width = w.width();

        $("#headline").animate({
            height: height,
            width: width
            }, 50, 'linear', function(){
            $("#headline").html(quoted(currentHeadline.title));
            $('#feedback, #answer, #white').removeAttr('style');
            $('#white').css('overflow', 'hidden');

            setTimeout(function(){$('#feedback').removeClass('correct wrong');}, 400);

            // Initial sizing of the #white div
            $("#white").height($("#answer").outerHeight());

            // Initial positioning of #feedback div
            $("#feedback").css('bottom', $('#answer').outerHeight() + $('#feedback').outerHeight()+ 'px');

        });
    }
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
    $("#source").text(currentHeadline.domain).attr('href', currentHeadline.url);

    var response;
    // Compare button clicked with headline's onion value. Starts building a response based on whether the response was correct or not.
    if ( (this.id === "not" && !currentHeadline.onion) || (this.id === "onion" && currentHeadline.onion) ) {
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
    if (currentHeadline.onion) {
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

// Fills the next headline after a successful AJAX call
$(headlines).on('ajaxSuccess', function() {
    $('#loading').hide();
    $('#error').hide();
});

// Bindings for loading and error events to display appropriate divs
$(headlines).on('ajaxLoading', function() {
    $('#loading').show();
    $('#error').hide();
});

$(headlines).on('ajaxError', function() {
    $('#loading').hide();
    $('#error').show();
});

newHeadline();
