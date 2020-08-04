var channelsitem = new function() {

    this.name = "Channels"; // Class reference

    /*
     * add Keylistener to keyList
     */
    this.Focus = function() {
      addkeylistener(this);
    };

    /*
     * Remove Keylistener from keyList
     */
    this.RemoveFocus = function() {
      removekeylistener(this);
    };

    /*
     * Key Handler for ChannelBar
     * @param : keyevent
     */
    this.KeyHandler = function(e) {

      var keyStatus = keyAlive;

      switch (e.which || e.keyCode) {
        case 37: //LEFT
          if ($('.widget a.link.channels-prev.active').length == 1) {
            requestBack();
          }
          keyStatus = keyConsumed;
          break;

        case 39: //RIGHT
          if ($('.widget a.link.channels-prev.active').length == 1) {
            requestNext();
          }
          keyStatus = keyConsumed;
          break;

        case 38: //UP
          keyStatus = keyAlive;
          break;

        case 40: //DOWN
          keyStatus = keyAlive;
          break;

        case 13: // OK
          if ($('.widget a.link.channels-prev.active').length == 1) {
            if ( (tunedSource == "MainTuner") && (currentChlNum == channelList[currentIndex].ChannelNo) ) {
              leaveSmartInfo();
            } else {
              objectActionKey.isKeyAction = "tuningchannelAndExit";            
              channel_selection();
            };          
          }
          keyStatus = keyConsumed;
          break;

        default:
          break;

      } //END OF SWITCH

      return keyStatus;

    }; //END OF KEYHANDLER

  } //END OF CLASS

//////////////////////////////// CHANNEL BAR FUNCTIONS ////////////////////////////////

var pfmode = "";
var itemWidth = 150;
var offset = 0;
var slidespeed = 200;
var currentIndex = 0;
var currentObj = {};
var border = 2;
var itemPadding = 20;
var isAnimating = false;
var chSelection = null;
var itemheight = 80;
var offsetTime = null;
var isNetConnected = false;
var linuxTime = null;
var systemTime = null;
var mRequestForClockControl = false;
var style = null;
var tunedSource = "";
var numberSearch = "";
var intervalId = null;
var IsVideoPresent = "";
var initTimeoutid;
var channelList = [];
var currentIndex = 0;
var currentChlNum = -1;
var channeltuning = false;
var chTimeout = null;
var mRequestForNumberOfChannels = false;
var mRequestForchannelListSearchDirection = "";
var tvbrowser = false;
var mRequestForSmartInfoSwitch = false;
var mRequestForSmartInfoApp = "";
var setCallTimeout;
var reSourceRequest = false;
var apkList = [];
var previousVidioPage ="";
var manualMute = "";
var mNumberOfChannels = 0;
var ActiveApp = false;
var TVPlatform = '';

/*
 * Build the Channel Bar list
 */
function channelsBuild() {
  //clearTimeout(initTimeoutid);
  if ($('.page-active .widget .wobj.channels-prev').length == 0) {
    return;
  };

  //Debug(" channelsBuild >> ");
  $.each(channelList, function(index, value) {
    if (value.ChannelNo == currentChlNum) {
      currentIndex = index;
      return;
    }
  });

  if ($('.page-active ul.channels-menu').length == 0) {
    return;
  };
  if (channelList.length == 0) {
    $('.page-active ul.channels-menu').html("<div class='channels-message'></div>");
    $('.page-active .channels-message').css("fontSize", "30px");
    $('.page-active .channels-message').css("position", "absolute");
    $('.page-active .channels-message').html("Channels are not available");
    $('.page-active .channels-message').css("left", ($('.page-active .channels-preview').width() - $('.page-active .channels-message').width()) / 2 + "px");
    $(".page-active ul.channels-menu").show();
    return;
  } else {
    //
  }
  var currentPageItem = $(".page-active .channel-style").first()[0];
  style = $(currentPageItem).attr("style");
  itemWidth = parseInt($(currentPageItem).css('width').replace("px", ""), 10);
  itemheight = parseInt($(currentPageItem).css('height').replace("px", ""), 10);
  border = parseInt($(currentPageItem).css('border-left-width').replace("px", ""), 10) * 2;
  itemPadding = parseInt($(currentPageItem).css('marginRight').replace("px", ""), 10);
  itemPadding += parseInt($(currentPageItem).css('padding-left').replace("px", ""), 10) * 2;

  if (isNaN(itemWidth)) {
    itemWidth = 150;
  }
  if (isNaN(border)) {
    border = 2;
  }
  if (isNaN(itemPadding)) {
    itemPadding = 30;
  }

  if ($('.page-active ul.channels-menu li.channel-item').length == 0) {
    $('.page-active ul.channels-menu').empty();
    $('.page-active ul.channels-menu').css('width', ((itemWidth + border + itemPadding) * channelList.length) + (itemPadding * 2));
    offset = $(".page-active ul.channels-menu").parent().width() / 2 - (itemWidth) / 2 - border;
    $('.page-active .channels-menu').css({ "margin-left": -1.0 * (((itemWidth + border + itemPadding) * currentIndex) - offset) + "px" });
    var chcolor = $(".page-active .channel-item").css('background-color');
    $.each(channelList, function(index, value) {
      $(".page-active ul.channels-menu").append('<li class="channel-item" style="' + style + '" ><div class="channel-number">' + value.ChannelNo + '</div><div class="channel-name">' + value.ChannelName + '</div></li>');
      var ui = $('.page-active ul.channels-menu li:eq(' + index + ')');
      $(ui).css('display', 'block');
      if (index == currentIndex) {
        $(ui).addClass("channel-item-active");
      };
      $(ui).on('click', function() {
        if (is_touch_device() == true) {
          goto($(this).index(), "", true);
        };
      });
    });
    $(".page-active ul.channels-menu .channel-item").css('background-color', chcolor);
  };
  $(".page-active ul.channels-menu").show();
};

