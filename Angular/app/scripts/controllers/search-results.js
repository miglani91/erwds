'use strict';

/**
 * @ngdoc function
 * @name travel.controller:SearchResultsCtrl
 * @description
 * # SearchResultsCtrl
 * Controller of the travel
 */
angular.module('travel')
    .controller('SearchResultsCtrl', function ($state, $stateParams, skyscannerService, $scope, $interval, searchService, themeService, $timeout, genericData, $rootScope) {
        console.log($stateParams);
        console.log("Controller Called");
        var pagesize = 10;
        var promise;
        var searchResults = null;
        var requestCount = 0;
        var firstRequestMade = false;
        var sessionUrl;
        var queryObj;
        var delimiter = "^";
        var resultsFetched = false;
        /**
         * Parse Search Parameters in URL into a Query Object
         */
        var parseStateParams = function () {
            var locations = $stateParams.locations ? $stateParams.locations.split(delimiter) : null;
            var locationDescs = $stateParams.locationDescs ? $stateParams.locationDescs.split(delimiter) : null;
            var dates = $stateParams.dates ? $stateParams.dates.split(delimiter) : null;
            var who = $stateParams.who ? $stateParams.who.split(delimiter) : null;
            //All Form validations from Home Page to  be put here

            if ((!locations || locations.length != 2) || (!dates || dates.length == 0) || (!who || who.length == 3)) {
                //Invalid Request
            }
            //Validation for infants and kids to be also put here
            queryObj = {};
            queryObj.cabinClass = $stateParams.cabinClass;
            queryObj.directFlights = ($stateParams.directFlights == 'true') ? true : false;
            queryObj.leavingFrom = locations[0];
            queryObj.leavingFromDesc = locationDescs[0];
            queryObj.goingTo = locations[1];
            queryObj.goingToDesc = locationDescs[1];
            queryObj.fromDate = moment(dates[0], 'YYYYMMDD').format('MM/DD/YYYY');
            queryObj.toDate = dates[1] ? moment(dates[1], 'YYYYMMDD').format('MM/DD/YYYY') : null;
            queryObj.adults = who[0];
            queryObj.kids = who[1];
            queryObj.infants = who[2];
            sessionUrl = $stateParams.sessionUrl;
            $scope.queryObj = queryObj;
        };
        /**
         * Set Filters according to Query Object
         */
        var resetFilter = function () {
            var obj = {
                search: {
                    leavingFrom: $scope.queryObj.leavingFromDesc.split(",")[0],
                    fromDate: $scope.queryObj.fromDate,//moment().format('MM/DD/YYYY'),
                    toDate: $scope.queryObj.toDate ? $scope.queryObj.toDate : null,//moment().format('MM/DD/YYYY'),
                    cabinClass: $scope.queryObj.cabinClass,
                    leavingFromObject: null,
                    goingTo: $scope.queryObj.goingToDesc.split(",")[0],
                    adults: parseInt($scope.queryObj.adults),
                    kids: parseInt($scope.queryObj.kids),
                    infants: parseInt($scope.queryObj.infants),
                    goingToObject: null,
                    tripType: $scope.queryObj.toDate ? 'RET' : 'ONE'
                },
                departureTimes: {
                    outbound: {
                        min: 0,
                        max: 1439
                    },
                    return: {
                        min: 0,
                        max: 1439
                    }
                },
                airlines: {},
                sorttype: $scope.sortOptions[0].key
            };

            if ($scope.queryObj.directFlights) {
                obj.directFlights = true;
                obj.flightStops = 0
            } else {
                obj.directFlights = false;
                obj.flightStops = 3
            }
            $scope.filter = obj;
        };
        var createSearchSession = function () {
            resultsFetched = false;
            $scope.loading = true;

            skyscannerService.createSearchSession(queryObj).then(function (response) {
                var url = skyscannerService.getSearchSessionUrl(response);
                if (url) {
                    sessionUrl = url;
                    makeSearchRequest()
                } else {
                    $state.go('home');
                }
            }, function (error) {
                if (error.status != -1) {
                    $state.go('home');
                }
            })
        };
        var makeRequest = function () {
            if (sessionUrl && sessionUrl != '') {
                makeSearchRequest();
            } else {
                createSearchSession();
            }
        };

        var getSearchResults = function (filter) {
            console.log("Search Results Called");
            resultsFetched = false;
            if (sessionUrl) {
                requestCount++;
                $scope.loading = true;
                skyscannerService.getSearchData(sessionUrl, $scope.queryObj.directFlights, filter).then(function (response) {
                    if (response.data) {
                        if (response.data.Status != 'UpdatesComplete') {
                            console.log("Results Pending");
                        } else {
                            promise ? $interval.cancel(promise) : null;
                            console.log("Results Complete");
                            if (resultsFetched) {
                                return;
                            }
                            resultsFetched = true;
                            searchSuccessCallback(response.data);
                            if (!filter) {
                                console.log(Object.keys($scope.carriers).length);
                                //window.carriers = $scope.carriers;
                                for (var index in $scope.carriers) {
                                    $scope.filter.airlines[$scope.carriers[index].Id] = {
                                        code: $scope.carriers[index].Code,
                                        set: true
                                    };
                                }
                                //window.airlines = $scope.filter.airlines
                                console.log(Object.keys($scope.filter.airlines).length);
                            }
                            $scope.loading = false;
                        }
                    }
                }, function (error) {
                    if (error.status == 304) {
                        return;
                    }
                    if (error.status == 410) {
                        createSearchSession();
                    } else {
                        if (error.status != -1) {
                            $state.go('home');
                        }
                    }
                });
            } else {
                console.log('Invalid Invocation of getSearchResults since sessionUrl is null');
                $state.go('home');
            }
        };
        var searchSuccessCallback = function (data) {
            if (!firstRequestMade) {
                searchService.reset();
            }
            searchService.initialize(data);
            setCarriers();
            setAgents();
            if (!firstRequestMade) {
                console.log("First Request -- Loading Next Page in Search Callback");
                firstRequestMade = true;
                setSearchQuery();
                setCarrierFilter(true);
                loadNextPage();
                //setCurrency();
            } else {
                console.log("Not First Request -- Refreshing Current Page");
                refreshCurrentPage();
            }

        };
        var setCurrency = function () {
            $scope.currencyDetails = searchService.getCurrencyDetails($scope.currentCurrency.Code);
        };
        var setCarriers = function () {
            $scope.carriers = searchService.getCarriers();
        };
        var setAgents = function () {
            $scope.agents = searchService.getAgents();
        };
        var loadNextPage = function () {
            var results = searchService.getNextPage(pagesize, resultsFetched);
            if (results && results.length > 0) {
                $scope.searchResults = $scope.searchResults.concat(results);
            }
        };
        var refreshCurrentPage = function () {
            $scope.searchResults = searchService.refreshCurrentPage(pagesize, resultsFetched);
            console.log("The Length of page is " + $scope.searchResults.length);
        };
        var setSearchQuery = function () {
            $scope.searchQuery = searchService.getSearchQuery();
        };
        var refreshSlider = function () {
            $timeout(function () {
                $scope.$broadcast('reCalcViewDimensions');
                $scope.$broadcast('rzSliderForceRender');
            });
        };

        var makeSearchRequest = function (filter) {
            getSearchResults(filter);
            promise = $interval(function () {
                if (!resultsFetched) {
                    getSearchResults(filter);
                }
            }, 5000)
        };


        var getDateStringWithDay = function (date) {
            return moment(date, 'MM/DD/YYYY').format('ddd MMMM Do YYYY');
        };
        var getDateStringWithDay2 = function (date) {
            return moment(date, 'YYYY-MM-DDThh:mm:ss').format('ddd Do MMMM, hh:mm');
        };

        var filterChanged = function () {
            makeRequest();
        };
        var currencyInfoChanged = function () {
            $stateParams.sessionUrl = null;
            sessionUrl = null;
            $scope.searchResults = null;
            makeRequest();
        };
        var filterData = function () {
            skyscannerService.cancelPromises();
            $scope.searchResults = null;
            makeSearchRequest($scope.filter);
        };

        var searchAgain = function () {
            skyscannerService.cancelPromises();
            var modifiedStateParams = angular.copy($stateParams);
            var search = $scope.filter.search;
            var requestToBeMade = false;
            var leavingFromObject = search.leavingFromObject;
            var goingToObject = search.goingToObject;
            var adults = search.adults;
            var kids = search.kids;
            var infants = search.infants;
            var fromDate = moment(search.fromDate, 'MM/DD/YYYY').format('YYYYMMDD');
            var toDate = moment(search.toDate, 'MM/DD/YYYY').format('YYYYMMDD');
            var cabinClass = search.cabinClass;
            var dates = modifiedStateParams.dates ? modifiedStateParams.dates.split(delimiter) : null;
            var who = modifiedStateParams.who ? modifiedStateParams.who.split(delimiter) : null;
            if (leavingFromObject) {
                var locations = modifiedStateParams.locations ? modifiedStateParams.locations.split(delimiter) : null;
                var locationDescs = modifiedStateParams.locationDescs ? modifiedStateParams.locationDescs.split(delimiter) : null;
                locations[0] = search.leavingFromObject.originalObject.PlaceId;
                locationDescs[0] = skyscannerService.getPlaceTitle(search.leavingFromObject.originalObject);
                modifiedStateParams.locations = locations.join(delimiter);
                modifiedStateParams.locationDescs = locationDescs.join(delimiter);
                requestToBeMade = true;
            }
            if (search.tripType != 'RET') {
                toDate = null;
                if (dates.length > 1)
                    modifiedStateParams.dates = dates.splice(1, 1);
                requestToBeMade = true;
            }
            if (goingToObject) {
                var locations = modifiedStateParams.locations ? modifiedStateParams.locations.split(delimiter) : null;
                var locationDescs = modifiedStateParams.locationDescs ? modifiedStateParams.locationDescs.split(delimiter) : null;
                locations[1] = search.goingToObject.originalObject.PlaceId;
                locationDescs[1] = skyscannerService.getPlaceTitle(search.goingToObject.originalObject);
                modifiedStateParams.locations = locations.join(delimiter);
                modifiedStateParams.locationDescs = locationDescs.join(delimiter);
                requestToBeMade = true;
            }

            if (fromDate != dates[0]) {
                requestToBeMade = true;
                dates[0] = fromDate;
                modifiedStateParams.dates = dates.join(delimiter);
            }
            if (toDate != dates[1]) {
                requestToBeMade = true;
                dates[1] = toDate;
                modifiedStateParams.dates = dates.join(delimiter);
            }
            var passengersChanged = false;
            if (adults != parseInt(who[0])) {
                requestToBeMade = true;
                who[0] = adults;
                passengersChanged = true;
            }
            if (kids != parseInt(who[1])) {
                requestToBeMade = true;
                who[1] = kids;
                passengersChanged = true;
            }
            if (infants != parseInt(who[2])) {
                requestToBeMade = true;
                who[2] = infants;
                passengersChanged = true;
            }
            if (passengersChanged) {
                modifiedStateParams.who = who.join(delimiter);
            }
            if (cabinClass != modifiedStateParams.cabinClass) {
                requestToBeMade = true;
                modifiedStateParams.cabinClass = cabinClass;
            }
            if (requestToBeMade) {
                modifiedStateParams.sessionUrl = null;
                searchService.initialize(null);
                $scope.searchResults = null;
                $state.go('search', modifiedStateParams);
            }

        };
        var setCarrierFilter = function (all) {
            for (var index in $scope.carriers) {
                if ($scope.filter.airlines[$scope.carriers[index].Id]) {
                    $scope.filter.airlines[$scope.carriers[index].Id].set = all;
                }
            }

        };
        var init = function () {
            if ($stateParams.cabinClass && $stateParams.dates && $stateParams.cabinClass && $stateParams.directFlights && $stateParams.locations && $stateParams.locationDescs) {
                parseStateParams();
                if (!skyscannerService.getCurrency()) {
                    $scope.$on('APP_READY', makeRequest);
                } else {
                    makeRequest();
                }
            } else {
                console.log("Invalid State Parameters Structure-- Redirect to home");
                $state.go('home');
            }
        };
        var totalCount = function () {
            return searchService.getSearchResultsLength();
        };
        var openFlightDetails = function (leg) {
            console.log(leg);
            $scope.flightDetails = leg;
            $timeout(function () {
                angular.element('#details-modal').modal("show");
            })
        };
        $scope.totalCount = totalCount;
        $scope.openFlightDetails = openFlightDetails;
        $scope.getDateStringWithDay = getDateStringWithDay;
        $scope.getDateStringWithDay2 = getDateStringWithDay2;
        $scope.filterData = filterData;
        $scope.setCarrierFilter = setCarrierFilter;
        $scope.searchAgain = searchAgain;
        $scope.$on('COUNTRY_CHANGED', currencyInfoChanged);
        $scope.$on('CURRENCY_CHANGED', currencyInfoChanged);
        $timeout(function () {
            $scope.$broadcast('rzSliderForceRender');
        }, 1000);
        $scope.timeSliderOptions = {
            floor: 0,
            ceil: 1439,
            step: 1,
            translate: function (value) {
                return genericData.convertTimeToHHMM(value);
            },
            onEnd: filterData
        };
        $scope.refreshSlider = refreshSlider;
        $scope.resetFilter = resetFilter;
        $scope.loadNextPage = loadNextPage;
        $scope.searchResults = [];
        $scope.totalIterations = 0;
        $scope.searchTopResults = [];
        $scope.getSuggestedLocationsUrl = skyscannerService.getSuggestedLocationsUrl;
        $scope.formatSuggestedLocationsRequest = skyscannerService.formatSuggestedLocationsRequest;
        $scope.formatSuggestedLocationsResponse = skyscannerService.formatSuggestedLocationsResponse;
        $scope.cabinClasses = genericData.getCabinClasses();
        $scope.parseDateToTime = genericData.parseDateToTime;
        $scope.getHourString = genericData.getHourString;
        $scope.getShortHourString = genericData.getShortHourString;
        $scope.sortOptions = genericData.getSortOptions();
        $scope.loading = false;
        $scope.makeRequest = makeRequest;
        init();
        resetFilter();
        $rootScope.$on('$stateChangeSuccess', function () {
            console.log("Cancelling promises");
            promise ? $interval.cancel(promise) : promise;
            skyscannerService.cancelPromises();
        });
    });
