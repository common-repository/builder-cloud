var APILOC = 'https://api2.mybuildercloud.com/api/v1/';
var id = location.search.split('id=')[1];

var debug = function(str){
  console.log(str);
}
//{{ text | characters:25 }} or {{ text | words:5 }}
angular.module("truncate",[]).filter("characters",function(){return function(r,t,n){if(isNaN(t))return r;if(0>=t)return"";if(r&&r.length>t){if(r=r.substring(0,t),n)for(;" "===r.charAt(r.length-1);)r=r.substr(0,r.length-1);else{var e=r.lastIndexOf(" ");-1!==e&&(r=r.substr(0,e))}return r+"…"}return r}}).filter("splitcharacters",function(){return function(r,t){if(isNaN(t))return r;if(0>=t)return"";if(r&&r.length>t){var n=r.substring(0,t/2),e=r.substring(r.length-t/2,r.length);return n+"..."+e}return r}}).filter("words",function(){return function(r,t){if(isNaN(t))return r;if(0>=t)return"";if(r){var n=r.split(/\s+/);n.length>t&&(r=n.slice(0,t).join(" ")+"…")}return r}});

angular.module('buildercloud', ['angularUtils.directives.dirPagination', 'truncate', 'angular.filter'])

.config(function($sceProvider){
  $sceProvider.enabled(false);
})

.config( ['$compileProvider', function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|sms|tel|data|mailto|chrome-extension):/);
}])

.filter('thumbnail', function(){
  return function(imageURL, width, height, exact, preserve){
    var broken = '';
    if (!exact) exact = '';
    else exact = 'exact/';
    if (!preserve) preserve = '';
    else preserve = 'preserve/';
    if (typeof(imageURL) != 'string') return broken;
    if (imageURL.indexOf('base64') > 0) return imageURL;
    if (!imageURL || btoa == 'undefined' || imageURL.length < 4) return broken;
    if (imageURL.indexOf('cloudfront.net') > 0) return imageURL;
    if (!width || width < 10){
      width = 640;
    }
    if (!height || height < 10){
      height = 480;
    }
    if (imageURL.indexOf('cdn.simplyrets.com') > 0){
      return 'https://bdthumbs.builderdesigns.com/' + preserve + exact + width + '/' + height + '/' + btoa(encodeURI(decodeURIComponent(imageURL)));
    }
    else{
      return 'https://d3nmokoxrgzai9.cloudfront.net/' + preserve + exact + width + '/' + height + '/' + btoa(encodeURI(decodeURIComponent(imageURL)));
    }
  };
})

.filter('evolve', function(){
  return function(plan, community){
    if (!plan || !community){
    }
    if (plan && plan.communities && community && community._id){
      for (var i = 0; i < plan.communities.length; i++){
        if (plan.communities[i].community == community._id || plan.communities[i].community._id == community._id){
          if(plan.communities[i].communityModelProperties){
            for (var key in plan.communities[i].communityModelProperties) {
              if (plan.communities[i].communityModelProperties.hasOwnProperty(key) && plan.communities[i].communityModelProperties[key]) {
                plan[key] = plan.communities[i].communityModelProperties[key];
              }
            }
          }
        }
      }
    }
    return plan;
  };
})

.filter('machine', function(){
  return function(thing){
    if (typeof(thing) == 'object'){
      thing = JSON.stringify(thing);
    }
    return thing.replace(/[^a-z0-9]{1,}/gi, ' ').trim().replace(/ /gi, '-').toLowerCase();
  }
})

.filter('human', function(){
  return function(string){
    if (!string) return string;
    if (typeof(string) == 'number'){
      number = string;
      abs = Math.abs(number);
      if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)){
        // million
        number = Math.floor((number / Math.pow(10, 5))) / 10  + " M's";
      }
      else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)){
        // thousand
        number = ((number / Math.pow(10, 3)) | 0) + "'s";
      }
      return number;
    }
    if (string.constructor == [].constructor){
      return string.join('<br>');
    }
    if (typeof(string) == 'string'){
      string = string.split(/(?=[A-Z])(?=[a-z])/).join(' ').split("_").join(' ').toLowerCase();
      return string.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function($1){
        return $1.toUpperCase();
      });
    }
    return string;
  }
})

