var nextPrev = [];
var txt_color = "";
var pageid = "";
var dynamicObject = {};
var currentPageId = 0;
var previousPageId = 0;
var fullmodeTimeout = "";
var isAudioMute = "";
var audioVolume = "";
var isPageLoaded = ""; 
var pageTimer;
var os = "";
var browser = "";
var debugEnable = false;

/**
 * Startup function
 */

getSystemInfo = function() {
  var userAgent = window.navigator.userAgent;
  console.log('userAgent ' + userAgent);
  var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};
  for(var key in browsers) {
    if (browsers[key].test(userAgent)) {
      browser = key;
      break;
    }
  };  
  if(userAgent.match(/Android/i)){
    os = 'android';
  } else if (userAgent.match(/iPhone | iPad | iPod/i)){
    os = 'ios';
  } else if (userAgent.match(/Windows/i)){
    os = 'windows';
  } else {
    os = 'linux';
  };
  console.log('os ' + os);    
};

function RootInit() {  

  pfmode = "";
	isPageLoaded = "";
  isOldPlatform = true;
  reSourceRequest = false;

  //Receive or call back from TV
  try {
    webixpObject.WebIXPOnReceive = callbackDispatcher;
  } catch (e) {
    //
  };

  getSystemInfo();
  	
	channelInit();
  
  objectActionKey.isKeyAction = "";  
  //objectActionKey.isNumericEntryEnable = $('.numerickey_enable').val();
  objectActionKey.isNumericEntryEnable = 0;
  Debug("NumericEntry Enabled :  "+$('.numerickey_enable').val());

	if ($('#digitalvideo').length == 0) {      
    $('<div width=\"0\" height=\"0\"></div>').attr('id', 'digitalvideo').appendTo('#content');  
  };
   
  $("body").append('<div id="debug" style="z-index:9999;"></div>');
  if(debugEnable == true) {    
    $('#debug').show();    
  }else {
     $('#debug').hide();
  };

	var listlang = getParameterByName('lang').trim();
	if(listlang){
		menuTranslation(listlang);
		$('.widget .textobject').css('display', 'none'); //Hide all text object
		$('.widget .object-wrapper').find('#' + listlang).css('display', 'block');
		$(".export-view .widget .object-wrapper .marquee." + listlang).show()
			$(".export-view .widget .object-wrapper .marquee").each(function() {
					var html = $(this).parent().html();
					$(this).parent().html(html);
					});
		$('.lang.listview').find('.language').removeClass('listnavi');
		$('.lang.listview').find("[langname=" + listlang + "]").addClass('listnavi');
		$('.lang.popup').find('img').attr('src', 'sites/all/themes/tpvision/images/export/' + listlang + '.png');
		$('.def_lang').val(listlang);
		$('.lang.popup').attr('langname', listlang);
	}
  //End


  dynamicObject = {
    "menu-object": menuitem,
    "language-object": languageitem,
    "channels-object": channelsitem
  };

  $('.preview-loading').hide();

  get_menu_status();
  var srcwidth = $(window).outerWidth();
  var srcheight = $(window).outerHeight();
  var srcsize = srcwidth + 'x' + srcheight;
  //Checking exported website is portrait or landscape mode
  if ($("body").hasClass("page-website-view")) {
    if (!$('#parent-div').hasClass('rotate-90')) {
      //Increasing the parent width nd height to 1920*1080 if height is more than 900px
      if (srcwidth > 1680 || srcheight > 1680) {
        $(".page-website-view #main").addClass("hd-resolution");
      } else {
        $(".page-website-view #main").addClass("normal-resolution");
      }
    } else {
      if (srcwidth > 1680 || srcheight > 1680) {
        $(".page-website-view #main").addClass("hd-resolution");
      } else {
        $(".page-website-view #main").addClass("normal-resolution");
      }
    }
  }

  //Searching all object in website and Increasing the width and height to 150%
  if (srcwidth > 1680 || srcheight > 1680) {
    if ($("body").hasClass("page-website-view")) {

      //applying border width for all object
			 var largeSize = 1;
			 var largeSizeOther = 1.5;
      $(".wobj").each(function() {
        var border = parseInt($(this).css("border-left-width")) * largeSizeOther;
        $(this).css("border-width", border);
      });
      $("video , .channel-item").each(function() {
        var width = parseInt($(this).width()) * largeSizeOther;
        $(this).width(width);
        var width = parseInt($(this).height()) * largeSizeOther;
        $(this).height(width);
        //Not applying the style if current style not applied to current object
        var width = parseInt($(this).css("margin-top")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-top", width);
        }
        var width = parseInt($(this).css("margin-left")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-left", width);
        }
        var width = parseInt($(this).css("margin-right")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-right", width);
        }
        var width = parseInt($(this).css("font-size")) * largeSize;
        $(this).css('font-size', width);

      });
			//Image setting
      $(".image-object img").each(function() {
        //Not applying the style if current style not applied to current object
        var width = parseInt($(this).css("margin-top")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-top", width);
        }
        var width = parseInt($(this).css("margin-left")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-left", width);
        }
        var width = parseInt($(this).css("margin-right")) * largeSizeOther;
        if (width != 0) {
          $(this).css("margin-right", width);
        }
      });

      //set language width & height
      $(".language-selection img").each(function() {
        var lwidth = parseInt($(this).width()) * largeSizeOther;
        $(this).css({
          "width": lwidth,
          "height": lwidth
        });
      });
      $("li.language").each(function() {
        var margin = parseInt($(this).css('margin')) * largeSizeOther;
        $(this).css({
          "margin": margin
        });
      });
      $(".language-selection ul").each(function() {
        $(this).css({
          "padding": "0 0 0 45px"
        });
      });

      //set font-size for gadget object
      $("#gadget-date,#time,.weather-gadget .temperature").each(function() {
        var gfont = parseInt($(this).css("font-size")) * largeSize;
        $(this).css({
          'font-size': gfont
        });
      });

      $(".weather-gadget .details").each(function() {
        var gfont = parseInt($(this).css("font-size")) * largeSize;
        var lheight = gfont / 16;
        $(this).css({
          'font-size': gfont,
        });
      });

      //set font-size for textobject
      $(".text-widget").each(function() {
        var attr = $(this).attr("id");
        var lheight;
        var wspacing;
        $("#" + attr + " .textobject div").each(function() {
          if ($(this).text() != "")
            $(this).wrapInner('<span></span>');
        });
        $("#" + attr + " .textobject span").each(function() {
          if ($(this).has("span").length == 0) {
            var tfont = $(this).css('font-size').replace("px", "");
             var tfont = ((tfont) * largeSizeOther);
            if (tfont == '18') {
              lheight = '2.1em';
              wspacing = '-0.1em';
            } else if ((tfont == '24')) {
              lheight = '1.55em';
              wspacing = '-0.06em';
            } else if (tfont == '27') {
              lheight = '1.45em';
              wspacing = '-0.065em';
            } else if (tfont == '33') {
              lheight = '1.23em';
              wspacing = '-0.043em';
            } else if (tfont == '39') {
              lheight = '1.1em';
              wspacing = '-0.055em';
            } else if (tfont == '54') {
              lheight = '1.1em';
              wspacing = '-0.01em';
            }  else if (tfont == '108') {
              lheight = '1em';
              wspacing = '-0.02em';
            }  else if (tfont == '72') {
              lheight = '1.04em';
              wspacing = '-0.023em';
            } else if (tfont == '42') {
              lheight = '0.96em';
              wspacing = '-0.05em';
            } else if (tfont == '30') {
              lheight = '1.38em';
              wspacing = '-0.08em';
            } else if (tfont == '21') {
              lheight = '1.75em';
              wspacing = '-0.077em';
            } else if (tfont == '36') {
              lheight = '1.14em';
              wspacing = '-0.04em';
            } else if (tfont == '12') {
              lheight = '3.45em';
              wspacing = '-0.13em';
            } else if (tfont == '13.5') {
              lheight = '3em';
              wspacing = '-0.271em';
            } else if (tfont == '15') {
              lheight = '2.65em';
              wspacing = '-0.12em';
            } else if (tfont == '16.5') {
              lheight = '2.4em';
              wspacing = '-0.19em';
            }
            /*if (tfont < '13') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(6));
            } else if (tfont == '16') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(8.1));
            } else if (tfont == '22') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(10));
            } else if (tfont == '72') {
              tfont = parseFloat(parseInt(tfont) + parseFloat(32));
            } else if (tfont == '26') {
              tfont = parseFloat(parseInt(tfont)+ parseFloat(10));
            } else if (tfont == '36') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(15));
            } else if (tfont == '48') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(17));
            } else if (tfont == '20') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(8));
            } else if (tfont == '18') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(8.3));
            } else if (tfont == '14') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(6));
            } else if (tfont == '28') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(15));
            } else if (tfont == '24') {
              tfont = parseFloat(parseFloat(tfont) + parseFloat(12));
            }*/
            $(this).css({
              'font-size': tfont,
             'line-height': lheight,
             'word-spacing':wspacing
            });
            $(this).css({
              'width': 'auto',
              'height': '100%',
              'overflow': 'hidden'
            });
          }
        });
      });

      //set menu properties
      $(".menu-item").each(function() {
        Debug("menu : " + $(this).css("margin"));
        /*var margin = parseInt($(this).css("margin-left")) * largeSizeOther;
        var padding = parseInt($(this).css("padding-left")) * largeSizeOther;
        $(this).css({
          'margin': margin,
          'padding': padding
        });*/
      });
      $(".menu-item a").each(function() {
        var fontSize = parseInt($(this).css("font-size")) * largeSize;
        var fontWeight = parseInt($(this).css("font-weight")) * largeSizeOther;
				if(fontWeight > 600){
					  fontWeight = "bold";
					}
        $(this).css({
					'font-size' : fontSize,
          'font-weight': fontWeight
        });
      });
    }
  }

  //Remove all href
  $("a").removeAttr("href");
  $(".wobj").removeAttr("href");

  if ($("#parent-div .page-display").length == 1) {
    $('.pre-menu-container li.deactive').remove();
  }

  txt_color = $('.pre-menu-container li a').css('color'); //Get menu text color

  //Set default language highlights for all pages in listview
  var getdeflang = $('.def_lang').val();
  $('.lang.listview').find("[langname=" + getdeflang + "]").addClass('listnavi');
  //End default listview highlights

  if ($('.pre-menu-container li.meactive .sub-menu li.mLink').length > 0 ) {
    $('.pre-menu-container li.meactive .sub-page-arrow').show();
  }

  $('#vidObject').css({
    "width": '100%'
  });
  $('#vidObject').css({
    "height": '100%'
  });

  $(".page-active ul.channels-menu").hide();
  $('.page-active ul.channels-menu').html("");

  if ($('#dummybroadcast').length == 0) {    
    $('<div id="dummybroadcast"></div>').appendTo('#parent-div');      
    $('#dummybroadcast').css("position", "absolute");
    $('#dummybroadcast').css("width", "10px");
    //$('#dummybroadcast').css("height", "100px");
    $('#dummybroadcast').css('top', $('#parent-div').height()-1 + "px");
    $('#dummybroadcast').css("left", $('#parent-div').width()-1 + "px");     
    $('#dummybroadcast').css({"z-index": 9998});
  };

  if ($('#digitalentry').length == 0) {   
    $('<div id="digitalentry"></div>').appendTo('#parent-div');
    $('#digitalentry').css("fontSize", "30px");
    $('#digitalentry').css("position", "absolute");
    $('#digitalentry').css("width", "100px");
    $('#digitalentry').css("left", ($('#parent-div').width() - ($('#digitalentry').width() + 10)) + "px");
    $('#digitalentry').css('top', '10px');
    $('#digitalentry').css('color', 'white');
    $('#digitalentry').css('display', 'none');
    $('#digitalentry').css({
      "z-index": 9999
    });
    $('#digitalentry').css('text-align', 'right');
  }

  /**
   * Touch function
   * @see : is_touch_device() it's return wether touch or not
   */
  if (is_touch_device() == true || $('#parent-div').hasClass('preview')) {

    //Menu and Submenu click events
    $('.pre-menu-container li').on("click", function(event) {
      var eventid = $(event.target).attr('pval');
      if (eventid != undefined) {
        PageSwitch(eventid, 'menu');
        event.preventDefault();
        event.stopPropagation();
      }
    });

    //if click subpage arrow it's show all subpage
    $('.sub-page-arrow').on("click", function() {
      var activeLink = $(".pre-menu-container li a.active");
      if (activeLink.parent().hasClass('menu-item')) {
        if (activeLink.next().find('li').length > 0) {
          if ($('.page-active .widget').hasClass('active')) {
            return;
          } else {
            activeLink.next().show();
            activeLink.removeClass("active");
            $('.sub-menu-item').removeClass('arrow');
            activeLink.next().find('li:first-child a.link.sub-menu-item').addClass('active');
            $('.active').parent().addClass('arrow');
            set_sub_menu_bg(txt_color);
          }
        }
      } else {
        if (activeLink.parent().hasClass('sub-menu-item')) {
          activeLink.removeClass("active");
          activeLink.parent().next().find('.link.sub-menu-item').addClass('active');
          $('.sub-menu-item').removeClass('arrow');
          $('.sub-menu-item .active').parent().addClass('arrow');
          set_sub_menu_bg(txt_color);
        }
      }
    });

    //Widget Object click action
    $(".wobj").on("click", function(event) {
      var target = $(event.target);
      if ($(this).find('.language-selection.listview').length == 1) {
        if (target.parent().parent().is(".language")) {
          var langname = target.parent().parent().attr('langname');
          $('.page-active .language').removeClass('listnavi');
          $('.lang.listview').find("[langname=" + langname + "]").addClass('listnavi');
           PageDefaultFocus("widget");
           languageitem.Focus();
           changelanguages();
        }
       }

      if ($(this).hasClass('link')) {
        var objName = ($(this).parent().parent().is('.popup') || $(this).is('.popup')) ? 'language' : 'widgetobj';
        widgetClick("click", $(this), objName);
       if(objName == 'language'){
          PageDefaultFocus("widget");
          languageitem.Focus();
          changelanguages();
       }
        event.preventDefault();
        event.stopPropagation();
      }
      
    });
    $('.sel_lang').on("click", function() {
      if($('.page-active .select_lang_box:visible').length > 0) {
         $('.sel_lang').removeClass('langactive');
         $(this).addClass('langactive');
         changelanguages();
      }
    });
  } //END touch function

  /*if($(".current-page-scheduler").val() != 'default') {
  }*/
  /**
   * XML Page [Android Tv]
   * when click thumbnail of image it's redirect to selected page
   * @param : pageid
   * @see   : getParameterByName() return pageid from url
   */
  if (!$("body").hasClass("page-website-edit")) {
    isPageLoaded = "";
    var urlid = getParameterByName('page').trim();
    if (urlid != "" && urlid != undefined) {
      //pageid = urlid;
			 PageSwitch(urlid, 'menu', 'init');
    } else{
	if($(".current-page-scheduler").val() != 'default'){
        pageid = $('#pre-menu-container li.mLink').attr('pval'); //Get pageid of first menu
        PageSwitch(pageid, 'menu', 'init');//Select page redirection
		  }
	  }
  } //End XML Page

}; //End RootInit function


