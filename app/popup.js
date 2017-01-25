var temperature = Object();

//Restores select box state to saved value from localStorage.
function restore_options() {
	try{
		
		
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			// If there is an active tab...
			if (tabs.length > 0) {
				temperature = jQuery.parseJSON(localStorage["default_color"]);
				if (localStorage[getDomain(tabs[0].url)]){
					favorite = localStorage[getDomain(tabs[0].url)];
					temperature = jQuery.parseJSON(favorite);
					$('#clearSavedSite').show(0);
				}else{
					$('#clearSavedSite').hide(0); //hide the clear if there isn't an override color
				}
			}
		})

		
	}catch(err){
		temperature.color = "#FF9329";
		temperature.alpha = 0.3;
		temperature.starthour = "01";
		temperature.startminute = "00";
		temperature.endhour = "01";
		temperature.endminute = "00";  
		temperature.timerenabled = false; 
		temperature.iscustom = false;
	}

	$("#trans").val(temperature.alpha * 100);
	if(temperature.iscustom === true){
		$("#custom").css({"border-color": "#999999", 
			"border-width":"2px", 
			"border-style":"solid"});
		$("#custom").css("background-color", temperature.color);
	}else{
		$("*[data-value='" + temperature.color + "']").css({"border-color": "#999999", 
			"border-width":"2px", 
			"border-style":"solid"});
	}

	// Set the time
	$("#timer_starttime_hour").val(temperature.starthour);
	$("#timer_endtime_hour").val(temperature.endhour);
	$("#timer_starttime_minute").val(temperature.startminute);
	$('#timer_endtime_minute').val(temperature.endminute); 

	if(temperature.timerenabled === true ){
		$('#timer_enabled').prop('checked', true);
		$("#timer_startend").show();
	}else{
		$('#timer_enabled').prop('checked', false);
		$("#timer_startend").hide();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	populateTime();
	restore_options();

	$("span").each(function(){      
		$(this).on("click", function() {
			resetBorder();
			$(this).css({"border-color": "#999999", 
				"border-width":"3px", 
				"border-style":"solid"});
			if ($(this).attr('id') == "off"){
				temperature.alpha = 0;
				temperature.color = '#FFFFFF';
				$("#slider").hide(30);
				$("#automatic_timer").hide(30);
			}else{
				$("#slider").show(30);
				$("#automatic_timer").show(30);
				temperature.alpha = $("#trans").val()/100;
				temperature.color =  $(this).attr("data-value");
			}
			preview_color();
		});
	});

	$("#slider").on("change", function(){
		temperature.alpha = $("#trans").val()/100;
		preview_color();
	});

	// Only display the time if the automatic checkbox is checked
	$("#timer_enabled").change(function() {
		if(this.checked) {
			$("#timer_startend").show();
			temperature.timerenabled = true;
		}else{
			$("#timer_startend").hide();
			temperature.timerenabled = false;
		}
	});

	// Set the time
	$("#timer_starttime_hour").on('change', function() { temperature.starthour = this.value; });
	$("#timer_endtime_hour").on('change', function() { temperature.endhour = this.value; });
	$("#timer_starttime_minute").on('change', function() { temperature.startminute = this.value; });
	$("#timer_endtime_minute").on('change', function() { temperature.endminute = this.value; });

	$("#saveBtnDefault").on("click", function(){ save_default(); });
	$("#saveBtnSite").on("click", function(){ save_site(); });
	$("#clearSavedSite").on("click", function(){ delete_saved_site(); });
	
	

	$('.color-box').colpick({
		colorScheme:'dark',
		layout:'rgbhex',
		color:'ff8800',
		onSubmit:function(hsb,hex,rgb,el) {
			$(el).css('background-color', '#'+hex);
			$(el).colpickHide();
			temperature.color = '#'+hex;
			temperature.iscustom = true;
			preview_color();
		}
	})
	.css('background-color', temperature.color);

});

