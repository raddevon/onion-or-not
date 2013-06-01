var currentHeadline, headlines;
var answerHeight    = $('#answer').outerHeight();
var feedbackHeight;
var whiteHeight     = feedbackHeight + answerHeight;

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
        fillHeadline(randomHeadline);
    });
}

function fillHeadline() {
    feedbackHeight  = $('#feedback').outerHeight();

    if (currentHeadline) {
        $("#headline").html(quoted(currentHeadline.title));

        setTimeout(function(){$('#feedback').removeClass('correct wrong');}, 400);

        // Initial sizing of the #white div
        $("#white").css({
            'overflow': 'hidden',
            'height': whiteHeight + 'px',
            'transform':'translate(0,'+ (0-feedbackHeight) + 'px)'
        });

        // Initial positioning of #feedback div
        $("#feedback").css({
            'transform':'translate(0,' + 0 + 'px)',
            'opacity': '0'
        });

        $("#answer").css({
            'transform':'translate(0,' + 0 + 'px)',
            'opacity': '1',
            'visibility' : 'visible'
        });
    }

    // Remove overflow: hidden after animations complete to allow the Facebook like content to display fully
    setTimeout(function(){$('#white, #quiz').css('overflow', '');},400);

}

function showResponse(response) {
    // Fill the response in the appropriate element
    $("#feedback .message").text(response);

    // Animate the response
    $("#white").css({
        'transform':'translate(0,' + (0-answerHeight) + 'px)'
    });
    $("#answer").css({
        'transform':'translate(0,' + answerHeight + 'px)',
        'opacity': 0
    });
    $("#feedback").css({
        'opacity': 1,
        'transform':'translate(0,' +  answerHeight + 'px)',
        'visibility': 'visible'
    });

    // Remove overflow: hidden after animations complete to allow the Facebook like content to display fully
    setTimeout(function(){
        $('#white').css('overflow', '');
        $('#answer').css('visibility', 'hidden');
        },400);

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

function touchClick(sel, fnc) {
  $(sel).on('touchstart click', function(event) {
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

// Click binding for answer buttons
touchClick('#onion, #not', function(e) {
    answerResponse(e.delegateTarget);
});

// Click binding for next headline button
touchClick('#next', newHeadline);

// Initial load of headlines and first random headline
headlines = new HeadlineList('js/headlines.json');
newHeadline();

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