/**
 * Remote click and touch
 * @param : string mCondition
 *   pass argument touch or Remote ok
 * @param : sting  mObject
 *   selected object name
 * @param : string mName
 *   argument menu or widget object
 * Get active object
 * Redirect to selected page
 */

function widgetClick(mCondition, mObject, mName) {

  $('.arrow').attr('style', '');

  if (mCondition == '' || mCondition == undefined) {
    mCondition = 'click';
  }

  switch (mName) {
    case 'widgetobj':
      $('.link').removeClass('active');
      $(mObject).addClass('active');
      break;
    case 'child-menu':
      $('li').removeClass('arrow');
      $('.link').removeClass('active');
      $(mObject).addClass('arrow');
      $(mObject).find('.link').addClass('active');
      break;
    case 'language':
      $('.link').removeClass('active');
      $('.page-active .popup').find('.language-object').addClass('active');
      break;
  }

  pageid = $('.page-active .widget').attr('id'); // Get page id
  var widActive = $('.page-active .widget').find('.wobj.link').hasClass('active'); // Checking object wether active class add or not

  //Get widget action
  if ($('.page-active .widget .link.wobj').hasClass('active') && $('.page-active .link.language-object.active').attr('aval') != '#') {

    var actionname = $('.page-active .widget .wobj.active').attr('aval'); //Get active object action value
    var sp = (actionname == null) ? '' : actionname.split('|');

    Debug(mCondition + " > " + sp);

    switch (sp[1]) {

      case 'apk': // Launch apk 
        /*if (TVPlatform == "android"){
          unGrabVirtualKeyForward();
        }*/
        setTimeout(function(){
          switchToApplication(sp[0].toString(), 'Activate', sp[1]);        
        }, 10);
      break;

      case 'url': // External link page (like google,yahoo)
        window.location.href = sp[0];
        break;

      case 'pages': // Get internal page id
        var chkparent = sp[0].split('-');
	nextPrev.push($('.page-active').attr('pageid'));
        PageSwitch(chkparent[1], 'menu');
        break;

      case 'channels': //channels previews and next
        if (sp[0] == 'Next') {
          requestNext();
        } else {
          requestBack();
        }
        break;

      case 'switch-channels': //switch opertaion it's playing selected channels
        var chnum = parseInt(sp[0]);
        for (var i = 0; i < channelList.length; i++) {
          if (channelList[i].ChannelNo == chnum) {
            switchToChannel(chnum);
            if (sp[2] == 'fmode') {
              leaveSmartInfo();
            }
            break;
          }
        }
        break;

      case 'switch-option': // switch application Miracast, Directshare, Skype, SmartTv
        if ( (sp[0] == 'Miracast' || sp[0] == 'Directshare') && (isOldPlatform == true) ) {
          requestApplication(sp[0]);
        } else {
          switchToApplication(sp[0].toString());
        };
        break;

      case 'source-option': //switch source MainTuner, HDMI, VGA
        pfmode = sp[2];
        if (sp[0] == "MainTuner") {
          selectChannelFromTV(channelList[currentIndex].ChannelNo);          
        } else {          
          switchToSource(sp[0].toString());
        };
        clearTimeout(fullmodeTimeout);
        if (pfmode == 'fmode') {
          var mTime = 1000 * 10;
          if((sp[0].toString() == tunedSource) || (sp[0].toString() == "MainTuner")){
            mTime = 100;
          };         
          fullmodeTimeout = window.setTimeout(function() {
            pfmode = "";            
            clearTimeout(fullmodeTimeout);            
            leaveSmartInfo();
          }, mTime);          
        };
        break;

    } //END OF SWITCH

  } else {
    //
  }

} //END widgetClick

