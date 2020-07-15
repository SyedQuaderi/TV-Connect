//var startPlaylist = '';
var setPlaylistScheduler1 = {};
var playPlaylist1 = {};
var planSchedulerCalculation1 = '';
var startedPlaylist = 0;
var startedTextThickering = 0;
var textWidgetMarqueeThickeringVar = {};
var videoItems = {};
var videoTimeout;

jQuery(document).ready(function($) {
  //Calculating the menu
  var plan_scheduler = new Array();
  var playlistItems = new Array();
  var pagePlanScheduler = 0;
  //   var menu = $("#pre-menu-container").width();
  var mode = $('.each_web_mode').val();
  /* if(mode == 0){
  var le = (1280-menu)/2;
  $("#pre-menu-container").css({'left':le,'top':'10px'});
} else{
var le = ((720-menu)/2)+menu;
$("#pre-menu-container").css({'right':'10px','top':le,'left':'none'});
}
*/
  //Adding classes for thickering li&div
  $(".object-wrapper .tickering div").addClass("thkwrap");
  $(".object-wrapper .tickering li").addClass("thkwrap");
  //Loading default Text
  var selected = $('.widget .link select').val();
  //Hiding the all language text and showing default text
  $('.text-widget').each(function() {
    $('.object-wrapper .textobject').hide();
    $('.object-wrapper .default').show();
  });

  /**  page plan scheduler  **/
  if ($(".website-page-scheduler").val() == 1) {
    //Convertung the plan page scheduler data to array
    var page_scheduler = jQuery.parseJSON($(".page-scheduler-data").text());
    /**
    calling page scheduler functionalitu
    default plan scheduler details, plan default type, position, start/stop
    */
    playPagePlanScheduler(page_scheduler['default'], "default", 0, 0);
    //Check if planned scheduler is added
    if ($(".planned-scheduler-exist").val() == 1) {
      //Call planned scheduler checker
      planpageSchedulerCalculation(page_scheduler);
    }
  }
});

/**  Checking plan page scheduler if user added any plan scheduler for page */
function planpageSchedulerCalculation(page_scheduler) {
  var def = 1;
  //Loop throught all page schedulers
  $.each(page_scheduler, function(key, value1) {
    //get current page scheduler running
    var psch = $(".current-page-scheduler").val();
    //Check plan scheduler id scheduler type is not default
    if (key != 'default') {
      //Calling the inbuild ClockControl
      var da = ClockControl();
      //var da = new Date(mDate);
      var date = da.getTime();
      var stdate = new Date(value1['start_date']).getTime();
      var sodate = new Date(value1['stop_date']).getTime();
      //comparing the date
      if ((date > stdate) && (date < sodate)) {
        var hours = da.getHours();
        var min = da.getMinutes();
        var cu_time = (hours * 60) + min;
        var stt = value1['start_time'].split(':');
        var st_time = ((stt[0] * 60) + (stt[1] * 1));
        var sto = value1['stop_time'].split(':');
        var so_time = ((sto[0] * 60) + (sto[1] * 1) - 1);
        //TIme compare
        if ((st_time <= cu_time) && (so_time >= cu_time)) {
          //Checking week day
          var day = da.getDay() + 1;
          var found = 0;
          for (var i = 0; i < value1['days'].length; i++) {
            if (day == value1['days'][i]) {
              found = 1;
            }
          }
          //Checking the weekday
          if (found) {
            def = 0;
            if (psch != key) {
              //Stopping the previous page scheduler and start new one
              console.log(psch + '<---cancelling the previous page scheduler & running new page scheduler--->' + key);
              $('.current-page-scheduler').val(key);
              //Stop previous scheduler
              playPagePlanScheduler("", "", 0, 1)
                //Start new scheduler
              playPagePlanScheduler(page_scheduler[key], key, 0, 0);
            } //End of not equal scheduler
            return false;
            //  break start;
          }
        } //End if time compare

      } //End of date commpare

    } //End if of not default

  }); //End Each of particualer scheduler

  //Checking if no planning scheduler playing then play default
  if (def) {
    psch = $(".current-page-scheduler").val();
    key = "default";
    if (psch != key) {
      console.log(psch + '<---cancelling the previous page scheduler defaultc & running new page scheduler--->' + key);
      $('.current-page-scheduler').val("default");
      playPagePlanScheduler("", "", 0, 1)
      playPagePlanScheduler(page_scheduler[key], key, 0, 0);
    }
  }

  //Call the page scheduler Calculating again after 5 secs
  setTimeout(function() {
    planpageSchedulerCalculation(page_scheduler);
  }, 5000); //Time out

  //  return false;
} //End of planSchedulerCalculation

