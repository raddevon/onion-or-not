

$(document).ready(function() {

// $full = "imgs/Fullgreen.jpg";



	$("#onion").on("click",function(){
		$("#question").css("display", "none");
		$("#Not").css("display", "inline-block");
		$("body").css("background", "url('imgs/Fullgreen.jpg')");
		$("body").css("background-size", "cover");

	});

	$("#next").on("click",function(){
		$("#question").css("display", "inline-block");
		$("#Not").css("display","none");
		$("body").css("background", "url('imgs/halfgreen.jpg')");
		$("body").css("background-size", "cover");

	
	});

		$("#not").on("click",function(){
			$("#question").css("display", "none");
			$("#Not").css("display", "inline-block");
			$("body").css("background", "url('imgs/nogreen.jpg')");
			$("body").css("background-size", "cover");

	});
});