/*
 * Just Jump to Channel item
 * @param : item index, animation, setcall to TV
 */
function goto(index, isAnimatingOrNot, isChannelTune) {

  if (isAnimating) return;

  if (index >= 0 && index < channelList.length) {

    if($(".page-active .channel-item-active").index() != currentIndex) {

      currentIndex = index;
      currentObj = channelList[index];
      var nextPos = -1.0 * (((itemWidth + border + itemPadding) * currentIndex) - offset);
      isAnimating = false;
      if (isAnimatingOrNot == "noAni") {
        $('.page-active .channels-menu').css({
          "margin-left": nextPos + "px"
        });
      } else {
        if($('.page-active .channels-menu').length > 0) {
          isAnimating = true;
          $('.page-active .channels-menu').animate({
            'margin-left': +nextPos + "px"
          }, slidespeed, function() {
            isAnimating = false;
          });
          setTimeout(function() {
            isAnimating = false;
          }, 2000);
        }
      }

      $(".page-active li.channel-item").removeClass("channel-item-active");
      var chk = $(".page-active li.channel-item").get(currentIndex);
      $(chk).addClass("channel-item-active");

    };

    if (isChannelTune == true && channeltuning == false) {
      clearTimeout(chSelection);
      chSelection = window.setTimeout(channel_selection, (2 * 1000), channelList[currentIndex].ChannelNo);
    };

  } // END IF

}; // END GOTO

/*
 * go to Next Channel item Navigation
 */
function goNext() {
  goto(currentIndex + 1, "", true);
};

/*
 * go to Previous Channel item Navigation
 */
function goPrevious() {
  goto(currentIndex - 1, "", true);
};

/*
 * tuned Source OR Broadcast
 */
function setBroadcastOrExt() {   
  clearTimeout(setCallTimeout);
  Debug("enter broadcast tunedSource > "+ tunedSource);
  if($('.page-active .widget .video-object .broadcast-object #vidObject').length == 0) {
    $('.page-active .widget .video-object .broadcast-object').html('<object id="vidObject" style="width: 100%; height: 100%;" type="video/broadcast"> </object>');
  };

  IsVideoPresent = "";

  if(tunedSource == "None") {
    if(channelList.length > 0) {      
      try {
        vidObject.bindToCurrentChannel();
        console.log("vidObject.bindToCurrentChannel()");
      } catch (e) {
        //
      };
      
      reSourceRequest = true;
      requestToSource();
      setCallTimeout = window.setTimeout(function() {
        if(reSourceRequest == true){
          reSourceRequest = false;        
          if ( (tunedSource == "None") || (tunedSource == "MainTuner") || (tunedSource == "") ){
            channel_selection();
          } else {
            switchToSource(tunedSource);
          };                
        };
      }, 4000);
    };
  } else if (tunedSource == "MainTuner") {
      channel_selection();
  } else if ( (tunedSource != "") && (tunedSource != "MainTuner") ) {
      switchToSource(tunedSource);  
  };

};

/*
 * Search broadcast Object & Start
 */
