// ==UserScript==
// @name          Open Parser
// @description   Autoupload every galaxy screen you see in any version of Starfleet Commander or Stardrift Empires!
// @include       http://*stardriftempires.com/galaxy*
// @include       http://*playstarfleet.com/galaxy*
// @include       http://*playstarfleetextreme.com/galaxy*
// @version       0.0.1
// ==/UserScript==
// Thanks to Lytjohan and Eljer for letting me base this off their userscripts and Rob for help me write some of the code!

//SET UPLOAD PATH BASED ON GAME!
if (/stardrift/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (/http:\/\/playstarfleet\.com/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (/http:\/\/uni2\.playstarfleet\.com/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (/http:\/\/playstarfleetextreme\.com/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (/http:\/\/uni2\.playstarfleetextreme\.com/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (/http:\/\/nova\.playstarfleetextreme\.com/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var search_path = "http://PATH_TO_SEARCH/search.php";
	var active=1;
}

if (active=1) {
	//SET COUNTERS FOR PARAMATERS PURPOSES AND STRING TO APPEND TO
	var y = "1";
	var string1="";
	var string2="";
	
	//WHAT IS OUR CURRENT PLANET SO WE CAN GET BACK HERE
	var activate_p = document.URL.match(/activate_planet=([0-9]*)/);
	var current_p = document.URL.match(/current_planet=([0-9]*)/);
	
	if (activate_p) {
		planet_id = activate_p[1];
	} else if (current_p) {
		planet_id = current_p[1];
	}
	
	//SET TIME IN UNIX FORMAT
	var timedate = Math.round(+new Date()/1000);
	
	//SET GALAXY AND SYSTEM SO WE KNOW WHERE WE ARE
	var galaxy=document.getElementById('galaxy').getAttribute('value');
	var system=document.getElementById('solar_system').getAttribute('value');
	
	//SET THE TABLE ROWS WE'RE GOING TO TRANSVERSE
	var vTRs=document.getElementById('planets').getElementsByTagName('tr');
	
	//LET'S LOOP THROUGH THE TABLE
	for (i=1;i<vTRs.length;i++) {
	
		//WAS THERE A PLAYER OR NPC IN THE SLOT? IF NO OR SELF, SKIP IT!
		var vRename=vTRs[i].querySelector(".name .rename");
		var vPlayer=vTRs[i].querySelector(".player");
		if (vPlayer!=null && vRename==null) {
		if (vPlayer.innerHTML.replace(/^\s+|\s+$/g, "").length>0) { 
						
			//WHAT SLOT ARE WE IN?
			var slot=vTRs[i].getAttribute('id').substr(7);
			
			//IS IT A HEPH?
			if (vTRs[i].querySelector(".name").getElementsByTagName('img')[0] != null) {
				slot+='h'; 
			}
						
			//WHAT IS THE PLANET NAME?
			if (vTRs[i].querySelector(".name .attackable, .name .not_attackable") !=null) {
				var planetNameEl = vTRs[i].querySelector(".name .attackable, .name .not_attackable");
				var planetName = planetNameEl.textContent.trim();
			} else {
				var planetNameEl = vTRs[i].querySelector(".name");
				var planetName = planetNameEl.textContent.trim();
			}
		 			
			//WAS THERE ACTIVITY ON THE PLANET?
			var planetActivity = "";
			if (vTRs[i].querySelector(".activity")!=null) {
				planetActivity=vTRs[i].querySelector(".activity").innerHTML;
			}
			
			//WHAT IS THE PLAYER NAME?
			var playername = vPlayer.textContent.replace(/\([pviInNd!s]*\)/g, "").replace(/#[\d,]*/g, "").trim();
			vTRs[i].querySelector(".player").innerHTML += "<a href='" + search_path + "?cp=" + planet_id + "&search=p&exact=true&query=" + escape(playername) + "' target='_blank'>O!</a>";
			
			//WHAT IS THE PLAYER RANK?
			var rank='';
			if(vPlayer.getElementsByTagName('span').length>0) {
				var rank=vPlayer.getElementsByTagName('span')[vPlayer.getElementsByTagName('span').length-1].innerHTML.replace(/^\s+|\s+$/g, "").substr(1).replace(/,/g,'');  
			}
			
			//WHAT IS THE PLAYER STATUS?
			var statsymbol='';
			if(vTRs[i].querySelector(".status .symbols")!=null) {
				var statsymbol=vTRs[i].querySelector(".symbols").textContent.trim();
			}
			
			//IS THE PLAYER IN AN ALLIANCE? IF SO, WHICH ONE?
			var alliance='';
			if(vTRs[i].querySelector(".alliance .attackable, .alliance .not_attackable")!=null) {
				var alliance=vTRs[i].querySelector(".alliance .attackable, .alliance .not_attackable").textContent.trim();
			}
			
			//BUILD THE URL STRING AND SPLIT IF TOO LONG
			var temp = [slot, playername, statsymbol, alliance, rank, planetName, planetActivity];
			for(var j=0; j<temp.length; ++j){
				temp[j] = "v"+y+""+j+"="+encodeURIComponent(temp[j]);
			}
			
			temp = temp.join("&");
						
			if(temp.length + string1.length < 1900) { //2000 is URL Limit. Set to 1900 to account for the base Path to Upload stuff and other params not included in string building.
				string1 += "&" + temp;
				} else {
				string2 += "&" + temp;
			}
		} 
	}
	//INCREASE VARIABLES FOR NEXT PARAMETERS
	y++;
	}
	
	//LET'S SUBMIT THOSE STRINGS!	
	if(string2.length == 0){
			var urlstring1 = path_to_upload + "?d=1&g=" + galaxy + "&s=" + system + "&t=" + timedate + string1.replace(/,undefined/,"");
			console.log('uploaded: '+urlstring1);
	} else {
			var urlstring1 = path_to_upload + "?d=1&g=" + galaxy + "&s=" + system + "&t=" + timedate + string1.replace(/,undefined/,"");
			console.log('uploaded: '+urlstring1);
			var urlstring2 = path_to_upload + "?d=0&g=" + galaxy + "&s=" + system + "&t=" + timedate + string2.replace(/,undefined/,"");
			console.log('uploaded: '+urlstring2);
	} 

	var req = false;
	if (window.XMLHttpRequest) {
		try {      
			req = new XMLHttpRequest();    
		} catch (e) {      
			req = false;    
		}
	} else {
		alert('no window.xmlhttprequest');
	}
 
	if (req) {
		if(string2.length === 0){
			req.open('GET', urlstring1, false);
		} else {
			req.open('GET', urlstring1, false);
			req.open('GET', urlstring2, false);
		}
		document.querySelector(".description").innerHTML+=' PARSED.';
		req.send();
	} else {    
		alert('Sorry, your browser does not support XMLHTTPRequest objects.');  
	}
}