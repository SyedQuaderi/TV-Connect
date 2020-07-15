$(document).ready(function() {
  //SimpleWeather report
  if ($(".weather-gadget").length) {
    $(".weather-gadget").each(function() {
      var id = $(this).parent().attr("id");
      weather_widget_gadget_script("#" + id);
    });
  }

  //Digital clock
  if ($(".gadget-object .clock").length) {
    $(".gadget-object .clock").each(function() {
      var id = $(this).parent().attr('id');
      digital_clock_gadget_script(id);
    });
  }
});
// Create two variable with the names of the months and days in an array
function digital_clock_gadget_script(id) {
  if (!$(".widget .gadget-object .clock").length) {
    return false;
  }
  var timeCall = null;
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  setInterval(function() {
    //returning null values if current page do not have the clock widget
    if (!$(".widget .gadget-object .clock").length) {
      return false;
    }
    //  ClockControl(function(mDate) {
    var newDate = ClockControl();
    var format = $('#' + id + ' #gadget-date').attr("format");
    if(format == "accor-date"){
      var day = dayNames[newDate.getDay()];
      var mon = monthNames[newDate.getMonth()];
      var minutes = newDate.getMinutes();
      minutes = (minutes < 10 ? "0" : "") + minutes;
      var hours = newDate.getHours();
      hours =  (hours < 10 ? "0" : "") + hours
      var format = day + ", " + mon + " " + newDate.getDate() + " " + hours + ":" + minutes;
      $('#' + id + ' #gadget-date').html(format);
    }else if(format == "accor-date1"){
      var day = dayNames[newDate.getDay()];
      var mon = monthNames[newDate.getMonth()];
      var minutes = newDate.getMinutes();
      minutes = (minutes < 10 ? "0" : "") + minutes;
      var hours = newDate.getHours();
      hours =  (hours < 10 ? "0" : "") + hours
      var format = day + ", " + newDate.getDate() + " " + mon + " " + newDate.getFullYear() + " "+ hours + ":" + minutes;
      $('#' + id + ' #gadget-date').html(format);
    }else{
      if (format != "" && format != undefined) {
        var format1 = format.replace("dd", newDate.getDate()).replace("mm", (newDate.getMonth() + 1)).replace("yyyy", newDate.getFullYear());
        $('#' + id + ' #gadget-date').html(format1);
      } else {
        $('#' + id + ' #gadget-date').html(newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear());
      }
      var seconds = newDate.getSeconds();
      // Add a leading zero to seconds value
      $('#' + id + ' #sec').html((seconds < 10 ? "0" : "") + seconds);
      var minutes = newDate.getMinutes();
      // Add a leading zero to the minutes value
      $('#' + id + ' #min').html((minutes < 10 ? "0" : "") + minutes);
      var hours = newDate.getHours();
      // Add a leading zero to the hours value
      $('#' + id + ' #hours').html((hours < 10 ? "0" : "") + hours);
      //});
    }
  }, 1000);
}

function weather_widget_gadget_script(id) {
  var city = $(id + ' .gadget').attr("city");
  var temp = $(id + ' .gadget').attr("temperature");
  console.log("city : " + city);
  console.log("temp : " + temp)

  $.simpleWeather({
    location: city,
    woeid: '',
    unit: temp,
    success: function(weather) {
      html = '<div class="weather"><i class="icon-' + weather.code + '"></i> ' + weather.temp + '&deg;' + weather.units.temp + '</div>';
      $(id + " .weather-gadget .temperature").html(html);
      html = '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
      html += '<li class="currently">' + weather.currently + '</li>';
      html += '<li>' + weather.wind.direction + ' ' + weather.wind.speed + ' ' + weather.units.speed + '</li></ul>';
      $(id + " .weather-gadget .details").html(html);
    },
    error: function(error) {
      //$(".weather-gadget").html('<p>'+error+'</p>');
    }
  });
}
