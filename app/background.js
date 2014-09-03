
//listener:
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	var favorite = localStorage["favorite_colour"];
	if (!favorite) {
  	//should probably do something here?
	}
        
        if (request.greeting == "hello"){
          sendResponse({farewell: favorite});
        }else{
          sendResponse({}); // snub them.
        }
  });


