var languageitem = new function() {

  this.name = "Language"; // Class reference

  /**
   * add Keylistener to keyList
   */
  this.Focus = function() {
    addkeylistener(this);
    LanguageInit();
  };

  /**
   * Remove Keylistener from keyList
   */
  this.RemoveFocus = function() {
    removekeylistener(this);
    changeactivelang();
  };

  /**
   * Key Handler for Language
   * @param : keyevent
   */
  this.KeyHandler = function(e) {

    var keyStatus = keyAlive;

    switch (e.which || e.keyCode) {
      case 37: //LEFT
        if (scrollType == "horizontal") {
          keyStatus = LanguageBack();
        } else if (scrollType == "grid") {
          if (languageList.length > 0 && (languageIndex % columns != 0)) {
            languageIndex--;
            $('.lang.listview').find('.language').removeClass('listnavi');
            $(languageList[languageIndex]).addClass('listnavi');
            keyStatus = keyConsumed;
          }
        } else if (scrollType == "popup-on") {
          //keyStatus = PopupBack();
          keyStatus = popupNavigation("left");
        }
        break;

      case 39: //RIGHT
        if (scrollType == "horizontal") {
          keyStatus = LanguageNext();
        } else if (scrollType == "grid") {
          if (languageList.length > 0 && (languageIndex % columns == 0)) {
            languageIndex++;
            $('.lang.listview').find('.language').removeClass('listnavi');
            $(languageList[languageIndex]).addClass('listnavi');
            keyStatus = keyConsumed;
          }
        } else if (scrollType == "popup-on") {
          //keyStatus = PopupNext();
          keyStatus = popupNavigation("right");
        }
        break;

      case 38: //UP
        if (scrollType == "vertical") {
          keyStatus = LanguageBack();
        } else if (scrollType == "grid") {
          if (languageList.length > 0 && (languageIndex - columns >= 0)) {
            languageIndex = languageIndex - columns;
            $('.lang.listview').find('.language').removeClass('listnavi');
            $(languageList[languageIndex]).addClass('listnavi');
            keyStatus = keyConsumed;
          }
        } else if (scrollType == "popup-on") {
          //keyStatus = keyConsumed;
          keyStatus = popupNavigation("up");
        }
        break;

      case 40: //DOWN
        if (scrollType == "vertical") {
          keyStatus = LanguageNext();
        } else if (scrollType == "grid") {
          if (languageList.length > 0 && (languageIndex + columns < languageList.length)) {
            languageIndex = languageIndex + columns;
            $('.lang.listview').find('.language').removeClass('listnavi');
            $(languageList[languageIndex]).addClass('listnavi');
            keyStatus = keyConsumed;
          }
        } else if (scrollType == "popup-on") {
          //keyStatus = keyConsumed;
          keyStatus = popupNavigation("down");
        }
        break;

      case 13: //OK
       changelanguages(); 
        keyStatus = keyConsumed;
        break;

    } //END OF SWITCH

    return keyStatus;

  }; //END OF KEYHANDLER

}; //END OF CLASS

var rows = 0;
var columns = 0;
var scrollType = "";
var languageIndex = 0;
var languageList = [];

function LanguageInit() {

  languageList = [];
  languageIndex = 0;

  var pop = $('.page-active .link.language-object .popup').length;

  if (pop > 0) {

    scrollType = "popup-off";

  } else {

    var _xPos = 0;
    var _yPos = 0;
    var languageobj = [];

    languageList = $('.page-active .link.active .listview ul li');

    for (var i = 0;
      (i < 3 && i < languageList.length); i++) {
      languageobj.push($(languageList[i]).offset());
    }

    for (var i = 0; i < languageobj.length; i++) {
      if (languageobj[i].top == languageobj[0].top) {
        _xPos++;
      }
      if (languageobj[i].left == languageobj[0].left) {
        _yPos++;
      }
    }

    if (_xPos == languageobj.length) {
      scrollType = "horizontal";
    } else if (_yPos == languageobj.length) {
      scrollType = "vertical";
    } else {
      rows = languageList.length / _xPos;
      columns = _xPos;
      scrollType = "grid";
    }
    languageIndex = $('.page-active .link.active .listview ul .listnavi').index();
  }
}

/**
 * List View
 * Get Next Language Name when RIGHT key press
 */
function LanguageNext() {
  var keyStatus = keyAlive;
  if (languageList.length > 0 && languageIndex < languageList.length - 1) {
    languageIndex++;
    $('.lang.listview').find('.language').removeClass('listnavi');
    $(languageList[languageIndex]).addClass('listnavi');
    keyStatus = keyConsumed;
  }
  Debug("languageIndex >" + languageIndex);
  return keyStatus;
} //End listview Next

/**
 * List View
 * Get Previous Language Name when LEFT key press
 */
function LanguageBack() {
  var keyStatus = keyAlive;
  if (languageList.length > 0 && languageIndex > 0) {
    languageIndex--;
    $('.lang.listview').find('.language').removeClass('listnavi');
    $(languageList[languageIndex]).addClass('listnavi');
    keyStatus = keyConsumed;
  }
  Debug("languageIndex >" + languageIndex);
  return keyStatus;
} //End listview Previous

/**
 * Popup View
 * Get Next Language Name when RIGHT key press
 */
function PopupNext() {
  if (languageList.length > 0 && languageIndex < languageList.length - 1) {
    languageIndex++;
    $('.page-active .sel_lang').removeClass('langactive');
    $(languageList[languageIndex]).addClass('langactive');
  }
  Debug("languageIndex >" + languageIndex);
  return keyConsumed;
} //End Popup Next

