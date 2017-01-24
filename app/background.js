
listener:
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	var favorite = localStorage["favorite_colour"];
	if (!favorite) {
		//could set the default color here?
	}
        
    if (request.greeting === "getStoredColor"){
      sendResponse({farewell: favorite});
    }
    
  });