function populateTime(){
	for(i=1; i<25; i++){
		hour = (i < 10) ? ("" + 0 + i): i;
		$("#timer_starttime_hour").append('<option value="' + hour +'">' + hour + '</option>');
		$("#timer_endtime_hour").append('<option value="' + hour +'">' + hour + '</option>');
	}
	for(i=0; i<61; i++){
		minute = (i < 10) ? ("" + 0 + i): i;
		$("#timer_starttime_minute").append('<option value="' + minute +'">' + minute + '</option>');
		$("#timer_endtime_minute").append('<option value="' + minute +'">' + minute + '</option>');
	}
}
function resetBorder(){
	$("span").each(function(){      
		$(this).css("border","none");
	});
	$("#white, #off").css({"border-color": "#00000", 
		"border-width":"1px", 
		"border-style":"solid"});
}

//prompts tabs to update 
function update(all){
	if (all){ //for all tabs
		chrome.tabs.query({
			//active : true,
			//currentWindow : true
		}, function(tabs) {
			// If there is an active tab...
			if (tabs.length > 0) {
				for (var i=0; i<tabs.length; ++i) {
					console.log('sending to:' + tabs[i].id);
					chrome.tabs.sendMessage(tabs[i].id, {
						greeting : "update"
					}, function(response) {
						if (chrome.runtime.lastError) {
							// An error occurred :(
							console.log("ERROR: ", chrome.runtime.lastError);
						} else {
							//console.log(response.farewell);
							//window.close();
						}
					})
				}

			}
		})
	}else{ //just this tab needs to update
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			// If there is an active tab...
			if (tabs.length > 0) {
				console.log('sending to:' + tabs[0].id);
				chrome.tabs.sendMessage(tabs[0].id, {
					greeting : "update"
				}, function(response) {
					if (chrome.runtime.lastError) {
						// An error occurred :(
						console.log("ERROR: ", chrome.runtime.lastError);
					} else {
						//console.log(response.farewell);
						//window.close();
					}
				})

			}
		})
	}

}

//ask the content script to show the colour selected.
function preview_color(){
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		if (tabs.length > 0) {
			console.log('sending to:' + tabs[0].id);
			chrome.tabs.sendMessage(tabs[0].id, {
				greeting : "preview",
				color: JSON.stringify(temperature)
			}, function(response) {
				if (chrome.runtime.lastError) {
					// An error occurred :(
					console.log("ERROR: ", chrome.runtime.lastError);
				} else {
					//console.log(response.farewell);
				}
			})

		}
	})
}

//Saves options to localStorage for default
function save_default() {
	localStorage["default_color"] = JSON.stringify(temperature);
	update(true);
	window.close();
};

function getDomain(url) {
    var dom = "", v, step = 0;
    for(var i=0,l=url.length; i<l; i++) {
        v = url[i]; if(step == 0) {
            //First, skip 0 to 5 characters ending in ':' (ex: 'https://')
            if(i > 5) { i=-1; step=1; } else if(v == ':') { i+=2; step=1; }
        } else if(step == 1) {
            //Skip 0 or 4 characters 'www.'
            //(Note: Doesn't work with www.com, but that domain isn't claimed anyway.)
            if(v == 'w' && url[i+1] == 'w' && url[i+2] == 'w' && url[i+3] == '.') i+=4;
            dom+=url[i]; step=2;
        } else if(step == 2) {
            //Stop at subpages, queries, and hashes.
            if(v == '/' || v == '?' || v == '#') break; dom += v;
        }
    }
    return dom;
}

//Saves options to localStorage for this site only
function save_site() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		// If there is an active tab...
		if (tabs.length > 0) {
			fullurl = tabs[0].url;
			//alert(getDomain(fullurl));
			localStorage[getDomain(fullurl)]= JSON.stringify(temperature);
			update(true);
			window.close();
		}
	})
}

function delete_saved_site() {
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		// If there is an active tab...
		if (tabs.length > 0) {
			fullurl = tabs[0].url;
			//alert(getDomain(fullurl));
			localStorage.removeItem(getDomain(fullurl));
			$('#clearSavedSite').hide(0);
			update(true);
		}
	})
}

