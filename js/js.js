

$Qheight = $('#question').outerHeight() + 'px';
$Rheight = $('#response').outerHeight()+ 'px';
$Theight = $('#question').outerHeight() + $('#response').outerHeight()+ 'px';
$source = $('#source');
$onion = $("#onion");
$not = $("#not");
$next = $("#next");
SetA = [];
var item;




$(document).ready(function() {

$default = function() {
	less.modifyVars({
	'@Rheight': $Rheight,
	'@Qheight': $Qheight,
	'@Theight': $Theight
	});
};
// $.getScript('js/less.js');

// $full = "imgs/Fullgreen.jpg";

$default();

// 	$.getJSON('js/links.json', function(data) {

// 		SetA = data.Headlines.slice(0);
// 		item = SetA[Math.floor(Math.random()*SetA.length)];


// 	$back =	$( "<h1/>", {
//   		"id": "headline",
//   		"text": item.headline
// });
	// alert($back.height);

});

$onion.on("click",function(){
	$("#response").addClass("answer");
	$("#question").addClass("answer");
	$("#white").addClass("answer");

});

$not.on("click",function(){
	$("#response").addClass("answer");
	$("#question").addClass("answer");
	$("#white").addClass("answer");
});



$next.on("click", function() {



	$.getJSON('js/links.json', function(data) {
		// SetA = data.Headlines.slice(0);
		if (SetA.length !== 0) {
			var item = SetA[Math.floor(Math.random()*SetA.length)];
			SetA.splice(item,1);
				console.log(item.url);
				// $url = 
				$('#headline').replaceWith('<h1 id = "headline">' + item.headline + '</h1>');
				// $('#headline').animate;

				$('#source').replaceWith("<a target='_blank' id='source' href = " + item.url + ">link</a>");
			}

		else {
		SetA = data.Headlines.slice(0);
				var item = SetA[Math.floor(Math.random()*SetA.length)];
				$('#headline').replaceWith('<h1 id = "headline">' + item.headline + '</h1>');
				$('#source').replaceWith("<a target='_blank' id='source' href = " + item.url + "></a>");
		console.log(SetA);
	}

		$("#response").removeClass("answer");
		$("#question").removeClass("answer");
		$("#white").removeClass("answer");



		// Headlines[0].headline
  });

	});
// });




