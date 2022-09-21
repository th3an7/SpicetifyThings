var ip = "127.0.0.1";
var port = "1234";

window.addEventListener("load", init, false);
var socketisOpen = 0;
var intervalID = 0;

function init() {
    doConnect();
}

function sendCommand(data) {
    if (socketisOpen) {
        var receivedData = data;
        websocket.send(JSON.stringify(receivedData));
    } else {
        console.log(`NOT CONNECTED\n`);
    }
}

function showContent(id) {
    document.getElementById(id).style.visibility = "visible";
}

function hideContent(id) {
    document.getElementById(id).style.visibility = "hidden";
}

function changeElementContent(id, newContent) {
    document.getElementById(id).innerHTML = newContent;
}

/*function getBody(backgroundUrl) {
	document.getElementsByTagName("body")[0].background = backgroundUrl;
}*/

function isElementOverflowing(id) {
	var overflowX = document.getElementById(id).offsetWidth < document.getElementById(id).scrollWidth,
		overflowY = document.getElementById(id).offsetHeight < document.getElementById(id).scrollHeight;

	return (overflowX || overflowY);
}

function wrapContentsInMarquee(id) {
	var marquee = document.createElement('marquee'),
		contents = document.getElementById(id).innerText;

	marquee.innerText = contents;
	document.getElementById(id).innerHTML = '';
	document.getElementById(id).appendChild(marquee);
}

function doConnect() {
    websocket = new WebSocket("ws://" + ip + ":" + port + "/");
    websocket.onopen = function(evt) {
		onOpen(evt)
	};
	websocket.onclose = function(evt) {
		onClose(evt)
	};
	websocket.onmessage = function(evt) {
		onMessage(evt)
	};
	websocket.onerror = function(evt) {
		onError(evt)
	};
}

function onClose(evt) {
	socketisOpen = 0;
	if (!intervalID) {
		intervalID = setInterval(doConnect, 5000);
	}
}

function onOpen(evt) {
	socketisOpen = 1;
	clearInterval(intervalID);
	intervalID = 0;
}

function onMessage(evt) {
	if (evt.data == `State:true`){
        console.log("Show widget");
    }
    event(evt.data);
}

function onError(evt) {
	socketisOpen = 0;
	if (!intervalID) {
		intervalID = setInterval(doConnect, 5000);
	}
}

function doDisconnect() {
	socketisOpen = 0;
	websocket.close();
}