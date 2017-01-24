
//listener:
//chrome.extension.onRequest.addListener(
//  function(request, sender, sendResponse) {
//	var favorite = localStorage["favorite_colour"];
//	if (!favorite) {
//		//could set the default color here?
//	}
//        
//    if (request.greeting === "getStoredColor"){
//      sendResponse({farewell: favorite});
//    }else if (request.greeting === "applyUpdatedColor"){
//    	//the popup.js has updated the fav color, so go ask the tab to apply it (otherwise the user will have to refresh)
//    	sendResponse({farewell: 'sending update to current tab'});
//    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//    		  chrome.tabs.sendMessage(tabs[0].id, {greeting: "update"}, function(response) {
//    		    console.log(response.farewell);
//    		  });
//    		});
//    	
//    }else{
//    	sendResponse({farewell: 'failed'}); // snub them.
//    }
//  });
//
//
