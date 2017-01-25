var temperature = Object();
var storedsettings = Object();

function applycolor() {
	if (temperature.color == "Off") {
		return;
	}
	
	//$('#coverTemperature').remove();
	if ($('#coverTemperature').length < 1) {
		$('body').append("<div id='coverTemperature'></div>");	
	}
	
	$('#coverTemperature').css('background-color', temperature.color);
	$('#coverTemperature').fadeTo(30, temperature.alpha);
}

function main() {
	//alert('run main');
	temperature.color = "#FF9329"; //default color
	temperature.alpha = 0.3;
	temperature.starthour = "01";
	temperature.startminute = "00";
	temperature.endhour = "01";
	temperature.endminute = "00";
	temperature.timerenabled = false;
	temperature.iscustom = false;
	//alert(document.domain);

	chrome.extension
			.sendRequest(
					{
						greeting : "getStoredColor",
						domain: document.domain
					},
					function(response) {
						try {
							storedsettings = jQuery
									.parseJSON(response.farewell);
						} catch (err) {
							storedsettings = temperature;
						}

						temperature.color = storedsettings.color;
						temperature.alpha = storedsettings.alpha;
						temperature.starthour = storedsettings.starthour;
						temperature.startminute = storedsettings.startminute;
						temperature.endhour = storedsettings.endhour;
						temperature.endminute = storedsettings.endminute;
						temperature.timerenabled = storedsettings.timerenabled;
						temperature.iscustom = storedsettings.iscustom;

						if (temperature.timerenabled === true) {
							var currentDate = new Date();
							var currentHour = currentDate.getHours();
							var currentMinute = currentDate.getMinutes();
							var timerstart = new Date();
							var timerend = new Date();

							timerstart.setHours(temperature.starthour);
							timerstart.setMinutes(temperature.startminute);
							timerend.setHours(temperature.endhour);
							timerend.setMinutes(temperature.endminute);

							if (timerstart > timerend) {
								if((currentDate >= timerstart && currentHour < 24) || (currentHour >= 0 && currentDate <= timerend )){ 
									if ((currentDate >= timerstart && currentMinute <= 60)
											|| (currentMinute >= 0 && currentDate <= timerend)) {
										applycolor();
									}
								}
							} else {
								if (currentDate >= timerstart && currentDate <= timerend) {
									applycolor();
								}
							}

						} else {
							applycolor();
						}
					});
}

(function() {

	main();

})();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.greeting == "update") {
		sendResponse({
			farewell : "updated tab"
		});
		main();
	} else if (request.greeting == "preview") {
		incoming = jQuery.parseJSON(request.color);
		temperature.color = incoming.color;
		temperature.alpha = incoming.alpha;
		applycolor();

	}

});
