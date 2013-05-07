

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

$default = function() {
	less.modifyVars({
	'@Rheight': $Rheight,
	'@Qheight': $Qheight,
	'@Theight': $Theight
	});
	console.log($Rheight);
};


// $.getScript('js/less.js');

// $full = "imgs/Fullgreen.jpg";


	$.getJSON('js/links.json', function(data) {
		SetA = data.Headlines.slice(0);
				item = SetA[Math.floor(Math.random()*SetA.length)];
				console.log(item.onion);

				SetA.splice(item,1);
				$('#headline').replaceWith('<h1 id = "headline">' + '"' + item.headline+ '"' + '</h1>');
				$('#source').replaceWith("<a target='_blank' id='source' href = " + item.url  + "></a>");

				
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

});

$not.on("click",function(){
	$("#response").addClass("answer");
	$("#question").addClass("answer");
	$("#white").addClass("answer");
});



$next.on("click", function() {



	$.getJSON('js/links.json', function(data) {
		// SetA = data.Headlines.slice(0);
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
			SetA = data.Headlines.slice(0);
		}




		// Headlines[0].headline
  });

	});
// });