/**
 * Get page id from url
 * @param : url
 * @return : page id
 */
function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
} //End

/**
 * Language popup
 * Show language popup center
 */
function displayPopupdiv(container) {
  var divWidth = $("." + container).width();
  var winWidth = $(window).width();
  var leftPos = (winWidth - divWidth) / 2;
  $("." + container).css("left", leftPos);
  $('.' + container).fadeIn("slow");
} //End language popup

/**
 * Checking for touch device
 * @return : device touch or not
 */
function is_touch_device() {
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
} //End touch device

/** Text object
 *  marquee and tickering
 *  @param : lang selected language name
 *  @param : id text object id
 */
function change_textobj_marquee_prop(lang, id) {
  $(".export-view .object-wrapper .marquee").each(function() {
    $(this).html($(this).html());
  });
  if ($("#" + id + " .object-wrapper .tickering").length) {
    textWidgetMarqueeThickering("", "", "", "", "", "", 1);
    $(".export-view #" + id + " .object-wrapper").each(function() {
      if ($(this).find(".tickering").length) {
        var tid = $(this).attr("id");
        var delay = $("#" + tid + " .tickering:first").attr("scrolldelay") + "00";
        var direction = $(this).find(".tickering").attr("direction");
        startedTextThickering = 1;
        var count = 1;
        if ($("#" + tid + " ." + lang + ".tickering div").length) {
          textWidgetMarqueeThickering(tid, count, lang, 1, delay, direction, 0);
        }
      }
    });
  }
} //End marquee and thickering

