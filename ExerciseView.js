/* 
*
* This can be reused in as is or even modified freely.
*
*/


function Exercise01ViewInit()
{
	CreateHTMLElements();
}

function CreateHTMLElements()
{

}

function DisplayUpgradeControl(WIXPJsonResponse)
{
	IdMainFirmwareVersion.innerHTML = FWVesrion + WIXPJsonResponse.CommandDetails.UpgradeControlParameters[0]["CloneItemVersionNo"];
	IdTVSettingsVersion.innerHTML = TVSettingsVersion + WIXPJsonResponse.CommandDetails.UpgradeControlParameters[1]["CloneItemVersionNo"];
	IdTVChannelListVersion.innerHTML = TVChannelListVersion + WIXPJsonResponse.CommandDetails.UpgradeControlParameters[2]["CloneItemVersionNo"];	
}

function DisplayCurrentDateAndTime(WIXPJsonResponse)
{
	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
				
	if(WIXPJsonResponse)
	{
		var clockTime = WIXPJsonResponse.CommandDetails.ClockTime;
		var currentDate = WIXPJsonResponse.CommandDetails.CurrentDate;
	}
	else
	{
		var clockTime = "Unkown";
		var currentDate = "Unkown";
	}

	IdDateText.innerHTML = SysDate + currentDate;
	IdTimeText.innerHTML = SysTime + clockTime;
	IdLinuxDateTime.innerHTML = LinuxDateTime + datetime;
}

function ChangeNewSystemDateAndTime()
{
	
}
