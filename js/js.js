var currentHeadline, headlines;
var answerHeight;
var aboutHeight;
var feedbackHeight;
var whiteHeight;


// grab objects... values of a and b are switched later
a = $('#headline');
b = $('#above');

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

        return listObject.ajaxPromise.pipe(function() {
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
            timeout: 4000,
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

    if (currentHeadline) {
        a.html(quoted(currentHeadline.title));

 answerHeight = $('#answer').outerHeight();
 aboutHeight = $('#about').outerHeight();
 feedbackHeight  = $('#feedback').outerHeight();

        $("#white").css({
            'overflow': 'hidden',
            // 'height': whiteHeight + 'px',
            'transform':'translate(0,'+ (0-feedbackHeight-aboutHeight) + 'px)'
        });

        // Initial positioning of #feedback div
        $("#feedback, #about").css({
            'transform':'translate(0,' + 0 + 'px)'
            // 'opacity': '0'
        });

        $("#answer").css({
            'transform':'translate(0,' + 0 + 'px)',
            'visibility' : 'visible'
        });
    }
    });
}

function fillHeadline() {

    if (currentHeadline) {

        aHeight = a.outerHeight();
        aboveHeight = b.outerHeight();
        aboveWidth = b.outerWidth();
        a.html(quoted(currentHeadline.title));
        // aboveHeight

        // Initial sizing of the divs
        // $("#headline-box").css({
        //     'transform': 'scale('+aboveWidth+','+aboveHeight+')',  //headline-box set to height of next hidden headline
        //     'min-width': aboveWidth + 'px'
        // });

        $("#headline-box").animate({
            'height': aboveHeight + 'px',  //headline-box set to height of next hidden headline
            'min-width': aboveWidth + 'px'
        });

        a.css({
            'transform':'translate(0,' + (0-aboveHeight) + 'px)',
            'opacity': '0'
        });

        b.css({
            'transform':'translate(0,' + (0) + 'px)',
            'opacity': '1'
        });

        $("#white").css({
            'transform':'translate(0,'+ (0-feedbackHeight-aboutHeight) + 'px)'
        }).toggleClass('overflow');

        // Initial positioning of #feedback div
        $("#feedback, #answer").css({
            'transform':'translate(0,' + 0 + 'px)',
            'visibility' : 'visible'
        }).toggleClass("opacity");
    }

    // Remove overflow: hidden after animations complete to allow the Facebook like content to display fully
    setTimeout(function(){$('#feedback').removeClass('correct wrong');}, 400);

    //switch the values of a and b so to allow the headlines to cycle
    oldA = a; //save object a to give to b later
    a = b;    // make a equal to b
    b = oldA; // make b equal to old a

    // In the background move the a headline down below the headline-box to prep
    setTimeout(function(){b.css('transform','translate(0,'+ (aboveHeight) + 'px)');}, 400);

}

function showResponse(response) {
    // Fill the response in the appropriate element
    $("#feedback .message").text(response);

    // Animate the response
    $("#white").css({
        'transform':'translate(0,' + (0-answerHeight-aboutHeight) + 'px)'
    });
    $("#feedback, #answer").css({
        // 'opacity': 1,
        'transform':'translate(0,' +  (answerHeight - 4) + 'px)'
    }).toggleClass("opacity");

    // Remove overflow: hidden after animations complete to allow the Facebook like content to display fully
    setTimeout(function(){
        $('#white').toggleClass('overflow');
        $('#answer').css('visibility', 'hidden');
        },400);

    // setTimeout(function(){b.css('transform','translate(0,'+ (aboveHeight) + 'px)');}, 400);

    //Grab the next random headline
    headlines.getRandom(true).done(function(randomHeadline){
        currentHeadline = randomHeadline;
    });
    //Fill the other hidden h1 to measure it later
    b.html(quoted(currentHeadline.title));
        aboveHeight = b.outerHeight();
        aboveWidth = b.outerWidth();


}

function answerResponse(trigger) {
    // Grabs the portion of the URL between the second and third slashes and lists it as the source. Uses the full link as the href.
    $("#source").text(currentHeadline.domain).attr('href', currentHeadline.url);

    var response;
    // Compare button clicked with headline's onion value. Starts building a response based on whether the response was correct or not.
    if ( (trigger.id === "not" && !currentHeadline.onion) || (trigger.id === "onion" && currentHeadline.onion) ) {
        response = "Yup. ";
        $("#feedback").addClass("correct");
    } else {
        response = "Nope. ";
        $("#feedback").addClass("wrong");
    }
    // Appends to reflect the fakeness or realness of the story.
    if (currentHeadline.onion) {
        response += "Just a joke";
    } else {
        response += "This happened.";
    }
    showResponse(response);
}

function showAbout(){
        total = feedbackHeight + answerHeight;

            // Initial sizing of the #white div
        $("#white").css({
            'overflow': 'hidden',
            // 'height': aboutHeight + 'px',
            'transform':'translate(0,'+ (0-feedbackHeight-answerHeight) + 'px)'
        });

        // Initial positioning of #feedback div
        $("#feedback, #about, #headline, #answer").css({
            'transform':'translate(0,' + total + 'px)',
            'opacity': '0'
        });

        $("#about").css({
            'transform':'translate(0,' + total + 'px)',
            'opacity': '1'
        });

}

function touchClick(sel, fnc) {
  $(sel).on('touchend click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        if(event.handled !== true) {
            fnc(event);
            event.handled = true;
        } else {
            return false;
        }
  });
}

// Initial load of headlines and first random headline
headlines = new HeadlineList('js/headlines.json');
newHeadline();

// Click binding for answer buttons
touchClick('#onion, #not', function(e) {
    answerResponse(e.delegateTarget);
});

touchClick('.about', function() {
    showAbout();
});

// Click binding for next headline button
touchClick('#next', function(e) {

    fillHeadline(currentHeadline);
});

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


if ($(window).width() > 580) {
    Socialite.load('.social-buttons');
}
