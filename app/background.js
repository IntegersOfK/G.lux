
function getDomain(url) { //sanitised a url into a standard domain
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

//listener:
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
	var favorite = localStorage["default_color"];
	if (!favorite) {
		//could set the default color here?
	}
        
    if (request.greeting === "getStoredColor"){
    	if (request.domain){
    		if (localStorage[getDomain(request.domain)]){
    			//alert(localStorage[getDomain(request.domain)]);
    			favorite = localStorage[getDomain(request.domain)];
    		}
    	}
      sendResponse({farewell: favorite});
    }
    
  });


