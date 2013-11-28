// GoogleGo!
//
// A chrome plugin to translate google URL to its orginal URL.
// e.g. https://www.google.com.hk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CDIQFjAA&url=https%3A%2F%2Fdeveloper.chrome.com%2Fextensions%2FwebRequest.html&ei=LZvFUOzRMoPiiAKtlYBA&usg=AFQjCNFLwbg3Ydbm7KOPy8VsH7l5jCNWOg&sig2=eo60MGO4BwkDkUakJ5NHBg
// to https://developer.chrome.com/extensions/webRequest.html
// This plugin is for Mainland of China!
//
// v1.1: added function to redirect to Baidu if google can't work
//

// Created by James Tan on 12/10/2012.
// Updated by James Tan on 1/22/2013
//
function interceptRequest(request) {
	var reg = /(.*&){0,}url=([^&]+)&ei=(.*)/i;
	var urlRaw = reg.exec(request.url)[2];
	var url = decodeURIComponent(urlRaw);
    return { redirectUrl: url}
}

function redirectToBaidu(details) {
	if (details.frameId != 0) { //ignore subframes. 0 is main frame
		return; 
	}
	
	var reg = /[?|&]q=([^&]+)&/i;
	var keyword = reg.exec(details.url)[1];

	alert('Can\'t google, redirecting to Baidu now...');
	chrome.tabs.update(details.tabId, {url: "http://www.baidu.com/s?wd=" + keyword});
	
}

// Translate google URL
chrome.webRequest.onBeforeRequest.addListener(interceptRequest, { urls: ['*://*.google.com/url*', '*://*.google.com.hk/url*'] }, ['blocking']);
// Redirect to Baidu if can't google
chrome.webRequest.onErrorOccurred.addListener(redirectToBaidu, { urls: ['*://*.google.com/search*', '*://*.google.com.hk/search*'] });