function broadcastVideoStart(pageid) {
  clearTimeout(setCallTimeout);
  if ($('.menu-page-'+pageid+' .widget .video-object .broadcast-object').length == 1) {       
    //getAudioControl();        
    window.setTimeout(function() {               
      setBroadcastOrExt();       
    }, 500);
  }else{
    //if( $('.menu-page-'+previousPageId+' .widget .video-object .broadcast-object').length > 0 || previousPageId == 0 ){      
      if($(".menu-page-" + pageid + " .video-object .video-playback-widget").find('video').length == 0  && $(".menu-page-" + pageid + " .playlist-wrapper .playlist-preview-widget video").length == 0 ){
        if ($("body").hasClass("page-website-view")) {
          $('#digitalvideo').html("<video class=\"dvideo\" width=\"1\" height=\"1\" autoplay> <source src=\"sites/all/modules/tpvision/view_website/dvideo.mp4\" type=\"video/mp4\"> <source src=\"sites/all/modules/tpvision/view_website/dvideo.mp4\" type=\"video/ogg\"> </video>"); 
          //$('#digitalvideo .dvideo').load();
          //$('#digitalvideo .dvideo').currentTime = 0;
          //$('#digitalvideo .dvideo').trigger('play');
	        window.setTimeout(function() {            
	  	      $('#digitalvideo .dvideo').trigger('pause');
      	  }, 1000);
        }
      };
   //};
  }
  
  if($(".page-active .widget .channels-preview").length > 0){    
    if(channelList.length > 0){           
      goto(currentIndex, "noAni", false);
    };
  };
  
  previousPageId = pageid;
  if($('.page-active .gadget-object').length > 0) {
    changegadgethtmlobject();
  };  
}

function stoppingTheDummyVideo(){
		//  console.log(" Video : coooming to function");
	    window.setTimeout(function() {
		    console.log(" Video : playing vudei");
		    $('#digitalvideo .dvideo').trigger('pause');
        $('#digitalvideo').html('');
    	}, 1000);
}

/*
 * Digit Entry From Remote keys
 * @param : key code
 */
function NumericEntry(key) {
  Debug("NumericEntry > "+key);
  if(key == 0 && debugEnable == true){
    Debug("", true);
  };

  if ( (objectActionKey.isNumericEntryEnable == false) || (objectActionKey.isNumericEntryEnable == "0") ) {
    return keyAlive;
  };

  if ((key >= 0) & (key <= 9) && numberSearch.length < 4 && channelList.length > 0 && parseInt(numberSearch+"0", 10) < 3000) {
    numberSearch = numberSearch+""+key;
    objectActionKey.isKeyAction = "";
   
    SetTime(function() {
      var nextChannel = -1;
      var num = parseInt(numberSearch, 10);           
      for (var val = 0; val < channelList.length; val++) {        
        if(channelList[val].ChannelNo == num){
          nextChannel = channelList[val].ChannelNo;
          break;
        }
      };
      if(nextChannel != -1){
        objectActionKey.isKeyAction = "tuningchannelAndExit";
        selectChannelFromTV(nextChannel);        
      } else {       
        $('#digitalentry').html("");        
        $('#digitalentry').hide();
      };
      numberSearch = "";
    });

    $('#digitalentry').html(numberSearch);
    $('#digitalentry').show();

  }; //END IF
  return keyConsumed;
}; //END NumericEntry

/*
 * Timer for 2sec delay
 */
function SetTime(callback) {
  clearTimeout(intervalId);
  intervalId = setTimeout(function() {
    clearTimeout(intervalId);
    callback();
  }, 2000);
};

/*
 * dynamic channel List Building
 */
function channelInit() {

  mRequestForSmartInfoSwitch = false; 
  ActiveApp = true;
 
  initClockControl(); 

  $.each(tvVariables, function(idx, obj) {
    getProfessionalSettingsControl(obj.name);
  });

  requestChannelSelection();  
  requestToSource();
  requestChannelLength();
  requestAllApplication(["Native", "NonNative"]);
  //setVirtualKeyForward();
  //getAudioControl(); 

  /*
   * Build Channel List on Browser
   */
  var timeout = window.setTimeout(function() {
    clearTimeout(timeout);
    if (!tvbrowser && os == 'windows') {
      channelList = [{
        ChannelNo: 0,
        ChannelName: "channel-1"
      }, {
        ChannelNo: 1,
        ChannelName: "channel-2"
      }, {
        ChannelNo: 2,
        ChannelName: "channel-3"
      }, {
        ChannelNo: 3,
        ChannelName: "channel-4"
      }, {
        ChannelNo: 4,
        ChannelName: "channel-5"
      }, {
        ChannelNo: 5,
        ChannelName: "channel-6"
      }, {
        ChannelNo: 6,
        ChannelName: "channel-7"
      }, {
        ChannelNo: 7,
        ChannelName: "channel-8"
      }, {
        ChannelNo: 8,
        ChannelName: "channel-9"
      }, {
        ChannelNo: 9,
        ChannelName: "channel-10"
      }, {
        ChannelNo: 10,
        ChannelName: "channel-11"
      }, {
        ChannelNo: 11,
        ChannelName: "channel-12"
      }, {
        ChannelNo: 12,
        ChannelName: "channel-13"
      }, {
        ChannelNo: 13,
        ChannelName: "channel-14"
      }, {
        ChannelNo: 14,
        ChannelName: "channel-15"
      }, {
        ChannelNo: 15,
        ChannelName: "channel-16"
      }];
      currentIndex = 0;
      currentChlNum = 5;      
      reorderChannelList();
    }
  }, 5000);

};

