'use strict';

/**
 * @ngdoc service
 * @name travel.genericData
 * @description
 * # genericData
 * Factory in the travel.
 */
angular.module('travel')
  .factory('genericData', function ($http) {
    // Service logic
    // ...
    //var middlewareHost = "https://comparebeforebook.herokuapp.com";
    var middlewareHost = "http://127.0.0.1:5000";
      var seatRange = 8;

    var getSeatRange = function () {
      return seatRange;
    };
    var getCabinClasses = function () {
      return [
        {
          "key": "Economy",
          "value": "ECONOMY"
        },
        {
          "key": "PremiumEconomy",
          "value": "PREMIUM ECONOMY"
        },
        {
          "key": "Business",
          "value": "BUSINESS"
        }, {
          "key": "First",
          "value": "FIRST"
        }
      ]
    };
    var getTripTypes = function () {
      return [
        {
          "key": "RET",
          "value": "RETURN"
        },
        {
          "key": "ONE",
          "value": "ONE WAY"
        }/*,
        {
          "key": "MULTI",
          "value": "MULTI-CITY"
        }*/
      ]
    };

    var range = function (start, end) {
      var foo = [];
      for (var i = start; i <= end; i++) {
        foo.push(i);
      }
      return foo;
    };
    var convertTimeToHHMM = function (t) {
      var minutes = t % 60;
      var hour = (t - minutes) / 60;
      var timeStr = (hour + "").lpad("0", 2) + ":" + (minutes + "").lpad("0", 2);
      var date = new Date("2014/01/01 " + timeStr + ":00");
      var hhmm = date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
      return hhmm;
    };
    var parseDateToTime = function (dateString) {
      if (dateString) {
        return moment(dateString, 'YYYY-MM-DDThh:mm:ss').format('LT');
      }
    };
    var getHourString = function (minutes) {
      if (minutes) {
        var hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        var str = "";
        if (hours) {
          str = hours + " Hours ";
        }
        if (minutes) {
          str = str + minutes + " Minutes";
        }
        return str;
      }
    };
    var getShortHourString = function (minutes) {
      if (minutes) {
        var hours = Math.floor(minutes / 60);
        if (hours < 10) {
          hours = '0' + hours.toString();
        }
        minutes = minutes % 60;
        if (minutes < 10) {
          minutes = '0' + minutes.toString();
        }
        var str = "";
        if (hours) {
          str = hours + "H ";
        }
        if (minutes) {
          str = str + minutes + " M";
        }
        return str;
      }
    };
    var getSortOptions = function () {
      return [
        {
          "key": "price",
          "value": "Price per person"
        },
        {
          "key": "duration",
          "value": "Total trip time"
        },
        {
          "key": "outbounddeparttime",
          "value": "Outbound: Departure time"
        },
        {
          "key": "inbounddeparttime",
          "value": "Return: Departure time"
        }
      ]
    };
    var sendEmail = function (info) {
      var url = middlewareHost + "/sendEmail";
      return $http.post(url, info);
    };
    var signUp = function (info) {
      var url = middlewareHost + "/signup";
      return $http.post(url, info);
    };
    // Public API here
    return {
      getSeatRange: getSeatRange,
      getCabinClasses: getCabinClasses,
      getTripTypes: getTripTypes,
      range: range,
      convertTimeToHHMM: convertTimeToHHMM,
      parseDateToTime: parseDateToTime,
      getHourString: getHourString,
      getSortOptions: getSortOptions,
      getShortHourString: getShortHourString,
      middlewareHost: middlewareHost,
      sendEmail : sendEmail,
      signUp : signUp
    };
  });
