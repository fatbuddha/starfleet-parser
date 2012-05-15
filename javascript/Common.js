function ToggleInfo(id) {
	document.getElementById(id).style.display == 'none' ? document.getElementById(id).style.display = 'table-row' : document.getElementById(id).style.display = 'none';
}

function LookAtEsp(id, player) {
	var http = getHTTPObject();
	http.open("GET", "Search.aspx?esp=" + id + "&player=" + player + "&c=" + new Date().getUTCSeconds(), true);
	http.onreadystatechange = function () {
		if (http.readyState == 4) {

		}
	}
	http.send(null);
}

function MarkInvalid(id, player) {
	var http = getHTTPObject();
	http.open("GET", "InvalidToggle.aspx?coord=" + id + "&player=" + player + "&c=" + new Date().getUTCSeconds(), true);
	http.onreadystatechange = function () {
		if (http.readyState == 4) {

		}
	}
	http.send(null);
}

function getHTTPObject() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) { }
	}
	return false;
}