/** Starting the page scheduler by waiting the time based on user selection*/
function playPagePlanScheduler(pl_details, key, pos, stop) {
  if (stop == 1) {
    clearTimeout(pagePlanScheduler);
  } else {
    if (pos == pl_details['pages'].length) {
      //Looping the playlist again if all the pages in list is over
      playPagePlanScheduler(pl_details, key, 0, 0);
    } else {
      //Calling the page switch function to change the page based on plan
      var pageid = $("#pre-menu-container li#" + pl_details['pages'][pos]["id"]).attr('pval');
      PageSwitch(pageid, 'menu');
      //Settings the delay of page to wait until next page show
      var delay = parseInt(pl_details['pages'][pos]["duration"]) * 1000;
      pagePlanScheduler = setTimeout(function() {
        pos++;
        if ($(".current-page-scheduler").val() == key) {
          playPagePlanScheduler(pl_details, key, pos, 0);
        } else {
          playPagePlanScheduler(pl_details, key, pos, 1);
        }
      }, delay);
    }
  }
}


/** this function is to play the all the items in playlist based on the object type image/video*/
function playPlaylist(playlistItems, onid, sch, snid, pl_details, count, i, stop) {
  if (stop == 1) {
    //Clearing the previous calling function
    $.each(playPlaylist1, function(key, value) {
      clearTimeout(playPlaylist1[key]);
    });
  } else {
    startedPlaylist = 1;
    //Checking the playlist item exist or not
    if (count != i) {
      //Getting the playlist item details
      var pl_item = playlistItems[onid][snid]['item'][i]['id'];
      var pl = playlistItems[onid][snid]['id'];
      //Checking if current playlist page is active or not
      if (!$(pl).parent().parent().parent().hasClass("page-active")) {
        return false;
      }
      //default hide and stop showing all the files
      $(pl + ' .playlist').hide();
      $(pl + ' video').each(function() {
        $(this).trigger('pause');
      });

      //Checking the current playlist should stop or continue
      playPlaylist1[1] = setTimeout(function() {
        var c_nid = $('.current-playlist-playlist-' + onid).val();
        if (c_nid != sch) {
          if ($(pl).find('#' + pl_item).hasClass('video')) {
            $(pl).find('#' + pl_item).trigger('pause');
          }
          return false;
        }
      }, 1000);
      //console.log("playing date :  "+ Date());
      //Finding the particualer item to show
      $(pl).find('#' + pl_item).show();
      //playing the video if video tag exist then it load and start playing
      if ($(pl).find('#' + pl_item).hasClass('video')) {
        $(pl + ' video#' + pl_item).load();
        $(pl + ' video#' + pl_item).trigger('play');
        $(pl + ' video#' + pl_item).currentTime = 0;
      }
      //Calculating gthe delay of each item and waiting for next item to show
      var delay = playlistItems[onid][snid]['item'][i]['duration'];
      var c_count = $('.current-playlist-playlist-' + onid).attr("count");
      playPlaylist1[c_count] = setTimeout(function() {
        i++;
        var c_nid = $('.current-playlist-playlist-' + onid).val();
        if (c_nid == sch) {
          playPlaylist(playlistItems, onid, sch, snid, pl_details, count, i, stop);
        } else {
          return false;
        }
      }, delay);
    } else {
      $(pl + ' .playlist').hide();
    }
  }
}