/**
 * Popup View
 * Get Previous Language Name when LEFT key press
 */
function PopupBack() {
  if (languageList.length > 0 && languageIndex > 0) {
    languageIndex--;
    $('.page-active .sel_lang').removeClass('langactive');
    $(languageList[languageIndex]).addClass('langactive');
  }
  Debug("languageIndex >" + languageIndex);
  return keyConsumed;
} //End popup Previous

/**
* Popup view 
*Getting the navigation type and navigating the channel
*/     
function popupNavigation(type){
  if (languageList.length > 0) {
    switch(type){
     case "left": 
          if (languageIndex > 0){
             languageIndex--;      
          }       
          break;
     case "right": 
          if (languageIndex < languageList.length - 1){
             languageIndex++;      
          }       
          break;
     case "up": 
          if ((languageIndex - 8) > -1){
             languageIndex = languageIndex - 8;      
          }       
          break;
     case "down": 
          if ((languageIndex + 8) < languageList.length){
             languageIndex = languageIndex + 8;      
          }       
          break;
    }
    $('.page-active .sel_lang').removeClass('langactive');
    $(languageList[languageIndex]).addClass('langactive');
 } 
  Debug("languageIndex >" + languageIndex);
  return keyConsumed;
}

//Language object : Set active language all pages
function changeactivelang() {
  var langname = $('.def_lang').val();
  if ($(languageList[languageIndex]).attr('langname') != langname) {
    $('.lang.listview').find('.language').removeClass('listnavi');
    $('.lang.listview').find("[langname=" + langname + "]").addClass('listnavi');
  }
};

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

//Menu Translation
function menuTranslation(sellang) {
	$('.pre-menu-container .link').each(function() {
		var dlang = $('.default_lang').val();
		var mnid = $(this).attr('id');
		var mt = JSON.parse($(this).attr('transtxt'));
		$.each(mt[0], function(lkey, lval) {
		 if (lkey == sellang) {
			var showtrans = ($.trim(lval) == '') && ($.trim(mt[0][dlang]) != '') ? mt[0][dlang] : ((($.trim(mt[0][dlang]) == '')) ? mt[0].title : lval);
			$('.pre-menu-container li a#'+mnid).text(showtrans);
		 }
		});
  });
  /** Adding the subpage arrow if menu contain the subppage on language change*/
    $(".pre-menu-container li.parent").each(function(){
      if($(this).find(".sub-menu-item").length > 0){
        //Checking if current menu is selected
        if($(this).parent().hasClass("active")){
          $(this).find("a.parent").html(escapeHtml($(this).find("a.parent").text())+'<div class="sub-page-arrow" style=""></div>');
         }else{
          $(this).find("a.parent").html(escapeHtml($(this).find("a.parent").text())+'<div class="sub-page-arrow" style="display:none;"></div>');
        }
      }
    });
}


function changelanguages() {
 
        var basepath = ($('.preview').length > 0) ? '../../' : '';
            pageid   = $('.page-active .widget').attr('id');
        if (scrollType == "popup-off") {
          scrollType = "popup-on";

          displayPopupdiv('select_lang_box'); //Display language popup

          $('.page-active .sel_lang').removeClass('langactive'); //Remove language active class in popup view
          var lnameId = $('.page-active .lang').attr('langname'); //Get language name
          $('.page-active .select_lang_box').find('.sel_lang #' + lnameId).parent().addClass('langactive'); //set active class for language in popup view

          languageList = $('.page-active .select_lang_container').find('.sel_lang'); //get all language flag in popup view
          languageIndex = $('.page-active .langactive').index();

        } else if (scrollType == "popup-on") {

          scrollType = "popup-off";
          //popup view : Set selected language for text object when popup close
          var actlang = $('.page-active .sel_lang.langactive').attr('lname'); //Get selected language name
	      menuTranslation(actlang);
          $('.widget .textobject').css('display', 'none'); //Hide all text object
          $('.export-view .widget .object-wrapper').find('#' + actlang).css('display', 'block'); //Show text objectonly for selected language
          $(".export-view .widget .object-wrapper .marquee." + actlang).show();
          $(".export-view .widget .object-wrapper .marquee").each(function() {
            var html = $(this).html();
            $(this).html(html);
          });
          $('.select_lang_box').css({
            'display': 'none'
          }); //Close popup
          $('.lang').attr('id', actlang);
          $('.lang').attr('langname', actlang);
          $('.lang.popup').find('img').attr('src', basepath+'sites/all/themes/tpvision/images/export/' + actlang + '.png');
          $('.sel_lang').removeClass('langactive');

          $('.lang.listview').find('.language').removeClass('listnavi');
          $('.lang.listview').find("[langname=" + actlang + "]").addClass('listnavi');
          $('.def_lang').val(actlang);
          
          if($('.wid-object-txt').length > 0){
             change_textobj_marquee_prop(actlang, pageid); // Set selected language for marquee
          }

        } else {
          //Listview : Set selected language for listview
          var listlang = $('.page-active  .language.listnavi').attr('langname'); //Get language name in listview
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
          $('.lang.popup').find('img').attr('src', basepath+'sites/all/themes/tpvision/images/export/' + listlang + '.png');
          $('.def_lang').val(listlang);
          $('.lang.popup').attr('langname', listlang);
          if($('.wid-object-txt').length > 0){
             change_textobj_marquee_prop(listlang, pageid);
          }
        }

}