/**
 * @info  : Set Active menu and page hightlight
 * @param : pageid active page id
 * @param : focusOn whether Focus to menu or object
 */
function PageSwitch(pageid, focusOn, navigationFrom) {

  $('.arrow').attr('style', '');
  if( (isPageLoaded == "started") || (previousPageId == pageid) ) { return };
  
  //Debug(" previousPageId > " + previousPageId + " pageid > " + pageid);
  
  //previousPageId equal to selected pageid page will not reload
  if (pageid == undefined) {
    pageid = $('.page-active').attr('pageid');
    $('.sub-menu').hide();    
  };

  var parentid = $('#menu-page-' + pageid).attr('parentpage'); //Get menu parent page id

  if (parentid == "" || parentid == undefined) {
    parentid = pageid;
  };

  //get meactive background color
  var bgcolor = $('.pre-menu-container li.parent:not(.meactive)').css('background-color');
  var acbgcolor = $('.pre-menu-container li.meactive').css('background-color');
  var color = $('.pre-menu-container li.parent:not(.meactive) a').css('color');
  var accolor = $('.pre-menu-container li.meactive a').css('color');
  var fontstyle = $('.pre-menu-container').css("font-family");
  $('.pre-menu-container').css({"font-family":fontstyle});
  //Remove all active class from menu and objects
  $('.link.wobj').removeClass('active');
  $('.sub-page-arrow').hide();
  $('.sub-menu').hide();
  $('.pre-menu-container li').removeClass('meactive');
  $('.pre-menu-container li').find('a.link').removeClass('active');
  $('.sub-menu-item').removeClass('active');
  $('.child-menu').removeClass('arrow');

  //set hightlight and add active class for selected menu background
  $('.pre-menu-container li').css('background-color', bgcolor);
  $('.pre-menu-container li a').css('color', color);
  $('.pre-menu-container li#menu-page-' + parentid).css('background-color', acbgcolor);
  $('.pre-menu-container li#menu-page-' + parentid + ' a').css('color', accolor);

  $('.pre-menu-container li#menu-page-' + parentid).find('a.link.parent').addClass('active');
  $('.pre-menu-container li#menu-page-' + parentid).addClass('meactive');

  //if subpage is their show subpage arrow
  if ($('.pre-menu-container li.meactive .sub-menu li.mLink').length > 0) {
    $('.pre-menu-container li.meactive .sub-page-arrow').show();
  }
  
  var mTime = 5;
  if(navigationFrom == 'menu') {
     mTime = 50;
    if(isPageLoaded != "started"){
      mTime = 30;
    };   
  };
  
  clearTimeout(pageTimer);

  pageTimer = window.setTimeout(function() {

    clearTimeout(pageTimer);
    clearTimeout(setCallTimeout);
    clearTimeout(videoTimeout); 

    if(debugEnable == true){
      Debug("", true);
    };
    
    pfmode = "";
    IsVideoPresent = "";
    objectActionKey.isKeyAction = "";    
    isPageLoaded = "started";

    $('#dummybroadcast').html('');
         
    //Set page-active class for selected page
    //if($('.pre-menu-container li.mLink').length > 0) { $('#parent-div .page-display').removeClass('page-active'); }
    $('#parent-div .page-display').removeClass('page-active');
    $('.menu-page-' + pageid).addClass('page-active');

    //hide language option without text-area
    var langcount = $('.langcount').val();
    var chkxtobj = $('.page-active .widget .wobj').hasClass('object-wrapper');

    if (chkxtobj == false || (langcount == 1 || langcount == 0)) {
      $('.page-active .widget .wobj.lang-option').remove();
    }

    //Listview : highlights on default language
    if ($('.page-active .listview').length == 1) {
      var activelang = $('.def_lang').val();
      $('.lang.listview').find('.language').removeClass('listnavi');
      $('.lang.listview').find("[langname=" + activelang + "]").addClass('listnavi');
    };

    $('#digitalvideo').html('');
    $('.page-active .widget .video-object .broadcast-object').html('');
    
    $('.widget .video-object .broadcast-object').each(function() {
      $(this).find('object').remove();
    });

    //Remove all html gadget
    $(".gadget-object.html").each(function(i, e) {    
      $(this).find('.htmlsrc').html('');
    }); 

    broadcastVideoStart(pageid);
    startFunctionalityForCurrentPage('menu-page-' + pageid); 
    PageDefaultFocus(focusOn);

    if ($('.page-active .widget .wobj.channels-prev').length == 1) {
      channelsBuild();
    };
   
    $('*').removeAttr('tabindex');
    //Add tabindex for all action object and gedgetobject 
    
    $(".pre-menu-container, .page-active .focuslink, .page-active .twitter-timeline, .page-active .link").each(function (i) { $(this).attr('tabindex', i + 1); });
    $('.pre-menu-container').focus();

    window.setTimeout(function() {
      isPageLoaded = "finish";      
    }, 500);
    
  }, mTime);    

} //END PageSwitch