//Sending the scheduler playlist
//starting the scheduled here
//It start eith object id and scheduler nid
/** It will start looping all the playlist in scheduler and calling other function to to show all the items in playlist */
function setPlaylistScheduler(playlistItems, onid, sch, pl_details, val, stop) {
  //checking if scheduler is exist
  if (pl_details['plan'] == null && stop == 0) {
    startedPlaylist = 0;
    return false;
  }
  //Stopping all scheduler playlist on page change
  if (stop == 1) {
    startedPlaylist = 0;
    $.each(setPlaylistScheduler1, function(key, value) {
      clearTimeout(setPlaylistScheduler1[key]);
    });
  } else {
    startedPlaylist = 1;
    if (val == pl_details['plan'].length) {
      //Looping the playlists again in scheduler
      setPlaylistScheduler(playlistItems, onid, sch, pl_details, 0, stop);
    } else {
      //default playlist playling
      //Calculating tje delay of each playlist scheduler and settings the delay value in variable
      var count = pl_details['plan'][val]['count'];
      var delay = 0;
      for (var j = 0; j < playlistItems[onid][pl_details['plan'][val]['nid']]['item'].length; j++) {
        delay = delay + playlistItems[onid][pl_details['plan'][val]['nid']]['item'][j]['duration'];
      }

      //Checking current playlist should play or stop
      setPlaylistScheduler1[1] = setTimeout(function() {
        var c_nid = $('.current-playlist-playlist-' + onid).val();
        if (c_nid != sch) {
          return false;
        }
      }, 1000);
      //Calling the playlist function to playcomplete function
      var val1 = playPlaylist(playlistItems, onid, sch, pl_details['plan'][val]['nid'], pl_details, count, 0, stop);
      //Waiting for particualer playlist to finish there job
      var c_count = $('.current-playlist-playlist-' + onid).attr("count");
      setPlaylistScheduler1[c_count] = setTimeout(function() {
        val++;
        var c_nid = $('.current-playlist-playlist-' + onid).val();
        if (c_nid == sch) {
          setPlaylistScheduler(playlistItems, onid, sch, pl_details, val, stop);
        } else {
          return false;
        }
      }, delay);
    }
  }
}

/** Checking the plan playlist scheduler if anything to run on time */
function planSchedulerCalculation(plan_scheduler, playlistItems, stop) {
  //Repeat the checking plan scheduler on each second
  if (stop == 1) {
    //startedPlaylist = 0;
    clearTimeout(planSchedulerCalculation1);
  } else {
    var planSchedulerAvailablity = 0;
    startedPlaylist = 1;
    //Getting internal tv clock or internet clock based on user selection in tv
    var da = ClockControl();
    //Checking all playlist object in the page
    $.each(plan_scheduler, function(key, value2) {
      var def = 1;
      var sch = $('.current-playlist-playlist-' + key).val();
      //Checking each playlist scheduler
      $.each(value2, function(key1, value1) {
        if (key1 != 'default' && sch != undefined) {
          planSchedulerAvailablity = 1;
          //var da = new Date(mDate);
          var date = da.getTime();
          var stdate = new Date(value1['start_date']).getTime();
          var sodate = new Date(value1['stop_date']).getTime();
          //comparing the date
          //console.log(stdate+'---------'+date+'---------'+sodate);
          if ((date > stdate) && (date < sodate)) {
            //var da = cDate;
            var hours = da.getHours();
            var min = da.getMinutes();
            var cu_time = (hours * 60) + min;
            var stt = value1['start_time'].split(':');
            var st_time = ((stt[0] * 60) + (stt[1] * 1));
            var sto = value1['stop_time'].split(':');
            var so_time = ((sto[0] * 60) + (sto[1] * 1) - 1);
            //TIme compare
            //console.log(st_time+'--time---'+cu_time+'---'+so_time);
            if ((st_time <= cu_time) && (so_time >= cu_time)) {
              //console.log('came');
              //Checking week day
              var day = da.getDay() + 1;
              var found = 0;
              for (var i = 0; i < value1['days'].length; i++) {
                if (day == value1['days'][i]) {
                  found = 1;
                }
              }
              //Checking the weekday
              if (found) {
                def = 0;
                if (sch != key1) {
                  //Stopping the other playlist starting this playlist
                  console.log(sch + '<---cancelling the previous scheduler & running --->' + key1);
                  $('.current-playlist-playlist-' + key).val(key1);
                  setPlaylistScheduler(playlistItems, key, key1, value1, 0);
                } //End of not equal scheduler
                return false;
                //  break start;
              }
            } //End if time compare

          } //End of date commpare

        } //End if of not default

      }); //End Each of particualer scheduler

      //Checking if no planning playlist playing then play default
      if (def) {
        //checking if not playlist playing default playlist should start
        var test = $('.current-playlist-playlist-' + key).val();
        if (test != 'default' && sch != undefined) {
          console.log(test + '<---cancelling the previous scheduler & running --->' + 'default');
          $('.current-playlist-playlist-' + key).val('default');
          setPlaylistScheduler(playlistItems, key, 'default', value2['default'], 0);
          //return false;
        }

      }

    }); //End Each scheduler
    //Checking if planscheduler not exist it will stop the checking plan scheduler
    if (!planSchedulerAvailablity) {
      planSchedulerCalculation("", "", 1);
    } else {
      planSchedulerCalculation1 = setTimeout(function() {
        planSchedulerCalculation(plan_scheduler, playlistItems, stop);
      }, 1000); //Time out
    }
  }

  //return false;

} //End of planSchedulerCalculation

