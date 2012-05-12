// ==UserScript==
// @name          OpenSource Galaxy Parser
// @description   Autoupload every galaxy screen you see. Userscript by Eljer with some edits by Matt Hirschfelt.
// @include       http://*stardriftempires.com/galaxy*
// @version       0.0.1
// ==/UserScript==


 if (/stardrift.+\/galaxy/i.test(document.location.href)) {
	var path_to_upload = "http://PATH_TO_FILE/sdetest/listener.php";
 var timedate = Math.round(+new Date()/1000);
 var playername;
 var string1="";
 var string2="";
 var vTRs=document.getElementById('planets').getElementsByTagName('tr');
 var galaxy=document.getElementById('galaxy').getAttribute('value');
 var system=document.getElementById('solar_system').getAttribute('value');
 var y = "1";
 var z = "1";
 for (i=1;i<vTRs.length;i++) {
  var vPlayer=GetClassItem(vTRs[i],'td','player');
  if (vPlayer!=null) { 
   if (vPlayer.innerHTML.replace(/^\s+|\s+$/g, "").length>0) { 
    var slot=vTRs[i].getAttribute('id').substr(7);
    if(GetClassItem(vTRs[i],'td','name').getElementsByTagName('span').length==0) {
     var planetName=encodeURIComponent(GetClassItem(vTRs[i],'td','name').innerHTML.replace(/<[^<]*<[^>]*>/g,"").replace(/\n/g,"").replace(/^\s+|\s+$/g, "")).replace(/'/g,"''");
    } else {
     if(GetClassItem(vTRs[i],'td','name').getElementsByTagName('span')[0].getAttribute('class')=='activity') {
	  var planetName=encodeURIComponent(GetClassItem(vTRs[i],'td','name').innerHTML.replace(/<[^<]*<[^>]*>/g,"").replace(/\n/g,"").replace(/^\s+|\s+$/g, "")).replace(/'/g,"''");
     } else {
      var planetName=encodeURIComponent(GetClassItem(vTRs[i],'td','name').getElementsByTagName('span')[0].textContent.replace(/<[^<]*<[^>]*>/g,"").replace(/\n/g,"").replace(/^\s+|\s+$/g, "")).replace(/'/g,"''");
      if(GetClassItem(vTRs[i],'td','name').getElementsByTagName('span')[0].getElementsByTagName('img')[0]!=null) {
       if(/platform/i.test(GetClassItem(vTRs[i],'td','name').getElementsByTagName('span')[0].getElementsByTagName('img')[0].getAttribute('title'))) { slot+='h'; } }
     }
    }
	 if(GetClassItem(vTRs[i],'span','activity')!=null) {
	  var planetActivity=GetClassItem(vTRs[i],'span','activity').innerHTML;
	 } else {
	  var planetActivity="";
	 }
    if(vPlayer.getElementsByTagName('span').length==0){
     //npc
     if(/>\s+[^\x00]*?\S\s+</m.test(vPlayer.innerHTML)) {
      playername=encodeURIComponent(vPlayer.innerHTML.match(/>\s+[^\x00<]*?\S\s+</m)[0].replace(/>\s+([^\x00]*?\S)\s+</m,'$1').replace(/'/g,"''"));
     } else {
      if(/\s+[^\x00]*?\S\s+</m.test(vPlayer.innerHTML)) {
       //typical for npc here
       playername=encodeURIComponent(vPlayer.innerHTML.match(/\s+[^\x00<]*?\S\s+</m)[0].replace(/\s+([^\x00]*?\S)\s+</m,'$1').replace(/'/g,"''"));
      } else {
       playername=encodeURIComponent(vPlayer.innerHTML.replace(/\s+([^\x00]*?\S)\s+/m,'$1').replace(/'/g,"''"));
      }
     }
    } else {
     //get other players' info
     playername='';
     for(j=1;j<vPlayer.getElementsByTagName('a').length;j++) {
      if(/user_profile/i.test(vPlayer.getElementsByTagName('a')[j].getAttribute('href'))) {
       playername=encodeURIComponent(vPlayer.getElementsByTagName('a')[j].innerHTML.replace(/\s+([^\x00]*?\S)\s+/m,'$1').replace(/'/g,"''"));
       break;
      }
     }
     if(playername=='') {
      //self
      if(/eljercode/i.test(vPlayer.getElementsByTagName('a')[0].getAttribute('href'))) {
       if(/>\s+[^\x00]*?\S\s+</m.test(vPlayer.innerHTML)) {
        playername=encodeURIComponent(vPlayer.innerHTML.match(/>\s+[^\x00<]*?\S\s+</m)[0].replace(/>\s+([^\x00<]*?\S)\s+</m,'$1').replace(/'/g,"''"));
       } else {
        playername=encodeURIComponent(vPlayer.innerHTML.replace(/\s+([^\x00]*?\S)\s+/m,'$1').replace(/'/g,"''"));
       }
      } else {
       playername=encodeURIComponent(vPlayer.innerHTML.match(/>\s+[^\x00<]*?\S\s+</m)[0].replace(/>\s+([^\x00]*?\S)\s+</m,'$1').replace(/'/g,"''"));
      }
     }
    }
    if(vPlayer.getElementsByTagName('span').length>0) {
     var rank=vPlayer.getElementsByTagName('span')[vPlayer.getElementsByTagName('span').length-1].innerHTML.replace(/^\s+|\s+$/g, "").substr(1).replace(/,/g,'');  
    } else {
     var rank='';
    }
    var vStatus=GetClassItem(vTRs[i],'td','status');
    if(vStatus.innerHTML.replace(/^\s+|\s+$/g, "").length>0) {
     var statsymbol=GetClassItem(vStatus,'span','symbols').innerHTML.replace(/^\s+|\s+$/g, "");
    } else {
     var statsymbol='';
    }
    var vAlliance=GetClassItem(vTRs[i],'td','alliance');
    if (vAlliance.innerHTML.replace(/'/g,"''").replace(/^\s+|\s+$/g, "").length>0) {
     var alliance=encodeURIComponent(vAlliance.getElementsByTagName('a')[0].innerHTML.replace(/'/g,"''").replace(/^\s+|\s+$/g, ""));
    } else {
     var alliance=''; 
    }
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
	else {
    var planetName=GetClassItem(vTRs[i],'td','name').innerHTML.replace(/^\s+|\s+$/g, "");
    var slot=vTRs[i].getAttribute('id').substr(7);
    if (planetName=="Unavailable") { 
		if(string1.length < 1500){
			string1+="&v"+y+""+z+"="+slot+"&";
			z++;
			string1+="v"+y+""+z+"=&";
			z++;
			string1+="v"+y+""+z+"=&";
			z++;
			string1+="v"+y+""+z+"=&";
			z++;
			string1+="v"+y+""+z+"=&";
			z++;
			string1+="v"+y+""+z+"=&";
			z++;
			string1+="v"+y+""+z+"=";}
		else {
			string2+="&v"+y+""+z+"="+slot+"&";
			z++;
			string2+="v"+y+""+z+"=&";
			z++;
			string2+="v"+y+""+z+"=&";
			z++;
			string2+="v"+y+""+z+"=&";
			z++;
			string2+="v"+y+""+z+"=&";
			z++;
			string2+="v"+y+""+z+"=&";
			z++;
			string2+="v"+y+""+z+"=";}
	}
	}
  }
  y++;
  z="1";
 }

 if (string1.length>0) { string1=string1.substr(0,string1.length-1)+';'; }
 
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
  try {      req = new XMLHttpRequest();    } catch (e) {      req = false;    }
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
 } else {    alert('Sorry, your browser does not support XMLHTTPRequest objects.');  }
}
  

function GetClassItem(vSource,vTagname,vClass) {
 var vElements=vSource.getElementsByTagName(vTagname);
 var vReturn=null;
 for (cnt=0;cnt<vElements.length;cnt++) {
  if (vElements[cnt].getAttribute('class')==vClass) { vReturn=vElements[cnt]; } }
 return vReturn;}
 
function htmlDecode (input) {
 var entities= {"&amp;": "&","&lt;": "<","&gt;": ">"};
 for (var prop in entities) {
  if (entities.hasOwnProperty(prop)) {
   input = input.replace(new RegExp(prop, "g"), entities[prop]);  } }
 return input;}