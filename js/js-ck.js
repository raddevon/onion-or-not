function Headline(e,t,n){this.title=e;this.url=t;this.domain=this.url.split("/")[2];this.onion=n;this.isOnion=function(){return this.onion}}function HeadlineList(e){this.url=e;this.loaded=$.Deferred();this.isEmpty=function(){return this.quantity===0||this.quantity===undefined};this.getRandom=function(e){var t=this;t.isEmpty()&&t.refreshContent();return t.ajaxPromise.pipe(function(){var n=Math.floor(Math.random()*t.quantity),r=t.list[n];e&&t.deleteHeadline(n);return r})};this.getHeadline=function(e,t){var n=this;this.isEmpty()&&this.refreshContent();n.ajaxPromise.success(function(){var r=n.list[e];t&&n.deleteHeadline(e);return r})};this.deleteHeadline=function(e){this.list.splice(e,1);this.quantity-=1};this.fillFromJSON=function(e){this.list=[];for(var t=0;t<e.headlines.length;t++){var n=e.headlines[t];this.list[t]=new Headline(n.title,n.url,n.onion)}this.quantity=this.list.length;$(this).trigger("ajaxSuccess");this.loaded.resolve()};this.refreshContent=function(){var e=this;e.ajaxPromise=$.ajax(e.url,{success:function(t){e.fillFromJSON(t)},beforeSend:function(){$(e).trigger("ajaxLoading")},complete:function(){$(e).trigger("ajaxComplete")},error:function(){$(e).trigger("ajaxError")},type:"GET",data:{},timeout:4e3,datatype:"json"})}}function quoted(e){return"&#8220;"+e+"&#8221;"}function newHeadline(){headlines.getRandom(!0).done(function(e){currentHeadline=e;fillHeadline(e)});headlines.quantity===0&&alert("You've been through all the headlines. I'll load them up again so you can keep playing.")}function fillHeadline(){if(currentHeadline){var e=$("#hidden").html(quoted(currentHeadline.title));height=e.height();width=e.width();$("#headline").animate({height:height,width:width},50,"linear",function(){$("#headline").html(quoted(currentHeadline.title));$("#feedback, #answer, #white").removeAttr("style");$("#white").css("overflow","hidden");setTimeout(function(){$("#feedback").removeClass("correct wrong")},400);$("#white").height($("#answer").outerHeight());$("#feedback").css("bottom",$("#answer").outerHeight()+$("#feedback").outerHeight()+"px")})}}function showResponse(e){$("#feedback .message").text(e);$("#answer").css({bottom:0-$("#feedback").outerHeight(),opacity:0});$("#feedback").css({opacity:1,top:0-$("#answer").outerHeight()+"px"});$("#white").css({height:$("#feedback").outerHeight()});setTimeout(function(){$("#white").css("overflow","")},400)}function answerResponse(){$("#source").text(currentHeadline.domain).attr("href",currentHeadline.url);var e;if(this.id==="not"&&!currentHeadline.onion||this.id==="onion"&&currentHeadline.onion){e="Yup. ";$("#feedback").toggleClass("correct")}else{e="Nope. ";$("#feedback").toggleClass("wrong")}currentHeadline.onion?e+="Just a joke":e+="This happened.";showResponse(e)}var currentHeadline,headlines;$("#onion, #not").on("click",answerResponse);$("#next").on("click",newHeadline);headlines=new HeadlineList("js/headlines.json");$(headlines).on("ajaxSuccess",function(){$("#loading").hide();$("#error").hide()});$(headlines).on("ajaxLoading",function(){$("#loading").show();$("#error").hide()});$(headlines).on("ajaxError",function(){$("#loading").hide();$("#error").show()});newHeadline();