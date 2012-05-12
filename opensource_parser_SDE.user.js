// ==UserScript==
// @name          OpenSource Galaxy Parser
// @description   Autoupload every galaxy screen you see. Userscript by Eljer with some edits by Matt Hirschfelt.
// @include       http://*stardriftempires.com/galaxy*
// @version       0.0.1
// ==/UserScript==


if (document.location.href.match(/http:\/\/stardriftempires\.com\/galaxy|http:\/\/fb\.stardriftempires\.com\/galaxy|http:\/\/apps\.facebook\.com\/stardrift_empires\/galaxy/i)!=null) {
	var path_to_upload = "http://ENTER_PATH_TO_UPLOAD/listener.php";
 var timedate = Math.round(+new Date()/1000);
 var playername;
 var string1="";
 var vTRs=document.getElementById('planets').getElementsByTagName('tr');
 var galaxy=document.getElementById('galaxy').getAttribute('value');
 var system=document.getElementById('solar_system').getAttribute('value');
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
    string1+="('"+galaxy+"','"+system+"','"+slot+"','"+htmlDecode(playername)+"','"+statsymbol+"','"+htmlDecode(alliance)+"','"+timedate+"','"+rank+"','"+htmlDecode(planetName)+"','"+planetActivity+"'),";
   } else {
    var planetName=GetClassItem(vTRs[i],'td','name').innerHTML.replace(/^\s+|\s+$/g, "");
    var slot=vTRs[i].getAttribute('id').substr(7);
    if (planetName=="Unavailable") { string1+="('"+galaxy+"','"+system+"','"+slot+"','Unavailable','','','"+timedate+"','','),"; }
   }
  }
 }

 if (string1.length>0) { string1=string1.substr(0,string1.length-1)+';'; }
 
 EmailWindowTimeout = 60000;
 var urlstring = path_to_upload + "?string=" + string1.replace(/,undefined/,";") + "&galaxy=" + galaxy + "&system=" + system +"";
 console.log('uploaded: '+urlstring);

 var req = false;
 if (window.XMLHttpRequest) {
  try {      req = new XMLHttpRequest();    } catch (e) {      req = false;    }
 } else {
  alert('no window.xmlhttprequest');
 }
 if (req) {
  req.open('GET', urlstring, false);
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