/*
 * Finding Next Object in a page
 * @param : Direction of Finding
 * @info : Set highlights for active object
 */
function FindPageWidgetObject(direction) {

  objectActionKey.isKeyAction == "";
  var widActive = $('.page-active .widget').find('.wobj.link').hasClass('active');

  Debug("direction > " + direction + " :: widActive > " + widActive);

  if (widActive == false) {
    for (var key in dynamicObject) {
      if (dynamicObject.hasOwnProperty(key)) {
        dynamicObject[key].RemoveFocus();
      }
    }

    PageDefaultFocus('widget');

  } else {

    var currattr = $('.page-active .wobj.link.active');
    var directionId = currattr.attr(direction);
   
    if (directionId != '' && directionId != currattr.attr('obid') && $('.navi-'+directionId).attr('aval') != "nolink") {
      $('.link.wobj').removeClass('active');
      $('.page-active .navi-' + directionId).addClass('active');

      LanguagepopupHighlight();

      RemoveFocusOnDynamicObject(currattr.attr("obid"));
      FocusOnDynamicObject(directionId);

    } else {
       var dname = 'top';
       var mLeft = $('.pre-menu-container').offset().left;
       var mTop = $('.pre-menu-container').offset().top;
       var percentLeft = ((mLeft/$(this).width()) * 100);
       var percentTop = ((mTop/$(this).height()) * 100);
 
       if($('.menu_type').val() == "1") {
         dname  = (percentTop < 50) ?  "top" : "bottom"; 
       } else if ($('.menu_type').val() == "2") {
         dname  = (direction == "top") ? "top" : (percentLeft < 50) ? "left" : "right"; 
       }
        
      if (direction == dname && menuIsEnable == 1 && $('.medeactive.mLink').length > 0) {
        var currattr = $('.page-active .wobj.link.active');
        RemoveFocusOnDynamicObject(currattr.attr("obid"));

        $('.link.wobj').removeClass("active");
        $('.pre-menu-container .meactive').find('a.link.parent').addClass('active');
        if ($(".pre-menu-container li").length > 1) {
          dynamicObject["menu-object"].Focus();
          $(".pre-menu-container").addClass('menuactive');
        }
      }

    } //END IF
  } //END IF
}; //END FindPageWidgetObject

