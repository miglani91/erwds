'use strict';

/**
 * @ngdoc service
 * @name travel.searchService
 * @description
 * # searchService
 * Factory in the travel.
 */
angular.module('travel')
    .factory('searchService', function (skyscannerService, $state) {
        //Variable to hold the actual recieved data
        var nativeSearchResults;
        // Variable to hold the search data in our app format
        var searchResults;

        var startIndex;
        var endIndex;

        var initialize = function (searchData) {
            if (searchData) {
                nativeSearchResults = searchData;
                searchResults = {};
                searchResults.Agents = nativeSearchResults.Agents ? createObjectFromArray(nativeSearchResults.Agents, 'Id') : {};
                searchResults.Carriers = nativeSearchResults.Carriers ? createObjectFromArray(nativeSearchResults.Carriers, 'Id') : {};
                searchResults.Currencies = nativeSearchResults.Currencies ? createObjectFromArray(nativeSearchResults.Currencies, 'Code') : {};
                searchResults.Legs = nativeSearchResults.Legs ? createObjectFromArray(nativeSearchResults.Legs, 'Id') : {};
                searchResults.Places = nativeSearchResults.Places ? createObjectFromArray(nativeSearchResults.Places, 'Id') : {};
                searchResults.Segments = nativeSearchResults.Segments ? createObjectFromArray(nativeSearchResults.Segments, 'Id') : {};
                searchResults.Itineraries = nativeSearchResults.Itineraries;
                searchResults.Status = nativeSearchResults.Status;
                searchResults.Query = nativeSearchResults.Query;
                // console.log(searchResults);
                //window.searchResults = searchResults;
                return searchResults;
            } else {
                return [];
            }
        };
        var reset = function () {
            console.log("Resetting Search");
            startIndex = null;
            endIndex = null;
            searchResults = null;
            nativeSearchResults = null;
        }
        var getNextPage = function (pagesize, getBookingUrl) {
            console.log("Get Next Page called");
            var length = searchResults.Itineraries.length;
            if (!searchResults || !searchResults.Itineraries) {
                return;
            }
            if (endIndex >= length - 1) {
                return [];
            }
            if (startIndex == undefined || startIndex == null) {
                startIndex = 0;
                endIndex = (length < pagesize) ? length - 1 : pagesize - 1;
            } else {
                startIndex = endIndex + 1;
                endIndex = endIndex + pagesize;
            }
            var arr = [];
            var iternaryData = null;
            var ele = null;
            for (var i = startIndex; i <= endIndex; i++) {
                ele = searchResults.Itineraries[i];
                if (ele) {
                    iternaryData = getIternaryData(ele, getBookingUrl)
                }
                if (iternaryData) {
                    arr.push(iternaryData);
                }
            }
            topResults(arr);
            return arr;
        }
        var getIternaryData = function (iternary, getBookingUrl) {
            var output = {};
            for (var key in iternary) {
                output[key] = iternary[key];
            }
            for (var i in output.PricingOptions) {
                for (var j in output.PricingOptions[i].Agents) {
                    output.PricingOptions[i].Agents[j] = searchResults.Agents[output.PricingOptions[i].Agents[j]];
                }
            }
            var outboundLeg = output.OutboundLegId ? searchResults.Legs[output.OutboundLegId] : null;
            var inboundLeg = output.InboundLegId ? searchResults.Legs[output.InboundLegId] : null;
            if (outboundLeg) {
                var originStation = searchResults.Places[outboundLeg.OriginStation];
                var destinationStation = searchResults.Places[outboundLeg.DestinationStation];
                var timeTaken = outboundLeg.Duration;
                var stops = [];
                for (var i in outboundLeg.Stops) {
                    stops.push(searchResults.Places[outboundLeg.Stops[i]]);
                }
                var carriers = [];
                for (var i in outboundLeg.Carriers) {
                    carriers.push(searchResults.Carriers[outboundLeg.Carriers[i]]);
                }
                output.OutboundLeg = {};
                output.OutboundLeg.OriginStation = originStation;
                output.OutboundLeg.DestinationStation = destinationStation;
                output.OutboundLeg.Duration = timeTaken;
                output.OutboundLeg.Stops = stops;
                output.OutboundLeg.Carriers = carriers;
                output.OutboundLeg.Departure = outboundLeg.Departure;
                output.OutboundLeg.Arrival = outboundLeg.Arrival;
                output.OutboundLeg.Segments = outboundLeg.SegmentIds;
                for (var i in output.OutboundLeg.Segments) {
                    if (output.OutboundLeg.Segments[i] && typeof output.OutboundLeg.Segments[i] != 'object') {
                        output.OutboundLeg.Segments[i] = searchResults.Segments[output.OutboundLeg.Segments[i]];
                        if (typeof output.OutboundLeg.Segments[i].Carrier != 'object') {
                            output.OutboundLeg.Segments[i].Carrier = searchResults.Carriers[output.OutboundLeg.Segments[i].Carrier];
                        }
                        if (typeof output.OutboundLeg.Segments[i].DestinationStation != 'object') {
                            output.OutboundLeg.Segments[i].DestinationStation = searchResults.Places[output.OutboundLeg.Segments[i].DestinationStation];
                        }
                        if (typeof output.OutboundLeg.Segments[i].OriginStation != 'object') {
                            output.OutboundLeg.Segments[i].OriginStation = searchResults.Places[output.OutboundLeg.Segments[i].OriginStation];
                        }
                        if (typeof output.OutboundLeg.Segments[i].OperatingCarrier != 'object') {
                            output.OutboundLeg.Segments[i].OperatingCarrier = searchResults.Carriers[output.OutboundLeg.Segments[i].OperatingCarrier];
                        }
                    }
                }
                if (inboundLeg) {
                    output.InboundLeg = {};
                    output.returnTrip = true;
                    originStation = searchResults.Places[inboundLeg.OriginStation];
                    destinationStation = searchResults.Places[inboundLeg.DestinationStation];
                    timeTaken = inboundLeg.Duration;
                    stops = [];
                    for (var i in inboundLeg.Stops) {
                        stops.push(searchResults.Places[inboundLeg.Stops[i]]);
                    }
                    carriers = [];
                    for (var i in inboundLeg.Carriers) {
                        carriers.push(searchResults.Carriers[inboundLeg.Carriers[i]]);
                    }
                    output.InboundLeg.OriginStation = originStation;
                    output.InboundLeg.DestinationStation = destinationStation;
                    output.InboundLeg.Duration = timeTaken;
                    output.InboundLeg.Stops = stops;
                    output.InboundLeg.Carriers = carriers;
                    output.InboundLeg.Departure = inboundLeg.Departure;
                    output.InboundLeg.Arrival = inboundLeg.Arrival;
                    output.InboundLeg.Segments = inboundLeg.SegmentIds;
                    for (var i in output.InboundLeg.Segments) {
                        if (output.InboundLeg.Segments[i] && typeof output.InboundLeg.Segments[i] != 'object') {
                            output.InboundLeg.Segments[i] = searchResults.Segments[output.InboundLeg.Segments[i]];
                            if (typeof output.InboundLeg.Segments[i].Carrier != 'object') {
                                // if (!searchResults.Carriers[output.InboundLeg.Segments[i].Carrier]) {
                                //   console.log("Carrier Not Found - " + output.InboundLeg.Segments[i].Carrier)
                                // }
                                output.InboundLeg.Segments[i].Carrier = searchResults.Carriers[output.InboundLeg.Segments[i].Carrier];
                            }
                            if (typeof output.InboundLeg.Segments[i].DestinationStation != 'object') {
                                // if (!searchResults.Places[output.InboundLeg.Segments[i].DestinationStation]) {
                                //   console.log("DestinationStation Not Found - " + output.InboundLeg.Segments[i].DestinationStation)
                                // }
                                output.InboundLeg.Segments[i].DestinationStation = searchResults.Places[output.InboundLeg.Segments[i].DestinationStation];
                            }
                            if (typeof output.InboundLeg.Segments[i].OriginStation != 'object') {
                                // if (!searchResults.Places[output.InboundLeg.Segments[i].OriginStation]) {
                                //   console.log("OriginStation Not Found - " + output.InboundLeg.Segments[i].OriginStation)
                                // }
                                output.InboundLeg.Segments[i].OriginStation = searchResults.Places[output.InboundLeg.Segments[i].OriginStation];
                            }
                            if (typeof output.InboundLeg.Segments[i].OperatingCarrier != 'object') {
                                output.InboundLeg.Segments[i].OperatingCarrier = searchResults.Carriers[output.InboundLeg.Segments[i].OperatingCarrier];
                            }
                        }
                    }
                }
                if (output.PricingOptions && !output.PricingOptions[0].DeeplinkUrl && getBookingUrl && $state.current.name == 'search') {

                    makeBooking(output);
                }
                return output;
            }
        };
        var createObjectFromArray = function (arr, keyField) {
            var obj = {};
            var key;
            var value;
            for (var i in arr) {
                key = arr[i][keyField];
                if (key) {
                    value = arr[i];
                    obj[key] = value;
                }
            }
            return obj;
        }

        var getSearchResultsLength = function () {
            return (searchResults && searchResults.Itineraries) ? searchResults.Itineraries.length : 0;
        }
        var refreshCurrentPage = function (pagesize, getBookingUrl) {
            console.log("Refreshing Current Page with startIndex " + startIndex + " and endIndex " + endIndex);

            if (startIndex == undefined || startIndex == null) {
                var length = searchResults.Itineraries.length;
                if (length > 0) {
                    startIndex = 0;
                    endIndex = (length < pagesize) ? length - 1 : pagesize - 1;
                } else {
                    return [];
                }
            }
            var arr = [];
            var ele = null;
            for (var i = 0; i <= endIndex; i++) {
                ele = searchResults.Itineraries[i];
                if (ele) {
                    arr.push(getIternaryData(ele, getBookingUrl));
                }
            }
            return arr;
        }
        var getSearchQuery = function () {
            return searchResults.Query;
        }
        var getCurrencyDetails = function (code) {
            return searchResults.Currencies ? searchResults.Currencies[code] : null;
        }
        var getCarriers = function () {
            return searchResults.Carriers;
        }
        var getAgents = function () {
            return searchResults.Agents;
        }
        var makeBooking = function (leg) {
            var obj = skyscannerService.createBookingSession(leg);
            if (obj) {
                obj.then(function (response) {
                    var bookingDetailsUrl = skyscannerService.getBookingDetailsUrl(response);
                    if (bookingDetailsUrl) {
                        fetchBookingDetails(bookingDetailsUrl, leg);
                    }
                }, function (error) {
                    console.log("Error occured while creating booking session");
                    if (error.status == 410) {
                        console.log("Recreating the session");
                        //createSearchSession();
                        confirm("Your session has expired. Refresh the results?", function () {
                            $state.reload();
                        })

                    } else {
                        console.log(error);
                        if (error.status != -1) {
                            $state.go('home');
                        }
                    }

                })
            }
        };
        var topResults = function (output) {
            output[0].topResults = [];
            var arr = output[0].topResults;
            for (var i = 0; i < output.length; i++) {
                var rem = 5 - arr.length;
                for (var j = 0; j < rem && j < output[i].PricingOptions.length; j++) {
                    var temp = output[i].PricingOptions[j];

                    var isFound = false;
                    for(var k = 0; k < arr.length; k++){
                        if(arr[k].Agents[0].Id === temp.Agents[0].Id){
                            isFound = true;
                        }
                    }
                    if(isFound){
                        continue;
                    }
                    arr.push(temp);
                }
            }
        };

        var fetchBookingDetails = function (bookingDetailsUrl, leg) {
            skyscannerService.getBookingDetails(bookingDetailsUrl).then(function (response) {
                var bookingOptions = response.data.BookingOptions;
                var bookingItems;
                if (bookingOptions) {
                    for (var i in bookingOptions) {
                        bookingItems = bookingOptions[i].BookingItems;
                        for (var j in bookingItems) {
                            if (bookingItems[j].Status == 'Pending') {
                                fetchBookingDetails(bookingDetailsUrl, leg);
                                return;
                            }
                        }
                    }
                    for (var i in bookingOptions) {
                        bookingItems = bookingOptions[i].BookingItems;
                        if (leg.PricingOptions[i]) {
                            leg.PricingOptions[i].DeeplinkUrl = bookingItems[0].Deeplink;
                        }
                    }

                    //console.log(leg);
                }
            }, function (error) {
                console.log("Error occured while getting booking details");
                if (error.status == 410) {
                    console.log("Recreating the session");
                    //createSearchSession();
                    confirm("Your session has expired. Refresh the results?", function () {
                        $state.reload();
                    })

                } else {
                    console.log(error);
                    if (error.status != -1) {
                        $state.go('home');
                    }
                }
            })
        }

        var getIndexByKeyAndValue = function (arr, key, value) {

            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] === value) {
                    return i;
                }
            }
            return -1;
        }
        // Public API here
        return {
            reset: reset,
            initialize: initialize,
            getSearchResultsLength: getSearchResultsLength,
            getNextPage: getNextPage,
            refreshCurrentPage: refreshCurrentPage,
            getSearchQuery: getSearchQuery,
            getCurrencyDetails: getCurrencyDetails,
            getCarriers: getCarriers,
            getAgents: getAgents,
            getIndexByKeyAndValue: getIndexByKeyAndValue
        };
    });