.directive('pills', function(){
  return {
    restrict : 'E',
    templateUrl : BUILDERCLOUD.PURL + '/templates/pills.html',
    transclude: true,
    scope : {
      item: "="
    },
    link: function($scope, element, attrs){
      $scope.BUILDERCLOUD = BUILDERCLOUD;

    }
  }
})

.directive('bdMap', function ($timeout, $rootScope, $interpolate, $filter, $templateCache, builderService, $window) {
  return {
    scope: {
      id: '@',
      marker: '=marker',
      markerz: '=markers',
      markerzIcon: '@markersIcon',
      markerIcon: '@',
      popupTemplate: '@'
    },
    link: function ($scope, $element, $attr) {
      var template = $scope.popupTemplate?$templateCache.get($scope.popupTemplate):false;

      var iconSettings = {};
      iconSettings.iconUrl = BUILDERCLOUD.PURL + '/images/' + ($scope.markerzIcon?$scope.markerzIcon:'map_pin_green.png');
      $scope.markerWidth = '40';
      $scope.markerHeight = '40';
      $scope.maxZoom = 15;
      iconSettings.iconSize = [$scope.markerWidth, $scope.markerHeight];
      iconSettings.iconAnchor = [$scope.markerWidth / 2, $scope.markerHeight];
      iconSettings.popupAnchor = [0, -$scope.markerHeight];
      var markerzIcon = L.icon(iconSettings);
      iconSettings.iconUrl = BUILDERCLOUD.PURL + '/images/' + ($scope.markerIcon?$scope.markerIcon:'map_pin_green.png');
      var markerIcon = L.icon(iconSettings);

      var map = L.map($scope.id, {
        minZoom: 5,
        maxZoom: $scope.maxZoom,
        dragging: true,
        touchZoom: true,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });
      new L.Control.Zoom({position: 'bottomright'}).addTo(map);

      L.tileLayer('//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: $scope.maxZoom
      }).addTo(map);

      var resetControl = false;
      var mkrs = false;
      var updateMap = function(){
        if ($scope.markerz[0]){
          $scope.markers = $scope.markerz;
        }
        else{
          $scope.markers = [$scope.markerz];
        }
        if (!$scope.markers || !$scope.markers.length || !$scope.markers[0] || !$scope.markers[0].geoIndexed) return;

        var bounds = new L.latLngBounds();

        if (template){
          var tpl = $interpolate(template);
        }

        var dupes = {};
        mkrs = {};

        for (var i = 0; i < $scope.markers.length; i++){
          if (!$scope.markers[i].geoIndexed || !$scope.markers[i].geoIndexed[0]) continue;
          if (!$scope.markers[i]._id) continue;
          while (dupes[$scope.markers[i].geoIndexed[1] + '-' + $scope.markers[i].geoIndexed[0]] == true){
            $scope.markers[i].geoIndexed[1] += 0.0001;
            $scope.markers[i].geoIndexed[0] += 0.0001;
          }
          dupes[$scope.markers[i].geoIndexed[1] + '-' + $scope.markers[i].geoIndexed[0]] = true;

          mkrs[$scope.markers[i]._id] = L.marker([$scope.markers[i].geoIndexed[1], $scope.markers[i].geoIndexed[0]], {icon: markerzIcon})
          mkrs[$scope.markers[i]._id].addTo(map);

          if (template){
            // If the popup template is an <a href=""></a> tag with no contents the marker itself becomes the link
            var tplTxt = tpl($scope.markers[i]);
            var $tplTxt = jQuery(tplTxt);
            if ($tplTxt[0] && $tplTxt[0].href && $tplTxt[0].href.length && $tplTxt[0].text == ''){
              if ($tplTxt[0].target){
                mkrs[$scope.markers[i]._id].on('click', function(){
                  $window.open($tplTxt[0].href, $tplTxt[0].target);
                });
              }
              else{
                mkrs[$scope.markers[i]._id].on('click', function(){
                  $window.location.href = $tplTxt[0].href;
                });
              }
            }
            else{
              mkrs[$scope.markers[i]._id].bindPopup(tplTxt);
            }
            $rootScope.$on('markerclick: ' + $scope.markers[i]._id, function(e){
              mkrs[e.name.replace('markerclick: ','')].openPopup();
            });
          }
          bounds.extend([$scope.markers[i].geoIndexed[1], $scope.markers[i].geoIndexed[0]]);
        }

        if ($scope.marker){
          mkrs[$scope.marker._id] = L.marker([$scope.marker.geoIndexed[1], $scope.marker.geoIndexed[0]], {icon: markerIcon})
          mkrs[$scope.marker._id].addTo(map);
          bounds.extend([$scope.marker.geoIndexed[1], $scope.marker.geoIndexed[0]]);
        }

        if (bounds._northEast){
          // Add ~10% to North to account for average map pin height.
          bounds._northEast.lat = bounds._northEast.lat + (Math.abs(bounds._northEast.lat - bounds._southWest.lat) * 0.10);
          map.fitBounds(bounds);
        }
        L.Control.Reset = L.Control.extend({
          onAdd: function(map) {
            var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom fa fa-refresh');
            div.style.backgroundColor = 'white';
            div.style.width = '30px';
            div.style.height = '30px';
            div.style.fontSize = '19px';
            div.style.lineHeight = '27px';
            div.style.textAlign = 'center';
            div.content = "+";
            div.onclick = function(){
              if (bounds._northEast){
                map.fitBounds(bounds);
              }
            }
            return div;
          },
          onRemove: function(map){}
        });
        if (resetControl){
          map.removeControl(resetControl);
        }
        L.Control.reset = function(opts) {
          return new L.Control.Reset(opts);
        }
        resetControl = L.Control.reset({ position: 'topright' });
        resetControl.addTo(map);
      }

      var markerTimeoutPromise;
      $scope.$watch(function(){ // check if markers have loaded
        if (!$scope.markerz){
          return 0;
        }
        else if ($scope.markerz.geoIndexed){
          return $scope.markerz.geoIndexed[0];
        }
        else if (!$scope.markerz[0]){
          return 0;
        }
        else if ($scope.markerz.length == 1 && $scope.markerz[0].geoIndexed && $scope.markerz[0].geoIndexed[0]){
          return $scope.markerz[0].geoIndexed[0];
        }
        else if ($scope.markerz.length > 1){
          return $scope.markerz.length;
        }
      }, function(newVal, oldVal){
        if (!newVal) return;
        $timeout.cancel(markerTimeoutPromise);
        markerTimeoutPromise = $timeout(function(){
          updateMap();
        });
      });
    }
  }
})

