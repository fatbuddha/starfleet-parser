// ==UserScript==
// @name          OpenSource Galaxy Parser
// @description   Autoupload every galaxy screen you see. Thanks to Lytjohan and Eljer for letting me base this off their userscripts.
// @include       http://*stardriftempires.com/galaxy*
// @include       http://*playstarfleet.com/galaxy*
// @include       http://*playstarfleetextreme.com/galaxy*
// @version       0.0.1
// ==/UserScript==

//SET UPLOAD PATH BASED ON GAME!
if (/stardrift.+\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var active=1;
}

if (/http:\/\/playstarfleet\.com\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var active=1;
}

if (/http:\/\/uni2\.playstarfleet\.com\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var active=1;
}

if (/http:\/\/playstarfleetextreme\.com\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var active=1;
}

if (/http:\/\/uni2\.playstarfleetextreme\.com\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_UPLOAD/listener.php";
	var active=1;
}

if (active=1) {
	//SET COUNTERS FOR PARAMATERS PURPOSES AND STRING TO APPEND TO
	var y = "1";
	var z = "1";
	var string1="";
	var string2="";
	
	//SET TIME IN UNIX FORMAT
	var timedate = Math.round(+new Date()/1000);
	
	//SET GALAXY AND SYSTEM SO WE KNOW WHERE WE ARE
	var galaxy=document.getElementById('galaxy').getAttribute('value');
	var system=document.getElementById('solar_system').getAttribute('value');
	
	//SET THE TABLE ROWS WE'RE GOING TO TRANSVERSE
	var vTRs=document.getElementById('planets').getElementsByTagName('tr');
	
	//LET'S LOOP THROUGH THE TABLE
	for (i=1;i<vTRs.length;i++) {
	
		//WAS THERE A PLAYER OR NPC IN THE SLOT? IF NO, SKIP IT!
		var vPlayer=GetClassItem(vTRs[i],'td','player');
		if (vPlayer!=null) {
		if (vPlayer.innerHTML.replace(/^\s+|\s+$/g, "").length>0) { 
						
			//WHAT SLOT ARE WE IN?
			var slot=vTRs[i].getAttribute('id').substr(7);
			
			//IS IT A HEPH?
			if (GetClassItem(vTRs[i],'td','name').getElementsByTagName('img')[0] != null) {
				slot+='h'; 
			}
						
			//WHAT IS THE PLANET NAME?
			var planetName = encodeURIComponent(GetClassItem(vTRs[i],'td','name').textContent.replace(/\((\*|\d{1,2} min)\)/g, "").replace("[ Rename ]", "").trim());
		 			
			//WAS THERE ACTIVITY ON THE PLANET?
			var planetActivity = "";
			if (GetClassItem(vTRs[i],'span','activity')!=null) {
				planetActivity=GetClassItem(vTRs[i],'span','activity').innerHTML;
			}
			
			//WHAT IS THE PLAYER NAME?
			var playername = encodeURIComponent(vPlayer.textContent.replace(/\([viInNd!s]*\)/g, "").replace(/#[\d,]*/g, "").trim());
			
			//WHAT IS THE PLAYER RANK?
			var rank='';
			if(vPlayer.getElementsByTagName('span').length>0) {
				var rank=vPlayer.getElementsByTagName('span')[vPlayer.getElementsByTagName('span').length-1].innerHTML.replace(/^\s+|\s+$/g, "").substr(1).replace(/,/g,'');  
			}
			
			//WHAT IS THE PLAYER STATUS?
			var statsymbol='';
			var vStatus=GetClassItem(vTRs[i],'td','status');
			if(vStatus.getElementsByClassName("symbols").length > 0) {
				var statsymbol=vStatus.getElementsByClassName("symbols")[0].textContent;;
			}
			
			//IS THE PLAYER IN AN ALLIANCE? IF SO, WHICH ONE?
			var alliance='';
			var vAlliance=GetClassItem(vTRs[i],'td','alliance');
			var alliance=vAlliance.textContent.trim();
			
			//BUILD THE URL STRING AND SPLIT IF TOO LONG
			if(string1.length < 1500){
			string1+="&v"+y+""+z+"="+slot+"&";
			z++;
			string1+="v"+y+""+z+"="+htmlDecode(playername)+"&";
			z++;
			string1+="v"+y+""+z+"="+statsymbol+"&";
			z++;
			string1+="v"+y+""+z+"="+htmlDecode(alliance)+"&";
			z++;
			string1+="v"+y+""+z+"="+rank+"&";
			z++;
			string1+="v"+y+""+z+"="+htmlDecode(planetName)+"&";
			z++;
			string1+="v"+y+""+z+"="+planetActivity;
			} 
			else {
			string2+="&v"+y+""+z+"="+slot+"&";
			z++;
			string2+="v"+y+""+z+"="+htmlDecode(playername)+"&";
			z++;
			string2+="v"+y+""+z+"="+statsymbol+"&";
			z++;
			string2+="v"+y+""+z+"="+htmlDecode(alliance)+"&";
			z++;
			string2+="v"+y+""+z+"="+rank+"&";
			z++;
			string2+="v"+y+""+z+"="+htmlDecode(planetName)+"&";
			z++;
			string2+="v"+y+""+z+"="+planetActivity;
			}
		} 
	}
	//INCREASE AND RESET VARIABLES FOR PARAMETERS
	y++;
	z="1";
	}
	
	//LET'S SUBMIT THOSE STRINGS!
	EmailWindowTimeout = 60000;			
	var urlstring1 = path_to_upload + "?d=1&g=" + galaxy + "&s=" + system + "&t=" +timedate + string1.replace(/,undefined/,"");
	var urlstring2 = path_to_upload + "?d=0&g=" + galaxy + "&s=" + system + "&t=" +timedate + string2.replace(/,undefined/,"");

	if(string1.length < 1500){
			console.log('uploaded: '+urlstring1);
	} else {
			console.log('uploaded: '+urlstring1);
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
		if(string1.length < 1500){
			req.open('GET', urlstring1, false);
		} else {
			req.open('GET', urlstring1, false);
			req.open('GET', urlstring2, false);
		}
		GetClassItem(document.getElementById('content'),'div','description').innerHTML+=' PARSED.';
		req.send();
	} else {    
		alert('Sorry, your browser does not support XMLHTTPRequest objects.');  
	}
}

//HELPER FUNCTIONS
function GetClassItem(vSource,vTagname,vClass) {
	var vElements=vSource.getElementsByTagName(vTagname);
	var vReturn=null;
	for (cnt=0;cnt<vElements.length;cnt++) {
		if (vElements[cnt].getAttribute('class')==vClass) { 
			vReturn=vElements[cnt]; 
		} 
	}
	return vReturn;
}
 
function htmlDecode (input) {
	var entities= {"&amp;": "&","&lt;": "<","&gt;": ">"};
	for (var prop in entities) {
		if (entities.hasOwnProperty(prop)) {
			input = input.replace(new RegExp(prop, "g"), entities[prop]);  
		} 
	}
	return input;
}