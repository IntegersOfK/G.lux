(function() {
    var temperature = Object();
    var storedsettings = Object();
    
    temperature.color = "#FF9329";
    temperature.alpha = 0.3;
    temperature.starthour = "01";
    temperature.startminute = "00";
    temperature.endhour = "01";
    temperature.endminute = "00";  
    temperature.timerenabled = false; 
    temperature.iscustom = false;
    
    chrome.extension.sendRequest({greeting: "hello"}, function(response) {
        try{
            storedsettings = jQuery.parseJSON(response.farewell);     
        }catch(err)
        {
            storedsettings = temperature;
        }

        temperature.color =  storedsettings.color;
        temperature.alpha = storedsettings.alpha;
        temperature.starthour =  storedsettings.starthour;
        temperature.startminute = storedsettings.startminute;
        temperature.endhour =  storedsettings.endhour;
        temperature.endminute = storedsettings.endminute;
        temperature.timerenabled = storedsettings.timerenabled;
        temperature.iscustom = storedsettings.iscustom;

        if(temperature.timerenabled === true){
            var currentDate = new Date();
            var currentHour = currentDate.getHours();
            var currentMinute = currentDate.getMinutes();
            var timerstart = new Date();
            var timerend = new Date();
            
            timerstart.setHours(temperature.starthour);
            timerstart.setMinutes(temperature.startminute);
            timerend.setHours(temperature.endhour);
            timerend.setMinutes(temperature.endminute);
            
            if(timerstart > timerend){
                if((currentDate >= timerstart && currentHour <= 24) || (currentHour >= 1 && currentDate <= timerend )){
                    if((currentDate >= timerstart && currentMinute <= 60) || (currentMinute >= 0 && currentDate <= timerend )){
                        applycolor();  
                    }
                }
            }else{
                if(currentDate >= timerstart && currentDate <= timerend){
                    applycolor();
                }
            }

        }else{
            applycolor();
        }   
    });

    function applycolor() {              
        if (temperature.color == "Off") {
            return;
        }
        $('<div/>', {id: 'coverTemperature'}).appendTo(document.documentElement);
        $('#coverTemperature').css('background-color', temperature.color);
        $('#coverTemperature').fadeTo("fast", temperature.alpha);
    }
})();
