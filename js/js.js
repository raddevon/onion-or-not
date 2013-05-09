

$Qheight = $('#question').outerHeight() + 'px';
$Rheight = $('#response').outerHeight()+ 'px';
$Theight = $('#question').outerHeight() + $('#response').outerHeight()+ 'px';
$source = $('#source');
$onion = $("#onion");
$not = $("#not");
$next = $("#next");
SetA = [];
var item;

function domain(data) {
	var a = document.createElement('a');
	a.href = data;
	return a.hostname;
	}


$(document).ready(function() {

// $default = function() {
// 	less.modifyVars({
// 	'@Rheight': $Rheight,
// 	'@Qheight': $Qheight,
// 	'@Theight': $Theight
// 	});
// 	console.log($Rheight);
// };


// $.getScript('js/less.js');

// $full = "imgs/Fullgreen.jpg";


	$.getJSON('js/links.json', function(data) {
		SetA = data.Headlines.slice(0);
				index = Math.floor(Math.random()*SetA.length);
				item = SetA[index];

				SetA.splice(index,1);
				$('#headline').text('"'+item.headline+'"');

				$('#source').attr('href',item.url);
				$('#source').text(domain(item.url));
// 		SetA = data.Headlines.slice(0);
// 		item = SetA[Math.floor(Math.random()*SetA.length)];

$default();

// 	$back =	$( "<h1/>", {
//   		"id": "headline",
//   		"text": item.headline
});
	// alert($back.height);

});



$onion.on("click",function(){
	$("#response").addClass("answer");
	$("#question").addClass("answer");
	$("#white").addClass("answer");

	if (item.onion == 1) {
		$("#response h2").text("Yup, just a joke");
	}

	else {
		$("#response h2").text("Nop! This happened...");

	}

});

$not.on("click",function(){
	$("#response").addClass("answer");
	$("#question").addClass("answer");
	$("#white").addClass("answer");

		if (item.onion == 1) {
		$("#response h2").text("Nop, just a joke");
	}

	else {
		$("#response h2").text("Hooray");

	}
});



$next.on("click", function() {

		if (SetA.length === 0) {
		$.getJSON('js/links.json', function(data) {
		SetA = data.Headlines.slice(0);
			});
		}

		$("#response").removeClass("answer");
		$("#question").removeClass("answer");
		$("#white").removeClass("answer");

		index = Math.floor(Math.random()*SetA.length);
		item = SetA[index];

		SetA.splice(index,1);
		$('#headline').text('"'+item.headline+'"');
		$('#source').attr('href',item.url);
		$('#source').text(domain(item.url));




});
// });