/*
 * trigger Functions
 */
function triggerFunction(){
  
  var counts = 0;
  for (var key in tvCommands) {    
    if(tvCommands[key].isSuccess == ""){
      counts++;
    };
  }; 

  if(counts != 0){
 
    clearTimeout(cmdInterval);
    cmdInterval = setInterval(function() {
      counts = 0;      
      for (var key in tvCommands) {           
        if(tvCommands[key].isSuccess == ""){  
          counts++;      
          eval(tvCommands[key].fun)();
        };
      };      
      if(counts == 0){
        clearTimeout(cmdInterval);
      };

    }, 7000);

  };

};


/*
 * Get Current Channel-item index From channelList
 */
function getChannelIndex() {
  var index = 0;
  if (currentChlNum != -1) {
    for (var i = 0; i < channelList.length; i++) {
      if (channelList[i].ChannelNo == currentChlNum) {
        index = i;
        break;
      }
    }
  }
  return index;
};

/*
 * Requestig Next Channel-item from the channelList
 */
function requestNext() {
  if (channelList.length == 0 || channeltuning == true) return;
  if (currentIndex >= channelList.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex++;
  }
  goto(currentIndex, "", true);
};

/*
 * Requestig Previous Channel-item from the channelList
 */
function requestBack() {
  if (channelList.length == 0 || channeltuning == true) return;
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = channelList.length - 1;
  }
  goto(currentIndex, "", true);
};

//////////////////////////////// TV FUNCTION ////////////////////////////////

var svc = "WIXP";
var svcVer = "1.0";
var filters = ["ALL"]; //ALL, FreePackage

var wixp = wixp || new Object();
wixp.CMD_TYPE_REPORT = "Response";
wixp.CMD_TYPE_CHANGE = "Change";
wixp.CMD_REQUEST = "Request";
wixp.FUN_CHANNELLIST = "ChannelList";
wixp.FUN_CHANNELSELECTION = "ChannelSelection";
wixp.FUN_CLOCKCONTROL = "ClockControl";
wixp.FUN_PROFESSIONALSETTINGSCONTROL = "ProfessionalSettingsControl";
wixp.FUN_SOURCE = "Source";
wixp.FUN_APPLICATIONCONTROL = "ApplicationControl";
wixp.FUN_AUDIOCONTROL = "AudioControl";
wixp.FUN_USERINPUTCONTROL = "UserInputControl";

var tvVariables = [{"name" : "TVModel", "pro" : ""}, {"name": "RoomID", "pro": ""}]; // Array for TV Variales like roomid etc..

var cmdInterval;
var tvCommands = {};
tvCommands[wixp.FUN_CHANNELSELECTION] = {"fun":requestChannelSelection, "isSuccess":""};
tvCommands[wixp.FUN_CHANNELLIST] = {"fun":requestChannelLength, "isSuccess":""};

/*
 * return Object
 */
function baseWIXPobject() {
  this.Svc = "WIXP";
  if(isOldPlatform == true) {
    this.SvcVer = "1.0";
  } else {
    this.SvcVer = "3.0";
  };  
};

/*
 * Setcall to TV for channel selection
 * @param : Channel number
 */
function channel_selection(channelNo) {
  if(channelList.length > 0) {
    clearTimeout(chSelection);
    if (channelNo == undefined) {
      currentObj = channelList[currentIndex];
      channelNo = channelList[currentIndex].ChannelNo;
    };
    //Debug(" channelNo > " + channelNo);
    selectChannelFromTV(channelNo);
  };
};

/*
 * Get System Timer
 * @param : return to function callback
 */
function ClockControl(fn) {
  var da = null;
  if (offsetTime == null) {
    mRequestForClockControl = false;
    requestClockControl();
  }
  if (tvbrowser == false && offsetTime == null) {
    da = new Date();
  } else {
    da = new Date(Date.now() + offsetTime);
  }
  if (fn && typeof(fn) === "function") {
    fn(da);
  } else {
    return da;
  }
};

/*
 * just Init function to Get System Timer
 */