.factory('builderService', function($http, $rootScope, $filter){
  var service = {};
  var dataLoaded = false;
  service.data = {};
  service.ready = function(handler){
    if (dataLoaded){
      handler();
    }
    $rootScope.$on("builderService", handler);
  }

  service.go = function(){
    if (!BUILDERCLOUD.BID) return false;
    var url = APILOC + 'builders?where={"_id":"' + BUILDERCLOUD.BID + '"}';
    $http.get(url, {cache: true}).then(function(response){
      service.data = response.data._items[0];
      dataLoaded = true;
      $rootScope.$broadcast('builderService');
    });
  }

  service.tweakUniqueName = function(items){
    var tweak = function(str){
      return str.replace('-by-' + $filter('machine')(service.data.name), '');
    }
    if (typeof(items) == 'string'){
      items = tweak(items);
    }
    else if (items.constructor == [].constructor){
      for (i = 0; i < items.length; i++){
        items[i] = service.tweakUniqueName(items[i]);
      }
    }
    else if (typeof(items) == 'object'){
      if(items.hasOwnProperty('uniqueName')){
        items.uniqueName = tweak(items.uniqueName);
      }
    }
    return items;
  }
  service.go();
  return service;
})

.factory('communitiesService', function($http, $rootScope, builderService, $filter){
  var service = {};
  var dataLoaded = false;
  service.data = [];
  service.schools = [];
  service.ready = function(handler){
    if (dataLoaded){
      handler();
    }
    $rootScope.$on("communitiesService", handler);
  }
  service.go = function(){
    var url = APILOC + 'communities?where={"published":true,"builder":"' + builderService.data._id + '"}&max_results=9999';
    $http.get(url, {cache: true}).then(function(response){
      builderService.tweakUniqueName(response.data._items);
      response.data._items.forEach(function(com){
        com.status = $filter('human')(com.status);
        com.address.postalCodeFive = com.address.postalCode.slice(0,5);
        if (com.schools){
          service.schools = service.schools.concat(com.schools);
        }
      });
      service.data = response.data._items;
      dataLoaded = true;
      $rootScope.$broadcast('communitiesService');
    });
  }
  builderService.ready(service.go);
  return service;
})

