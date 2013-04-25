

$(document).ready(function() {

// $full = "imgs/Fullgreen.jpg";
$width = $(".social").width();
$source = $('#source');
console.log($width);

// $source.width($width);



	$("#onion").on("click",function(){
		$("#question").animate({
			bottom: '-500'
		}, 1500);
		$("#response").animate({
			top: '0'
		}, 2000);
		$("body").css("background", "url('imgs/Fullgreen.jpg')");
		$("body").css("background-size", "cover");

	});

	$("#next").on("click",function(){
		$("#question").css("display", "inline-block");
		$("#response").css("display","none");
		$("body").css("background", "url('imgs/halfgreen.jpg')");
		$("body").css("background-size", "cover");

	
	});

		$("#response").on("click",function(){
			$("#question").css("display", "none");
			$("#response").css("display", "inline-block");
			$("body").css("background", "url('imgs/nogreen.jpg')");
			$("body").css("background-size", "cover");

	});
});