function initClockControl() {
  /*
 $.ajax({
  url: 'http://www.google.com',
  success: function(data) {
   isNetConnected = true;
  },
  error: function(data) {
   isNetConnected = false;
  }
 });
 */
  mRequestForClockControl = false;
  requestClockControl();
};

/*
 * Get TV Date & Time
 */
function requestClockControl() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.SvcVer = "0.1";
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_CLOCKCONTROL;
  wixpcmd.CommandDetails = {
    "ClockControlParameters": ["ClockTime", "CurrentDate", "RefDate", "RefTime"]
  };
  send2Tv(wixpcmd);
};

/*
 * Get TV Professional Settings
 * @param : Settings
 */
function getProfessionalSettingsControl(app) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299,
    wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_PROFESSIONALSETTINGSCONTROL;
  wixpcmd.CommandDetails = {
    "ProfessionalSettingsParameters": [app]
  };
  send2Queue(wixpcmd);
};

/*
 * Get TV Source
 */
function requestToSource() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_SOURCE;
  send2Queue(wixpcmd);
};

/*
 * Change TV Source
 * @param : source
 */
function switchToSource(source) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_SOURCE;
  wixpcmd.CommandDetails = {
    "TuneToSource": source
  };

  dummyBroadcast(wixpcmd);

};

/*
 * Adding dummy Broadcast object
 * @param : command object
 */
function dummyBroadcast(wixpcmd) {

  if((pfmode == "fmode") || (objectActionKey.isKeyAction == "tuningchannelAndExit")) {    
    send2Queue(wixpcmd);
    window.setTimeout(function() {           
      leaveSmartInfo();
    }, 100);    
  } else if ($('.menu-page-'+previousPageId+' .widget .video-object .broadcast-object').length > 0) {    
    send2Queue(wixpcmd);
    try {
      vidObject.bindToCurrentChannel();
      console.log("vidObject.bindToCurrentChannel()");
    } catch (e) {
      //
    };  
  } else {            
    $('#dummybroadcast').html('<object id="vidObject" style="width:100%; height:100%;" type="video/broadcast"> </object>');
    try {
      vidObject.bindToCurrentChannel();
      console.log("vidObject.bindToCurrentChannel()");
    } catch (e) {
      //
    };    
    window.setTimeout(function() {      
      send2Queue(wixpcmd);
    }, 500);
  };

}

/*
 * Change TV Application
 * @param : Application name, true || flase
 */
function switchToApplication(app, state, type) {
  if (state == undefined || state == null) {
    state = "Activate";
  }
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_APPLICATIONCONTROL; 

  if(type == 'apk') {

    var cmd = "";

    Debug("apkList length > " + apkList.length);

    if(apkList.length > 0) {

      for(var k=0; k<apkList.length; k++){
        if(apkList[k].ApplicationName.toLowerCase().indexOf(app.toLowerCase()) >= 0){
          Debug("ApplicationName > " + apkList[k].ApplicationName);
          cmd = {"ApplicationDetails": { "ApplicationName": apkList[k].ApplicationName, "ApplicationType": apkList[k].ApplicationType }, "ApplicationState": state };       
          break;         
        };
      };

      if(cmd == ""){
        cmd = {"ApplicationDetails": { "ApplicationName": app, "ApplicationType": "NonNative" }, "ApplicationState": state };
      }

      wixpcmd.CommandDetails = cmd;

    } else {
      wixpcmd.CommandDetails = {"ApplicationDetails": { "ApplicationName": app, "ApplicationType": "NonNative" }, "ApplicationState": state };
    };

  } else {
    wixpcmd.CommandDetails = {"ApplicationDetails": { "ApplicationName": app }, "ApplicationState": state };
  };

  send2Queue(wixpcmd);
};

/*
 * Get all Current Application 
 */
function requestApplicationControl() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_APPLICATIONCONTROL;  
  send2Queue(wixpcmd);
};

/*
 * Get Current Application
 * @param : ApplicationName
 */
function requestApplication(app) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_APPLICATIONCONTROL;
  wixpcmd.CommandDetails = {
    "ApplicationName": app
  };
  mRequestForSmartInfoApp = app;
  mRequestForSmartInfoSwitch = true;
  send2Queue(wixpcmd);
};

function requestAllApplication(filter) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_APPLICATIONCONTROL;
  wixpcmd.CommandDetails = { "RequestListOfAvailableApplications": { "Filter": filter } };
  send2Queue(wixpcmd);
}

/*
 * Change TV Application
 * @param : ApplicationName
 */