.factory('homesService', function($http, $rootScope, builderService){
  var service = {};
  var dataLoaded = false;
  service.data = [];
  service.ready = function(handler){
    if (dataLoaded){
      handler();
    }
    $rootScope.$on("homesService", handler);
  }
  service.go = function(){
    var url = APILOC + 'homes?where={"published":true,"isLot":{"$ne":true},"builder":"' + builderService.data._id + '"}&max_results=9999';
    $http.get(url, {cache: true}).then(function(response){
      builderService.tweakUniqueName(response.data._items);
      service.data = response.data._items;
      dataLoaded = true;
      $rootScope.$broadcast('homesService');
    });
  }
  builderService.ready(service.go);
  return service;
})

.factory('plansService', function($http, $rootScope, builderService){
  var service = {};
  var dataLoaded = false;
  service.data = [];
  service.ready = function(handler){
    if (dataLoaded){
      handler();
    }
    $rootScope.$on("plansService", handler);
  }
  service.go = function(){
    var url = APILOC + 'plans?where={"published":true,"builder":"' + builderService.data._id + '"}&max_results=9999';
    $http.get(url, {cache: true}).then(function(response){
      builderService.tweakUniqueName(response.data._items);
      service.data = response.data._items;
      dataLoaded = true;
      $rootScope.$broadcast('plansService');
    });
  }
  builderService.ready(service.go);
  return service;
})

