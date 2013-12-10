var TRIGGER = 1386306000000; // set to August 19th to include opening events
var SECOND = 1000;
var MINUTE = 60000;
var HOUR = 3600000;
var DAY = 86400000;
var FAMILY_PHOTOS = ["1JSConf09.jpg", "1JSConf10.jpg", "1Jsconf11.jpg", "1jsconf12.jpg", "2JSConf09.jpg", "2JSConf10.jpg", "2Jsconf11.jpg", "2jsconf12.jpg", "3JSConf09.jpg", "3JSConf10.jpg", "3Jsconf11.jpg", "3jsconf12.jpg", "4JSConf09.jpg", "4JSConf10.jpg", "4Jsconf11.jpg", "4jsconf12.jpg", "5JSConf09.jpg", "5JSConf10.jpg", "5Jsconf11.jpg", "5jsconf12.jpg", "6JSConf09.jpg", "6JSConf10.jpg", "6Jsconf11.jpg", "6jsconf12.jpg", "7JSConf09.jpg", "7JSConf10.jpg", "7Jsconf11.jpg", "7jsconf12.jpg", "8JSConf09.jpg", "8JSConf10.jpg", "8jsconf12.jpg", "9JSConf10.jpg", "9jsconf12.jpg", "10JSConf10.jpg", "10jsconf12.jpg", "11JSConf10.jpg", "11jsconf12.jpg", "12JSConf10.jpg", "12jsconf12.jpg", "13JSConf10.jpg", "13jsconf12.jpg", "14JSConf10.jpg", "15JSConf10.jpg", "15JSConf12.jpg", "16JSConf10.jpg", "16JSConf12.jpg", "17JSConf10.jpg", "17JSConf12.jpg", "18JSConf10.jpg", "18JSConf12.jpg", "19JSConf12.jpg", "20JSConf12.jpg", "nerdmeritbadge.jpg"];
var toggle = 0;
var updateTimer;

function arrayRandom(){ return (Math.round(Math.random())-0.5); }
function setTime() {
	var now = +(new Date());
	if (now >= TRIGGER) {
		$("#days").html("ROBOTSCONF");
		$("#daystep").html("DOMINATED");
		if (updateTimer)
			clearInterval(updateTimer);
		return false;
	} else {
		var diff = TRIGGER - now;
		var days = parseInt(diff / DAY, 10);
		diff = diff - (days*DAY);
		var hours = parseInt(diff /HOUR, 10);
		diff = diff - (hours*HOUR);
		var minutes = parseInt(diff / MINUTE, 10);;
		diff = diff - (minutes*MINUTE);
		var seconds = parseInt(diff / SECOND, 10);;
		$("#days span").html(days);
		$("#hours").html(hours);
		$("#minutes").html(minutes);
		$("#seconds").html(seconds);
		return true;
	}
}

function loadPhotos(fast) {
	FAMILY_PHOTOS.sort(arrayRandom);
	var suffix = (toggle ? "-alt" : "");
	for (var idx = 0; idx < 16; idx++) {
		if (idx >=10) {
			$("#history"+(idx-9)+suffix).css('background-image', "url(/img/family-photos/"+FAMILY_PHOTOS[idx]+")");
		} else {
			$("#pic"+(idx+1)+suffix).css('background-image', "url(/img/family-photos/"+FAMILY_PHOTOS[idx]+")");
		}
	}
	if (fast) {
		$((toggle ? ".alt" : ".prime")).show();
		$((!toggle ? ".alt" : ".prime")).hide();
	} else {
		$((toggle ? ".alt" : ".prime")).fadeIn('slow');
		$((!toggle ? ".alt" : ".prime")).fadeOut('slow');
	}
	toggle = ((toggle + 1)%2);
}

function f(e) {
	e.stopPropagation();
	e.preventDefault();
}


function setWeather(data) {
	// console.log(data.query.results.channel.item);
	var info = data.query.results.channel.item.forecast[0];
    $('#wxIcon').css({
        backgroundPosition: '-' + (61 * info.code) + 'px 0'
    }).attr({
        title: info.text
    });
    var url = "url(/img/weather/"+info.code+".png)";
   	if ([17, 18, 20,26,27,28,29,30,31,32,38,39,4,40,41,42,43,44,9].indexOf(info.code) <0) {
   		url = "url(/img/weather/30.png)";
   	}
    $('#weather').css('background-image', url); //info.code<img src="http://l.yimg.com/a/i/us/we/52/' + info.code + '.gif" height="130" title="' + info.text + '" />');
    $("#high span").html(info.high);
	$("#low span").html(info.low);
	// $("#weather").html("")
}

function scrollTo(_target) {
    var target = $(_target);
    if (target.length)
    {
        var top = target.offset().top;
        $('html,body').animate({scrollTop: top}, 1000);
        setTimeout(function () { window.location.hash=(_target); }, 1000);
        return false;
    }
}

function activateMenu(key) {

	$(".nav .active").removeClass("active");
	$("#"+key).addClass("active");
}

function setTwitter() {
	$("#tweet").html("Early Bird Tickets are almost sold out, be sure to <a href='http://tickets.robotsconf.com/'>pick up yours</a> soon!");
}
$(function () {
	if (setTime())
		setInterval(setTime, 1000);
	if ($("#front-page").length) {
		loadPhotos(true);
		setInterval(loadPhotos, 10000);

		$(".nav a, a#rtt").click(function (e) {
			var href = $(this).attr("href");
			if (href.indexOf("#") >= 0) {
				// local link
				f(e);
				var target=href.replace("/#", "").replace("#", "");
				scrollTo("#"+target);
				activateMenu(target);

			}
		});
	} else {
		$("#rtt").remove();
	}

  if ($("#fpo").length) {
    var curr = 0;
    var slides = $("#fpo li");
    var max = slides.length;
    var firstRun = false;
    var spinner = function () {
      var showing = (curr+1)%max;
      if (!firstRun) {
        slides.hide();
        $(slides[0]).show();
        firstRun=true;
      } else {
        $(slides[curr]).fadeOut();
        $(slides[showing]).fadeIn();
        curr = showing;
      }
    };
    spinner();
    setInterval(spinner, 7000);
  }

	setTwitter();

    var query = "select * from weather.forecast where woeid=23510725";
    var cacheBuster = Math.floor((new Date().getTime()) / 1200 / 1000);
    var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent(query) + '&format=json&_nocache=' + cacheBuster;
    $.ajax({
        url: url,
        dataType: 'jsonp',
        cache: true,
        jsonpCallback: 'setWeather'
    });
    $(".speaker").hover(function () {
    	$(this).addClass("hover");
    }, function () {
    	$(this).removeClass("hover");
    })

});