function changeApplication(app) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_APPLICATIONCONTROL;
  if ( (app == "Miracast" || app == "Directshare") && (isOldPlatform == true) ) {
    wixpcmd.CommandDetails = {
      "ApplicationDetails": {
        "ApplicationName": 'Internet',
        "ApplicationAttributes": {
          "WebsiteURL": 'http://www.google.com'
        }
      },
      "ApplicationState": "Activate"
    };
  } else {
    wixpcmd.CommandDetails = {
      "ApplicationDetails": {
        "ApplicationName": 'Internet',
        "ApplicationAttributes": {
          "WebsiteURL": 'http://www.google.com'
        }
      },
      "ApplicationState": "Activate"
    };
  }
  send2Queue(wixpcmd);
  leaveSmartInfo();
};

/*
 * Exit SmartCMS Page
 */
function leaveSmartInfo() {
  pfmode = "";
  objectActionKey.isKeyAction = "";
  ActiveApp = false;
  //Checking only for android monitor 5011
  /*if(TVPlatform == "android"){
    unGrabVirtualKeyForward();
  }*/
  setTimeout(function(){
    switchToApplication("SmartInfo", "Deactivate");
  }, 1000);

};

/*
 * Goto Particular Channel
 * @param : ChannelNumber
 */
function switchToChannel(num) {
  selectChannelFromTV(num);
};

/*
 * Get Current playing Channel
 */
function requestChannelSelection() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 1050;
  wixpcmd.CmdType = "Request";
  wixpcmd.Fun = wixp.FUN_CHANNELSELECTION;
  send2Queue(wixpcmd);
};

/*
 * Get total Channel Length
 */
function requestChannelLength() {
  //clearTimeout(initTimeoutid);
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 1050;
  wixpcmd.CmdType = "Request";
  wixpcmd.Fun = wixp.FUN_CHANNELLIST;
  wixpcmd.CommandDetails = {
    "ContentLevel": "NumberOfChannels",
    "Filter": filters
  };
  mRequestForNumberOfChannels = true;
  send2Queue(wixpcmd);
};

/*
 * Get All Channels
 * @param : NumberOfChannels
 */
function RequestChannelsFromTV(SearchDirection) {
  var tempChlNum = currentChlNum;
  if((tempChlNum == -1) || (tempChlNum == undefined)) {
    tempChlNum = 1;
  };
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 1050;
  wixpcmd.CmdType = "Request";
  wixpcmd.Fun = wixp.FUN_CHANNELLIST;
  wixpcmd.CommandDetails = {
    "ContentLevel": "BasicChannelDetails",
    "SearchDirection": SearchDirection,
    "SearchFromChannelNumber": tempChlNum,
    "Loop": "No",
    "NumberOfChannels": mNumberOfChannels,
    "Filter": filters
  };
  mRequestForchannelListSearchDirection = SearchDirection;
  send2Queue(wixpcmd);
};

/*
 * Set Channel to TV
 * @param : ChannelNumber
 */
function selectChannelFromTV(channelNum) {
  $('#digitalentry').html('');
  $('#digitalentry').hide(); 
  
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 1051;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_CHANNELSELECTION;
  wixpcmd.CommandDetails = {
    "ChannelTuningDetails": {
      "ChannelNumber": channelNum
    }
  };
  //send2Queue(wixpcmd);

  dummyBroadcast(wixpcmd);

};

/*
 * Get Current Audio Control
 * @param : ["Volume", "AudioMute"]
 */
function getAudioControl(mAudio) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_REQUEST;
  wixpcmd.Fun = wixp.FUN_AUDIOCONTROL;
  wixpcmd.CommandDetails = {"AudioControlParameters":["AudioMute"]};
  send2Queue(wixpcmd);
};

/*
 * Change TV Audio Control
 * @param : On, Off
 */
function setAudioControl(mAudioState) {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_AUDIOCONTROL;
  wixpcmd.CommandDetails = {"AudioMute": mAudioState};
  send2Queue(wixpcmd);  
};


/*
 * Change VK keys 
 */
function setVirtualKeyForward() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_USERINPUTCONTROL;

  wixpcmd.CommandDetails = {    
    "VirtualKeyForwardMode" : "SelectiveVirtualKeyForward",
    "VirtualKeyToBeForwarded" : [ {"Vkkey" : "HBBTV_VK_0"}, {"Vkkey" : "HBBTV_VK_1"}, {"Vkkey" : "HBBTV_VK_2"}, {"Vkkey" : "HBBTV_VK_3"}, {"Vkkey" : "HBBTV_VK_4"}, {"Vkkey" : "HBBTV_VK_5"}, {"Vkkey" : "HBBTV_VK_6"}, {"Vkkey" : "HBBTV_VK_7"}, {"Vkkey" : "HBBTV_VK_8"}, {"Vkkey" : "HBBTV_VK_9"}, {"Vkkey" : "HBBTV_VK_OPTIONS"}, {"Vkkey" : "HBBTV_VK_BACK"} ]
  };

  //wixpcmd.CommandDetails = {"VirtualKeyForwardMode" : "AllVirtualKeyForward"};
  
  send2Queue(wixpcmd);
      
};