//Starting the playlist by passing the plan_scheduler argument
//Call this function only when the page is showing
function startPlaylist(plan_scheduler, playlistItems, stop) {
  //plan_scheduler = jQuery.parseJSON(plan_scheduler);
  var count = 2;
  $.each(plan_scheduler, function(key, value) {
    if ($(".appendplaylist-" + key + " .playlist").length &&  $("#playlist-div-"+key).is(":visible")){
      if ($(".current-playlist-playlist-" + key).length) {
        //Store the currently playing scheduler details
        $(".current-playlist-playlist-" + key).remove();
      }
      $('#playlist-div-' + key).append('<input type=\"hidden\" class=\"current-playlist-playlist-' + key + '\" name=\"current-playlist-playlist-' + key + '\" count=\"' + count + '\" value=\"blank\" />');
      //Start the scheduler with defaul playlist
      count++;
      //setPlaylistScheduler(playlistItems, key, 'default', value['default'], 0, 0);
    } else {
      $(".current-playlist-playlist-" + key).val("blank");
    }
  });
  //Started Checking the plan scheduler
  planSchedulerCalculation(plan_scheduler, playlistItems, 0);

}


/** On page change it will call this function to update the details*/
//Stopping the previous playlist items and starting the current one
function startFunctionalityForCurrentPage(id) {
  //console.log("Start function calling: " + id);
  //Stopping the previous running playlist functions
  if (startedPlaylist == 1) {
    setPlaylistScheduler("", "", "", "", "", 1);
    playPlaylist("", "", "", "", "", "", "", 1);
    planSchedulerCalculation("", "", 1);
  }
  //Stopping the previous running text thickering functions
  if (startedTextThickering == 1) {
    textWidgetMarqueeThickering("", "", "", "", "", "", 1);
  }
  //Stoping the previous page videos
  $(".video-object video").each(function() {
     $(this).autoplay = false;
     $(this).trigger('pause');
  });

  //Stopping all the playlist video
  $('.playlist-wrapper video').each(function() {
    $(this).autoplay = false;
    $(this).trigger('pause');
  });
  //Starting the marqquee object from beggining
  var lang = $(".def_lang").val();
  $("." + id + " .object-wrapper .marquee").hide();
  $("." + id + " .object-wrapper .marquee." + lang).show();
  $("." + id + " .object-wrapper .marquee").each(function() {
    $(this).html($(this).html());
  });
  //Start playlist videos in current page
  $("." + id + " .video-object").each(function() {
    var vid = $(this).attr("id");
    if ($(this).find("broadcast-object").length == 0) {
      $("#"+vid+" video:visible").autoplay = true;
      $(this).find("video:visible").currentTime = 0;
      $(this).find("video:visible").load();      
      videoTimeout = window.setTimeout(function() {        
        $('.video-object video:visible').trigger('play');
      }, 20);
    } else {
      $("#" + vid + " video").remove();
      $("#" + vid + " video").css({
        'display': 'none'
      });
    }
  });
  //Starting the playlist
  var nid = id.replace("menu-page-", "");
  if ($("." + id + " .playlist-wrapper").length) {
    if ($(".plan_scheduler_" + nid).length) {
      plan_scheduler = jQuery.parseJSON($(".plan_scheduler_" + nid).text());
      playlistItems = jQuery.parseJSON($(".playlistItems_" + nid).text());
      startPlaylist(plan_scheduler, playlistItems, 0);
    }
  }

  //calling the tickering ffunction in current page
  if ($("." + id + " .object-wrapper .tickering").length) {
    if (startedTextThickering == 1) {
      //Stops the previous tickering
      textWidgetMarqueeThickering("", "", "", "", "", "", 1);
    }
    $("." + id + " .object-wrapper").each(function() {
      //Start the new tickering function
      if ($(this).find(".tickering").length) {
        var tid = $(this).attr("id");
        var lang = $(".def_lang").val();
        var delay = $("#" + tid + " .tickering").attr("scrolldelay") + "00";
        var direction = $(this).find(".tickering").attr("direction");
        startedTextThickering = 1;
        var count = 1;
        $('.tickering').find('li').addClass('thkwrap');
        $('.tickering').find('div').addClass('thkwrap');
        var element = "#" + tid + " ." + lang + ".tickering .thkwrap:nth-child(1)";
        if ($(element).length) {
          textWidgetMarqueeThickering(tid, count, lang, 1, delay, direction, 0);
        }
      }
    });
  }
}