/**
 * Default focus
 * @param : focusOn of Finding
 * @info  : Set default highlights to menu
 */

function PageDefaultFocus(focusOn) {
  $('.pre-menu-container ').removeClass('menuactive');
  if (focusOn.toLowerCase() == 'menu' && ($(".page-active .widget [defaultselection='1']").length == 0 || $(".page-active .widget [defaultselection='1']").attr('aval') == "nolink")) {
    if (get_menu_status() == 1) {
       $('.pre-menu-container .meactive').find('a.link.parent').addClass('active');
       menuitem.Focus();
       $('.pre-menu-container ').addClass('menuactive');
       return;
    }
  } //End default Focus

  //Remove all menu active class
  $('.pre-menu-container').removeClass("active");
  $('.widget').removeClass("active");
  $('.sub-menu-item').removeClass('arrow');
  $('.sub-menu-item').removeClass("active");

  if ($('.page-active .widget').find('.link.wobj:visible').length > 0) {

    menuitem.RemoveFocus(); //Remove menu Focus

    ////////////////////// USER Default selection //////////////////////
    
    if($(".page-active .widget [defaultselection='1']").length > 0 && $(".page-active .widget [defaultselection='1']").attr('aval') != "nolink"){
      $('.page-active .widget').find("[defaultselection='1']").first().addClass('active');
    } else { //select first object
      //$('.page-active .widget').find('.link:visible').first().addClass('active'); 
      var find = $('.page-active .widget').find("[first='1']").first().attr("id");
      if (find != undefined){
        $('.page-active .widget').find("[first='1']").first().addClass('active');
      }else{
        $('.page-active .widget').find('.link:visible').first().addClass('active'); 
      }
    }

    $('.pre-menu-container .meactive').find('a.link.parent').addClass('active');
    FocusOnDynamicObject($('.page-active .widget .link.wobj.active').attr('obid'));
    $('.pre-menu-container ').removeClass('menuactive');

    LanguagepopupHighlight(); //Language popup Highlight

  } else {
    if (menuIsEnable == 1 ) {
      $('.pre-menu-container .meactive').find('a.link.parent').addClass('active');
      menuitem.Focus();
      $('.pre-menu-container ').addClass('menuactive');
    }
  };

}; //End default focus