.factory('cloudDataService', function($rootScope, builderService, homesService, plansService, communitiesService, $filter, $interpolate, $timeout){
  var cloudDataService = {};
  var dataLoaded = false;
  cloudDataService.data = {};
  cloudDataService.ready = function(handler){
    if (dataLoaded){
      handler();
    }
    $rootScope.$on("cloudDataService", handler);
  }

  var link = function(){
    homeCommunityLink();
  }

  var homeCommunityLink = function(){
    for ($h = 0; $h < homesService.data.length; $h++){
      for ($c = 0; $c < communitiesService.data.length; $c++){
        if (homesService.data[$h].containedIn == communitiesService.data[$c]._id){
          homesService.data[$h].containedIn = communitiesService.data[$c];
        }
      }
    }
    communityHomesLink();
  }

  var communityHomesLink = function(){
    for ($c = 0; $c < communitiesService.data.length; $c++){
      communitiesService.data[$c].homes = [];
      for ($h = 0; $h < homesService.data.length; $h++){
        if (homesService.data[$h].containedIn && homesService.data[$h].containedIn._id == communitiesService.data[$c]._id){
          communitiesService.data[$c].homes.push(homesService.data[$h]);
        }
      }
    }
    planCommunitiesLink();
  }
  var planCommunitiesLink = function(){
    for ($p = 0; $p < plansService.data.length; $p++){ // for each plan
      for($i = 0; $i < plansService.data[$p].communities.length; $i++){ // for each community variation
        for ($c = 0; $c < communitiesService.data.length; $c++){ // for each community
          if (plansService.data[$p].communities[$i].community == communitiesService.data[$c]._id){ // community matches community variation
            plansService.data[$p].communities[$i].community = communitiesService.data[$c];
          }
        }
      }
    }
    communityPlansLink();
  }

  var communityPlansLink = function(){
    for ($c = 0; $c < communitiesService.data.length; $c++){
      communitiesService.data[$c].plans = [];
      for ($p = 0; $p < plansService.data.length; $p++){
        for($i = 0; $i < plansService.data[$p].communities.length; $i++){
          if (plansService.data[$p].communities[$i].community._id == communitiesService.data[$c]._id){
            communitiesService.data[$c].plans.push($filter('evolve')(plansService.data[$p], communitiesService.data[$c]));
          }
        }
      }
    }
    homePlanLink();
  }

  var homePlanLink = function(){
    for ($h = 0; $h < homesService.data.length; $h++){
      for ($c = 0; $c < plansService.data.length; $c++){
        if (homesService.data[$h].plan == plansService.data[$c]._id){
          homesService.data[$h].plan = plansService.data[$c];
        }
      }
    }
  }

  cloudDataService.getPlan = function(){
    if (!id) return;
    if (!plansService || !plansService.data || !plansService.data.length) return;
    for (var i = 0; i < plansService.data.length; i++){
      if (plansService.data[i].uniqueName == id) return plansService.data[i];
    }
  }

  cloudDataService.getHome = function(){
    if (!id) return;
    if (!homesService || !homesService.data || !homesService.data.length) return;
    for (var i = 0; i < homesService.data.length; i++){
      if (homesService.data[i].uniqueName == id) return homesService.data[i];
    }
  }

  cloudDataService.getCommunity = function(){
    if (!id) return;
    if (!communitiesService || !communitiesService.data || !communitiesService.data.length) return;
    for (var i = 0; i < communitiesService.data.length; i++){
      if (communitiesService.data[i].uniqueName == id){
        for (var j = 0; j < communitiesService.data[i].schools.length; j++){
          communitiesService.data[i].schools[j]['@type'] = 'GreatSchool';
          communitiesService.data[i].schools[j]._id = communitiesService.data[i].schools[j].gsId;
          communitiesService.data[i].schools[j].geoIndexed = [
            communitiesService.data[i].schools[j].lon,
            communitiesService.data[i].schools[j].lat
          ];
        }
        return communitiesService.data[i];
      }
    }
  }

  builderService.ready(function(){
    cloudDataService.data.builder = builderService.data;
    communitiesService.ready(function(){
      homesService.ready(function(){
        plansService.ready(function(){
          link();
          cloudDataService.data.communities = communitiesService.data;
          cloudDataService.data.schools = communitiesService.schools;
          cloudDataService.data.community = cloudDataService.getCommunity();
          cloudDataService.data.homes = homesService.data;
          cloudDataService.data.home = cloudDataService.getHome();
          cloudDataService.data.plans = plansService.data;
          cloudDataService.data.plan = cloudDataService.getPlan();
          dataLoaded = true;
          $rootScope.$broadcast('cloudDataService');
        });
      });
    });
  });

  return cloudDataService;
})

.controller('CommonController', function($scope, $filter, cloudDataService){
  $scope.BUILDERCLOUD = BUILDERCLOUD;
  $scope.$filter = $filter;
  cloudDataService.ready(function(){
    cloudDataService.data.ready = true;
    Object.assign($scope, cloudDataService.data);

    $scope.homes.order = $scope.homes.order?$scope.homes.order:'price';
    $scope.plans.order = $scope.plans.order?$scope.plans.order:'price';

    $scope.school = function(community){
      if (!$scope.communities.school) return 1;
      for (var i = 0; i < community.schools.length; i++){
        if ($scope.communities.school == community.schools[i].name) return 1;
      }
      return 0;
    }

  });
});

angular.element(document).ready(function() {
  angular.bootstrap(document, ['buildercloud']);
});
