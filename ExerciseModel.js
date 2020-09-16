/* 
*
* This File contains all those related to Controlling TV via JAPIT WIXP .
* This can be reused in as is or even modified freely.
*
*/

var url = "multicast://239.192.3.9:1234/0/0/0/VBR"
var buttonIsPressed = false;

function Exercise01ModelInit(){
	RegisterCallbacks();
}

/* assigning the callback function from the TV to another function*/
function RegisterCallbacks(){
	//alert("Enter RegisterCallbacks \n");
	JAPITWIXPPlugin.WebIXPOnReceive = WIXPResponseHandler;
	//alert("Exit RegisterCallbacks \n");
}

/* this function will call the required function depending on the response received from the TV */
function WIXPResponseHandler(WIXPResponseJSON){
	alert("Enter WIXPResponseHandler \n");
	try {
		parsedWIXPJSON = JSON.parse(WIXPResponseJSON);
		PrintLogsWIXPFromTV(parsedWIXPJSON);
		
		if (parsedWIXPJSON.Fun == "ProfessionalSettingsControl") {
			alert("ProfessionalSettingsControl !! \n");
			if (buttonIsPressed == true){
				SoC(url);
			} 
		} else {
			alert("Do nothing !! \n");
		}
	} catch(e) {
		alert(e);
		return e;
	}
	alert("Exit WIXPResponseHandler \n");
}

/* function to send commands to TV */
function sendWIxPCommand(command){
	alert("Enter sendWIxPCommand \n");
	try {
		var WIXPJSONStringForm = JSON.stringify(command);
		PrintLogsWIXPToTV(command);
		JAPITWIXPPlugin.WebIxpSend(WIXPJSONStringForm);
		alert("Exit sendWIxPCommand \n");
	}
	catch (e) {
		alert("Exit sendWIxPCommand: " + e + " \n");
	}
}

/* create some attributes of the WIXP object */
function CreateJAPITObjectForWIXPSvc(){
	this.Svc    = "WIXP";
	this.SvcVer = "4.0";
	this.Cookie = 222;
}

function switchOnChannel(){
	alert("Enter switchOnChannel \n");
	var JAPITObjForWIXPSvc = new CreateJAPITObjectForWIXPSvc();
	JAPITObjForWIXPSvc.Cookie = 1050;
	JAPITObjForWIXPSvc.CmdType = "Change";
	JAPITObjForWIXPSvc.Fun = "ProfessionalSettingsControl";
	JAPITObjForWIXPSvc.CommandDetails = {
		"SwitchOnChannel" : {
			"URL" : "multicast://239.192.3.7:1234/0/0/0/VBR"
		}
	}
	sendWIxPCommand(JAPITObjForWIXPSvc);
	delete JAPITObjForWIXPSvc;
}

function SoC(url){
	alert("Enter switchOnChannel with url\n");
	var JAPITObjForWIXPSvc = new CreateJAPITObjectForWIXPSvc();
	JAPITObjForWIXPSvc.Cookie = 1060;
	JAPITObjForWIXPSvc.CmdType = "Change";
	JAPITObjForWIXPSvc.Fun = "ProfessionalSettingsControl";
	JAPITObjForWIXPSvc.CommandDetails = {
		"SwitchOnChannel" : {
			"URL" : url
		}
	}
	sendWIxPCommand(JAPITObjForWIXPSvc);
	delete JAPITObjForWIXPSvc;
}

function switchOnSource(){

	alert("Entering switchOnSource !!");

	var JAPITObjForWIXPSvc = new CreateJAPITObjectForWIXPSvc();

	JAPITObjForWIXPSvc.Cookie = 1055,
	JAPITObjForWIXPSvc.CmdType = "Change";
	JAPITObjForWIXPSvc.Fun = "ProfessionalSettingsControl";
	JAPITObjForWIXPSvc.CommandDetails = {"SwitchOnSource" : "HDMI1"};
	sendWIxPCommand(JAPITObjForWIXPSvc);
	alert("Exiting switchOnSource !!");
}

function goToStby(){

	alert("Entering goToStby !!");

	var JAPITObjForWIXPSvc = new CreateJAPITObjectForWIXPSvc();
	JAPITObjForWIXPSvc.Cookie         = 1045;
	JAPITObjForWIXPSvc.CmdType        = "Change";
	JAPITObjForWIXPSvc.Fun            = "PowerState";
	JAPITObjForWIXPSvc.CommandDetails = {"ToPowerState" : "Standby"};
	sendWIxPCommand(JAPITObjForWIXPSvc);
	alert("Exiting goToStby !!");
}

function getProfessionalSettings(){
	var JAPITObjForWIXPSvc = new CreateJAPITObjectForWIXPSvc();
	JAPITObjForWIXPSvc.Cookie         = 1040;
	JAPITObjForWIXPSvc.CmdType        = "Request";
	JAPITObjForWIXPSvc.Fun            = "ProfessionalSettingsControl";
	JAPITObjForWIXPSvc.CommandDetails = {
		"ProfessionalSettingsParameters" :
			[
		"SwitchOnSource",
		"IdentificationSettings",
		"TVModel",
		"SerialNumber",
		"RoomID",
		"NetworkSettings",
		"NetworkStatus",
		"PrimaryAudioLanguage",
		"PrimarySubtitleLanguage",
		"VolumeLimits",
		"SystemUIURL"
			]
	};
	sendWIxPCommand(JAPITObjForWIXPSvc);
	delete JAPITObjForWIXPSvc;
}