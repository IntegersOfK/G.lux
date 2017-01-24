var temperature = Object();
    
// Restores select box state to saved value from localStorage.
function restore_options() {
    try{
        temperature = jQuery.parseJSON(localStorage["favorite_colour"]);
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
            temperature.color =  $(this).attr("data-value");
        });
    });

    $("#slider").on("change", function(){ temperature.alpha = $("#trans").val()/100; });
    
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
    
    $("#saveBtn").on("click", function(){ save(); });
    
    $('.color-box').colpick({
	colorScheme:'dark',
	layout:'rgbhex',
	color:'ff8800',
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
                temperature.color = '#'+hex;
                temperature.iscustom = true;
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

// Saves options to localStorage.
function save() {
	localStorage["favorite_colour"] = JSON.stringify(temperature);
	// Get the active tab
	chrome.tabs.query({
		active : true,
		currentWindow : true
	}, function(tabs) {
		// If there is an active tab...
		if (tabs.length > 0) {
			// ...send a message requesting the DOM...
			console.log('sending to:' + tabs[0].id);
			chrome.tabs.sendMessage(tabs[0].id, {
				greeting : "update"
			}, function(response) {
				if (chrome.runtime.lastError) {
					// An error occurred :(
					console.log("ERROR: ", chrome.runtime.lastError);
				} else {
					console.log(response.farewell);
				}
			})
		}
	})
};