/*
 * Change ungrab VK keys 
 */
function unGrabVirtualKeyForward() {
  var wixpcmd = new baseWIXPobject();
  wixpcmd.Cookie = 299;
  wixpcmd.CmdType = wixp.CMD_TYPE_CHANGE;
  wixpcmd.Fun = wixp.FUN_USERINPUTCONTROL;
  wixpcmd.CommandDetails = {    
    "VirtualKeyForwardMode" : "DontForwardAnyVirtualKey"    
  };  
  send2Queue(wixpcmd);      
};

/*
 * remove duplicates objects
 */
function remove_duplicates(objectsArray) {
  var usedObjects = {};
  for (var i=objectsArray.length - 1;i>=0;i--) {
    var so = JSON.stringify(objectsArray[i]);
    if (usedObjects[so]) {
      objectsArray.splice(i, 1);
    } else {
      usedObjects[so] = true;          
    }
  }
  return objectsArray;
};

/*
 * reorderChannelList
 */
function reorderChannelList() {
  if(channelList.length > 0 ) {    
    channelList = remove_duplicates(channelList);  
    tvCommands[wixp.FUN_CHANNELLIST].isSuccess = "successful"; 
    channelList.sort(function(a, b) {
      return parseFloat(a.ChannelNo) - parseFloat(b.ChannelNo);
    });      
    currentIndex = getChannelIndex();               
    channelsBuild();
    if ($('.page-active .widget .video-object .broadcast-object').length > 0) {
      Debug('IsVideoPresent >>> ' + IsVideoPresent);      
      setBroadcastOrExt();      
    };
  };
};

/*
 * Receive JSON Commond from TV
 * @param : JSON data from callback
 */
