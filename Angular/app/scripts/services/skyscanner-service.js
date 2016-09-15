'use strict';

/**
 * @ngdoc service
 * @name travel.skyscannerService
 * @description
 * # skyscannerService
 * Factory in the travel.
 */
angular.module('travel')
    .factory('skyscannerService', function ($http, $rootScope, $q, genericData) {
        var pendingPromises = [];
        var middlewareHost = genericData.middlewareHost;
        var middlewareGetApi = middlewareHost + "/makeget";
        var middlewarePostApi = middlewareHost + "/makepost";
        var middlewarePutApi = middlewareHost + "/makeput";
        //var apiKey = "prtl6749387986743898559646983194";
        var apiUrl = "http://partners.api.skyscanner.net/apiservices";
        var apiVersion = "v1.0";
        var locale = "en-US";
        var country = null;
        var currency = null;
        var countries = null;
        var currencies = null;
        var setCountry = function (code) {
            for (var i = 0; i < countries.length; i++) {
                if (countries[i].Code == code) {
                    country = countries[i];
                    return;
                }
            }
        };
        var getCurrency = function () {
            return currency;
        }
        var getCountry = function () {
            return country;
        }
        var setLocale = function (val) {
            locale = val;
        };
        var setCurrency = function (code) {
            for (var i = 0; i < currencies.length; i++) {
                if (currencies[i].Code == code) {
                    currency = currencies[i];
                    return;
                }
            }
        };

        var getSuggestedLocationsUrl = function (query) {
            //return apiUrl + "/autosuggest/" + apiVersion + "/" + country.Code + "/" + currency.Code + "/" + locale + "?apiKey=" + apiKey;
            if (country && currency) {
                return middlewareGetApi + "?method_url=" + "/autosuggest/" + apiVersion + "/" + country.Code + "/" + currency.Code + "/" + locale;
            }
            return;

        };
        var getCurrencies = function () {
            if (currencies == null) {
                //var url = apiUrl + "/reference/" + apiVersion + "/currencies";
                //var promise = $http.get(url, { params: { apiKey: apiKey } });
                var method_url = "/reference/" + apiVersion + "/currencies";
                var promise = $http.get(middlewareGetApi, {params: {method_url: method_url}});
                promise.then(function (data) {
                    currencies = extractCurrencies(data);
                    setCurrency("USD");
                });
                return promise;
            }
            return currencies;
        };
        var getCountries = function () {
            if (countries == null) {
                // var url = apiUrl + "/reference/" + apiVersion + "/countries" + "/" + locale;
                // var promise = $http.get(url, { params: { apiKey: apiKey } });
                var method_url = "/reference/" + apiVersion + "/countries" + "/" + locale;
                ;
                var promise = $http.get(middlewareGetApi, {params: {method_url: method_url}});
                promise.then(function (data) {
                    countries = extractCountries(data);
                    setCountry("US");
                });
                return promise;
            }
            return countries;
        };
        var extractCountries = function (response) {
            return response.data ? response.data["Countries"] : null;
        };
        var extractCurrencies = function (response) {
            return response.data ? response.data["Currencies"] : null;
        };
        var formatSuggestedLocationsRequest = function (query) {
            return {
                query: query
            }
        }
        var formatSuggestedLocationsResponse = function (data) {
            if (data.Places) {
                for (var index in data.Places) {
                    data.Places[index].titleText = getPlaceTitle(data.Places[index]);
                    data.Places[index].smallText = data.Places[index].PlaceName + " (" + data.Places[index].PlaceId.replace("-sky", "") + ")";
                    data.Places[index].largeText = data.Places[index].CountryName;
                }
            }
            return data;
        };

        var getPlaceTitle = function (place) {
            if (place) {
                return place.PlaceName + " (" + place.PlaceId.replace("-sky", "") + ")" + " , " + place.CountryName;
            }
            return "";
        }
        var convertToAPIDateFormat = function (dateString) {
            return moment(dateString, "MM/DD/YYYY").format("YYYY-MM-DD");
        }
        var getSearchRequestDto = function (searchObj) {
            var output = {};
            output.originplace = searchObj.leavingFrom;//.originalObject.PlaceId;
            output.destinationplace = searchObj.goingTo;//.originalObject.PlaceId;
            output.outbounddate = convertToAPIDateFormat(searchObj.fromDate);
            if (searchObj.toDate) {
                output.inbounddate = convertToAPIDateFormat(searchObj.toDate);
            }
            if (searchObj.cabinClass) {
                output.cabinclass = searchObj.cabinClass;
            }
            if (searchObj.adults) {
                output.adults = searchObj.adults;
            }
            if (searchObj.kids) {
                output.children = searchObj.kids;
            }
            if (searchObj.infants) {
                output.infants = searchObj.infants;
            }
            if (searchObj.groupPricing) {
                output.groupPricing = searchObj.groupPricing;
            }
            return output;
        }
        var createSearchSession = function (searchObj) {
            var method_url = "/pricing/v1.0";
            var dto = getSearchRequestDto(searchObj);
            dto.locale = locale;
            dto.currency = currency.Code;
            dto.country = country.Code;
            dto.grouppricing = "yes";
            var deferredAbort = $q.defer();
            var promise = $http.post(middlewarePostApi + "?method_url=" + method_url, {
                data: dto,
                timeout: deferredAbort.promise
            });
            pendingPromises.push(deferredAbort);
            return promise;
        }
        var getSearchSessionUrl = function (response) {
            var url = response.headers().location;
            // We only need the last part of url to make the request
            return url ? url.replace(apiUrl, "") : null;
        }
        var getBookingDetailsUrl = function (response) {
            var url = response.headers().location;
            // We only need the last part of url to make the request
            return url ? url.replace(apiUrl, "") : null;
        }
        var getTimeFromMinutes = function (minutes) {
            return moment().startOf('day')
                .minutes(minutes)
                .format('HH:mm');
        }
        var getSearchData = function (sessionUrl, directFlights, filter) {
            var params = {method_url: sessionUrl}
            if (filter) {
                params.stops = filter.flightStops;
                var airlines = filter.airlines;
                var airlinesString = '';
                var excludedAirlines = ['!%', '!$', '!/', '!\\', '!*', '!ˆ', '!_'];
                //console.log(airlines);
                for (var index in airlines) {
                    if (!airlines[index].set && airlines[index].code != '' && excludedAirlines.indexOf(airlines[index].code) == -1) {
                        airlinesString = airlinesString + airlines[index].code + ";";
                    }
                }
                airlinesString = airlinesString.substring(0, airlinesString.length - 1);
                if (airlinesString[airlinesString.length - 1] == ';') {
                    airlinesString = airlinesString.substring(0, airlinesString.length - 1);
                }
                airlinesString = airlinesString.replace(';;', ';');
                if (airlinesString.length > 0) {
                    params.excludecarriers = airlinesString;
                }

                if (filter.sorttype) {
                    params.sorttype = filter.sorttype;
                    params.sortorder = 'asc';
                }
                params.outbounddepartstarttime = getTimeFromMinutes(filter.departureTimes.outbound.min);
                params.outbounddepartendtime = getTimeFromMinutes(filter.departureTimes.outbound.max)
                params.inbounddepartstarttime = getTimeFromMinutes(filter.departureTimes.return.min);
                params.inbounddepartendtime = getTimeFromMinutes(filter.departureTimes.return.max);
            }
            if (directFlights) {
                params.stops = 0;
            }
            var deferredAbort = $q.defer();
            var promise = $http.get(middlewareGetApi, {params: params, timeout: deferredAbort.promise});
            pendingPromises.push(deferredAbort);
            return promise;
        }

        var createBookingSession = function (legObject) {
            if (legObject) {
                var bookingLink = legObject.BookingDetailsLink.Uri;
                bookingLink = bookingLink.replace('/apiservices/', '');
                var outboundLegId = legObject.OutboundLegId;
                var inboundLegId = legObject.InboundLegId;
                var data = {};
                data.OutboundLegId = outboundLegId;
                if (inboundLegId) {
                    data.InboundLegId = inboundLegId;
                }
                var deferredAbort = $q.defer();
                var promise = $http.put(middlewarePutApi + "?method_url=" + bookingLink, {
                    data: data,
                    timeout: deferredAbort.promise
                });
                pendingPromises.push(deferredAbort);
                promise.then(null, function (error) {
                    console.log(bookingDetailsUrl);
                    console.log("Error encountered while creating booking session");
                });
                return promise;
            }
            return;
        }
        var getBookingDetails = function (bookingDetailsUrl) {
            if (bookingDetailsUrl) {
                var deferredAbort = $q.defer();
                var promise = $http.get(middlewareGetApi + "?method_url=" + bookingDetailsUrl, {timeout: deferredAbort.promise});
                pendingPromises.push(deferredAbort);
                promise.then(null, function (error) {
                    console.log(bookingDetailsUrl);
                    console.log("Error encountered while creating booking session");
                })
                return promise;
            }
        }
        /**
         *
         * Cancel All Pending Promises
         */
        var cancelPromises = function () {
            console.log('State Changed- Cancelling pending requests');
            //console.log(pendingPromises);
            //console.log('State Changed');
            //var canceller = $q.defer();
            for (var index in pendingPromises) {
                // if (pendingPromises[index].then) {
                //   canceller.resolve(pendingPromises[index]);
                // }
                if (pendingPromises[index].resolve) {
                    pendingPromises[index].resolve()
                }
            }
            pendingPromises = [];
        };


        // Public API here
        return {
            setCountry: setCountry,
            getCountry: getCountry,
            setLocale: setLocale,
            setCurrency: setCurrency,
            getCurrency: getCurrency,
            getCountries: getCountries,
            getCurrencies: getCurrencies,
            extractCountries: extractCountries,
            extractCurrencies: extractCurrencies,
            getSuggestedLocationsUrl: getSuggestedLocationsUrl,
            formatSuggestedLocationsRequest: formatSuggestedLocationsRequest,
            formatSuggestedLocationsResponse: formatSuggestedLocationsResponse,
            createSearchSession: createSearchSession,
            getSearchSessionUrl: getSearchSessionUrl,
            getSearchData: getSearchData,
            getBookingDetailsUrl: getBookingDetailsUrl,
            createBookingSession: createBookingSession,
            getBookingDetails: getBookingDetails,
            getPlaceTitle: getPlaceTitle,
            cancelPromises: cancelPromises,
            middlewareHost: middlewareHost
        };
    });