//FocusOnDynamicObject
function FocusOnDynamicObject(directionId) {
  if (directionId != '' && directionId != undefined) {
    for (var key in dynamicObject) {
      if (dynamicObject.hasOwnProperty(key)) {
        if ($("#" + key + "-" + directionId).length > 0) {
          Debug("add key > " + key + " " + directionId);
          dynamicObject[key].Focus();
        }
      }
    }
  }
}; //End dynamicObjectfocus

//Remove focus on dynamic Object
function RemoveFocusOnDynamicObject(directionId) {
  if (directionId != '' && directionId != undefined) {
    for (var key in dynamicObject) {
      if (dynamicObject.hasOwnProperty(key)) {
        if ($("#" + key + "-" + directionId).length > 0) {
          Debug("Remove key > " + key + " " + directionId);
          dynamicObject[key].RemoveFocus();
        }
      }
    }
  }
}; //End RemoveFocusOnDynamicObject

//LanguagepopupHighlight
function LanguagepopupHighlight() {
  if ($('.page-active .widget .link.wobj.active').find('.popup').length == 1) {
    $('.link').removeClass("active");
    $('.page-active .widget .popup').find('img').addClass('active');
  }
}; //END LanguagepopupHighlight

/*
 * Custom Debug function
 * @param : string, clear the div content & append the string
 */