//Tickering function for text objject
//It will depend thkwrap class to change the text everytime
function textWidgetMarqueeThickering(id, count, lang, pos, delay, direction, stop) {
  if (stop == 1) {
    //Stopd previous tickering
    startedTextThickering = 0;
    $.each(textWidgetMarqueeThickeringVar, function(key, value) {
      clearTimeout(textWidgetMarqueeThickeringVar[key]);
    });
  } else {
    lang = $('.def_lang').val();
    thkclass = '.thkwrap';
    $("#" + id + " " + thkclass).hide();
    //Checking position number
    //SHowing the items based on the current language
    var element = "#" + id + " ." + lang + ".tickering " + thkclass + ":nth-child(" + pos + ")";
    $("#" + id + " .tickering").hide();
    $("#" + id + " ." + lang).show();
    var found = 1;
    //Checking if next value is contain the content
    while (found) {
      element = "#" + id + " ." + lang + ".tickering " + thkclass + ":nth-child(" + pos + ")";
      if ($(element).html() == "" && $(element).length) {
        pos = pos + 1;
      } else {
        found = 0;
      }
    }
    //Showing the value
    if ($(element).length) {
      $(element).show(500);
    } else {
      if ($("#" + id + " ." + lang + ".tickering div").length) {
        textWidgetMarqueeThickering(id, count, lang, 1, delay, direction, stop);
        return false;
      } else {
        return false;
      }
    }
    ///$("#"+id+" .tickering div:nth-child("+pos+")").show("slide", { direction: direction }, 1000);
    //It will wait based on user define values before changing the next item
    textWidgetMarqueeThickeringVar[id] = setTimeout(function() {
      pos = pos + 1;
      if ($(element).length) {
        textWidgetMarqueeThickering(id, count, lang, pos, delay, direction, stop);
      } else {
        textWidgetMarqueeThickering(id, count, lang, 1, delay, direction, stop);
      }
    }, delay);
  }
}