callbackDispatcher = function(data) {

  var dataToPass = JSON.parse(data);
  tvbrowser = true;
  responseDetails = dataToPass.CommandDetails;

  Debug('callbackDispatcher > ' + data);

  switch (dataToPass.Fun) {

    case "AudioLanguage":
      //Debug("AudioLanguage");
    break;

    case wixp.FUN_CHANNELLIST:
      var ChList = responseDetails.ChannelList;
      if (mRequestForNumberOfChannels == true) {
        mRequestForNumberOfChannels = false;        
        if ((ChList.length == 0) && (responseDetails.NumberOfChannels > 0)) {         
          mNumberOfChannels = responseDetails.NumberOfChannels;
          channelList = [];          
          RequestChannelsFromTV("PREVIOUS"); 
        } else {
          reorderChannelList();     
        }
      } else if (mRequestForchannelListSearchDirection == "PREVIOUS") {             
        channelList = channelList.concat(ChList);
        RequestChannelsFromTV("CURRENT");
      } else if (mRequestForchannelListSearchDirection == "CURRENT") {        
        channelList = channelList.concat(ChList);     
        RequestChannelsFromTV("NEXT");
      } else if (mRequestForchannelListSearchDirection == "NEXT") {       
        channelList = channelList.concat(ChList);     
        mRequestForchannelListSearchDirection = "";        
        reorderChannelList();                                                
      };
    break;

    case wixp.FUN_CHANNELSELECTION:
      var obj = responseDetails.ChannelTuningDetails;
      if ((obj.ChannelNumber != "undefined") && (obj.ChannelNumber != undefined)) {
        currentChlNum = obj.ChannelNumber;

        var selectionStatus = responseDetails.ChannelSelectionStatus.toLowerCase();

        if ( (selectionStatus == 'successful') || (selectionStatus == 'failure') ) {
          
          clearTimeout(chTimeout);
          channeltuning = false;
          IsVideoPresent = selectionStatus;

          if( objectActionKey.isKeyAction == "tuningchannelAndExit" ) {            
            leaveSmartInfo();
          };        
                    
          currentIndex = getChannelIndex();
          if(channelList.length > 0){           
            goto(currentIndex, "noAni", false);
          };
        } else {
          //
        }
        //Debug("currentIndex > " + currentIndex + " currentChlNum > " + currentChlNum);
      }
      break;

    case wixp.FUN_CLOCKCONTROL:
      linuxTime = new Date().getTime();
      if (!mRequestForClockControl) {
        mRequestForClockControl = true;
        var split = responseDetails.CurrentDate.split('/');
        var year = [split[1], split[0], split[2]].join('/');
        systemTime = new Date('' + year + ' ' + responseDetails.ClockTime + '').getTime();
        offsetTime = systemTime - linuxTime;
        //Debug("linuxTime " + linuxTime + " = " + new Date(linuxTime));
        //Debug("systemTime " + systemTime + " = " + new Date(systemTime) + " ==== " + year + ' ' + responseDetails.ClockTime);
        //Debug("offsetTime " + offsetTime);
        //Debug("Time " + new Date(linuxTime + offsetTime));
      }
      break;

    case wixp.FUN_PROFESSIONALSETTINGSCONTROL:
	
      if ( (responseDetails.RoomID != "undefined") && (responseDetails.RoomID != undefined) ) {
        $(".RoomID").html(responseDetails.RoomID);
      }
      if((responseDetails.TVModel != "undefined") && (responseDetails.TVModel != undefined) ) {
         var str = responseDetails.TVModel;
  	 var array = str.split("");
  	 if((str.substring(2,5) == "HFL") && ((array[7] == 0 && $.isNumeric(array[8])) || str.substring(7,9) == "10") && ($.isNumeric(array[0]) && $.isNumeric(array[1]) && $.isNumeric(array[5]) && $.isNumeric(array[6]))){
  	   TVPlatform = "2K14";
           isOldPlatform = true;
  	 } else {
           isOldPlatform = false;
           if(str.substring(5,9) == "3011") {
             TVPlatform = "2K16";
           } else {
             TVPlatform = "android";
           }
  	 };
         Debug("TVPlatform > " + TVPlatform);
         if(TVPlatform == "android"){
           document.addEventListener("OnKeyReceived", OnKeyReceivedHandler, false);
         //  setVirtualKeyForward();
         }
      }
      break;

    case wixp.FUN_APPLICATIONCONTROL:
      
      var appName = "";
     
      if(responseDetails.ActiveApplications != undefined && isOldPlatform == false) { 
        var ActiveAppList = responseDetails.ActiveApplications;
        Debug("wixp.FUN_APPLICATIONCONTROL > " + ActiveAppList[0].ApplicationName);
        if(ActiveAppList[0].ApplicationName == "SmartInfo"){         
          ActiveApp = true;            
        /*  if(TVPlatform == "android"){
             setVirtualKeyForward();
          }*/
        } else {
          ActiveApp = false;
        }
      } else if(responseDetails.ApplicationDetails != undefined) {
        if(isOldPlatform == true){
          appName = responseDetails.ApplicationDetails.ApplicationName;  
        }     
      } else if(responseDetails.CurrentAvailableApplicationList != undefined) {            
        apkList = responseDetails.CurrentAvailableApplicationList;  
      };

      if (mRequestForSmartInfoSwitch = true) {
        mRequestForSmartInfoSwitch = false;
        if (appName != "") {
          changeApplication(appName);
          mRequestForSmartInfoApp = "";
        }
      }
      Debug(" ActiveApp > " + ActiveApp + " appName " + appName);
      break;

    case wixp.FUN_SOURCE:
      tunedSource = responseDetails.TunedSource;
      if (responseDetails.TunedSource != "None" && responseDetails.TunedSource != "") {

        Debug("wixp.FUN_SOURCE tunedSource > " + tunedSource);

        if (pfmode == 'fmode') {
          clearTimeout(fullmodeTimeout);          
          leaveSmartInfo();          
        };       

        if(reSourceRequest == true) {

          reSourceRequest = false;         
          clearTimeout(setCallTimeout);

          if (tunedSource == "MainTuner") {                       
            channel_selection();            
          } else if (tunedSource != "MainTuner") {                        
            switchToSource(tunedSource);                               
          };                            
        };

        if(channelList.length > 0 && currentIndex != 0) {          
          goto(currentIndex, "noAni", false);
        };        
      }            
      break;

      case wixp.FUN_AUDIOCONTROL:
        isAudioMute = responseDetails.AudioMute;
        /*Debug("currentAudioPage > " + currentAudioPage + " AudioControl AudioMute > " + isAudioMute);
        if(responseDetails.AudioMute != ""){
          if(currentAudioPage == "broadcast"){
            if(manualMute == "yes") {
              setAudioControl("Off");
            } 
          } else if(currentAudioPage == "video"){
            if(manualMute == "yes") {
              setAudioControl("Off");
            }
          } else if(currentAudioPage == "novideo"){
            manualMute = 'no';
            if(isAudioMute == "Off") {
              manualMute = 'yes';
              setAudioControl("On");
            };
          };
        };*/

        if(responseDetails.Volume != ""){
          //audioVolume = responseDetails.Volume;
          //Debug(" AudioControl Volume > " + audioVolume);
        };        
      break;

  } //END OF SWITCH

}; //END OF CALLBACKDISPATCHER
