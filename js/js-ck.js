function HeadlineList(e){this.url=e;this.isEmpty=function(){return this.quantity===0||this.quantity===undefined};this.getRandom=function(e){this.isEmpty()&&this.refreshContent();var t=Math.floor(Math.random()*this.quantity),n=this.list[t];e&&this.deleteHeadline(t);return n};this.getHeadline=function(e,t){this.isEmpty()&&this.refreshContent();var n=this.list[e];t&&this.deleteHeadline(e);return n};this.deleteHeadline=function(e){this.list.splice(e,1);this.quantity-=1};this.fillFromJSON=function(e){this.list=e.headlines;this.quantity=this.list.length};this.refreshContent=function(){$.ajax(this.url,{async:!1,success:this.fillFromJSON.bind(this),type:"GET",data:{},datatype:"json"})};this.refreshContent()}function Headline(e){this.title=e.title;this.url=e.url;this.domain=this.url.split("/")[2].split("www.")[1]||this.url.split("/")[2];this.onion=e.onion;this.isOnion=function(){return this.onion}}function quoted(e){return"&#8220;"+e+"&#8221;"}function newHeadline(){feedback=$("#feedback").outerHeight();answer=$("#answer").outerHeight();total=0-($("#answer").outerHeight()+$("#feedback").outerHeight());$("#feedback, #answer").removeAttr("style");$("#white").css({overflow:"hidden",height:answer+"px"});console.log($("#answer").outerHeight());console.log($("#feedback").outerHeight());console.log(total);setTimeout(function(){$("#feedback").removeClass("correct wrong")},400);setTimeout(function(){$("#white").removeClass("correct wrong")},400);$("#feedback").css({transform:"translate(0,"+total+"px)"});headline=new Headline(headlines.getRandom(!0));$("#headline").html(quoted(headline.title))}function showResponse(e){answer=0-$("#answer").outerHeight()+"px";$("#feedback .message").text(e);$("#white").css({height:$("#feedback").outerHeight()});$("#answer").css({transform:"translate(0,"+$("#feedback").outerHeight()+"px)",visibility:"hidden"});$("#feedback").css({opacity:1,transform:"translate(0,"+answer+")",visibility:"visible"});setTimeout(function(){$("#white").css("overflow","")},400)}function answerResponse(){$("#source").text(headline.domain).attr("href",headline.url);var e;if(this.id==="not"&&!headline.onion||this.id==="onion"&&headline.onion){e="Yup. ";$("#feedback").toggleClass("correct")}else{e="Nope. ";$("#feedback").toggleClass("wrong")}headline.onion?e+="Just a joke":e+="This happened.";showResponse(e)}var headline,headlines;$("#onion, #not").on("tap click",answerResponse);$("#next").on("tap click",newHeadline);headlines=new HeadlineList("js/headlines.json");newHeadline();window.matchMedia("only screen and (min-width: 581px)").matches&&$("#mobile").remove();