Debug = function(str, clear) {
  
  var data = {LOG : str + " "};
 /* $.ajax({
    url: "http://192.168.1.10/restapi/fileread.php",
    type: "POST",
    data: JSON.stringify(data),
    async:true,
    dataType : 'json',   //you may use jsonp for cross origin request
    crossDomain:true
  });
*/
  if (tvbrowser == true && debugEnable == false) {
    return;
  };

  console.log(str);

  if (clear) {
    $('#debug').html('');
  };

  $('#debug').html($('#debug').html() + str + " ");  

}; //END Debug

/*
 * Backkey Navigation Handler
 */
function backKey() {
  isPageLoaded = ""; 
  var goback = nextPrev.pop();
  if (goback != undefined) {
    PageSwitch(goback, "menu");
  };  
  return keyConsumed;
}

/*
 * Handler ALL Page Navigation
 * @param : key Event
 */
function RootKeyHandler(e) {

  var keyStatus = keyAlive;
  var key = e.which || e.keyCode;

  switch (key) {

    case 37: //LEFT
      FindPageWidgetObject("left");
      keyStatus = keyConsumed;
      break;

    case 38: //UP
      FindPageWidgetObject("top");
      keyStatus = keyConsumed;
      break;

    case 39: //RIGHT
      FindPageWidgetObject("right");
      keyStatus = keyConsumed;
      break;

    case 40: //DOWN
      FindPageWidgetObject("bottom");
      keyStatus = keyConsumed;
      break;

    case 13: //OK
      if (!is_touch_device()) {
        widgetClick("OK", "", "");
        keyStatus = keyConsumed;
      }
      break;

  }; //END OF SWITCH

  if (tvbrowser == true) { // TVBrowser

    try {

      switch (key) {
        case VK_BACK: // TV Back key
          keyStatus = backKey();
          break;

        case VK_0:
        case VK_1:
        case VK_2:
        case VK_3:
        case VK_4:
        case VK_5:
        case VK_6:
        case VK_7:
        case VK_8:
        case VK_9:
          keyStatus = NumericEntry(key - 48);
          break;
      } //END OF SWITCH

    } catch (e) {
      keyStatus = keyAlive;
    }; //END OF TRY

  } else {
    switch (true) {
      case (key == 66): // 'b' key
        keyStatus = backKey();
        break;

      case (key >= 48 && key <= 57): // 0 to 9 keys
        keyStatus = NumericEntry(key - 48);
        break;
    } //END OF SWITCH
  }

  return keyStatus;

} //END ROOTKEYHANDLER
