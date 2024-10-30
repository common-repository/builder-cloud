/* eslint-disable no-param-reassign */
import _ from 'lodash';

function CommonController(
  $scope, $state, $stateParams, $filter, $document,
  websiteService, communitiesService, homesService, plansService, $timeout, $rootScope,
  cloudDataService, favoritesService, hashtagHacks, $window, $localStorage,
) {
  'ngInject';

  debug('CommonController');
  $scope.$state = $state;
  $scope.CommonController = $scope;
  $scope.$filter = $filter;
  $scope.$stateParams = $stateParams;
  $scope.pages = {};
  $scope.widgets = {};
  $scope.menus = {};
  $scope.favorites = favoritesService;
  $scope.innerWidth = $window.innerWidth;
  $scope.$window = $window;
  $scope.websiteService = websiteService;
  $scope.getVideoId = $window.getVideoId;
  $scope._ = _; // because _ should just be part of javascript

  // Permalink handles links from external feeds, blogs, etc.
  // :id permalink should always redirect to the detail page
  // this may need to be customized for each site since URL structure varies
  cloudDataService.ready(() => {
    if ($stateParams.permalink) {
      $timeout(() => {
        let com = false;
        for (let i = 0; i < $scope.homes.length; i += 1) {
          if ($scope.homes[i]._id === $stateParams.permalink) {
            $state.go('home', { inv_id: $scope.homes[i].uniqueName, com_id: $scope.homes[i].containedIn.uniqueName }, { location: 'replace' });
            return;
          }
        }
        for (let i = 0; i < $scope.communities.length; i += 1) {
          if ($scope.communities[i]._id === $stateParams.permalink) {
            $state.go('community', { com_id: $scope.communities[i].uniqueName, com_area: $filter('machine')($scope.communities[i].area.name) }, { location: 'replace' });
            return;
          }
          if ($scope.communities[i]._id === $stateParams.com_id) {
            com = $scope.communities[i];
          }
        }
        for (let i = 0; i < $scope.plans.length; i += 1) {
          if ($scope.plans[i]._id === $stateParams.permalink) {
            $state.go('plan', { plan_id: $scope.plans[i].uniqueName, com_id: com.uniqueName }, { location: 'replace' });
            return;
          }
        }
        $state.go('404', {}, { location: 'replace' });
      });
    }
  });
  // Example of using localStorage or sessionStorage in scope
  // <input ng-model="$storage.string" />
  // <input type="number" ng-model="$storage.integer" />
  $scope.$storage = $localStorage;

  // Populate scope with cloud data
  // call update() to manually refresh
  cloudDataService.initScope($scope);

  // Scrolls container to the given jQuery selector smoothly
  // Use this function instead of <a href="#target">
  // Example: <a href ng-click="scroll('#target')">
  $scope.scroll = (selector, offset, container, delay) => {
    offset = offset || 0;
    container = container || 'body, html'; // body for chrome, html for firefox
    delay = delay || 300;
    selector = jQuery(selector)
      .offset().top;
    jQuery(container)
      .animate({
        scrollTop: selector + offset,
      }, delay);
  };
  // functions

  // filters
  $scope.urlFilter = (item) => {
    if (!$scope.com_stateFilter(item)) return 0;
    if (!$scope.com_areaFilter(item)) return 0;
    return 1;
  };

  $scope.com_stateFilter = (item) => {
    if (!$stateParams.com_state || !item || !item.address || !item.address.addressRegion) return 1;
    if ($scope.stateMatch(item.address.addressRegion, $stateParams.com_state)) return true;
    return 0;
  };

  $scope.stateMatch = (state1, state2) => {
    debug(`stateMatch ${state1} ${state2}`);
    if (!state1) return false;
    if (!state2) return false;
    state1 = state1.replace(/-/g, ' ');
    state2 = state1.replace(/-/g, ' ');
    if ($filter('stateName')(state1)
      .toLowerCase() === state2.toLowerCase()) return true;
    if ($filter('stateAbbr')(state1)
      .toLowerCase() === state2.toLowerCase()) return true;
    return false;
  };

  $scope.com_areaFilter = (item) => {
    if (!item || !$stateParams.com_area) return 1;
    if (item.area && item.area.name && $filter('machine')(item.area.name) !== $stateParams.com_area) {
      return 0;
    }
    if (item.containedIn && item.containedIn.area && item.containedIn.area.name && $filter('machine')(item.containedIn.area.name) !== $stateParams.com_area) {
      return 0;
    }
    return 1;
  };

  // Communities in the same area.
  // Used for previous/next community on community detail page
  $scope.sameArea = (itm) => {
    if ($scope.community && itm.area._id === $scope.community.area._id) return true;
    return false;
  };
  // filters

  $scope.pageImage = () => {
    const background = {};
    if (!$scope.seo) return undefined;
    if ($scope.seo.pageImage) {
      background['background-image'] = `url("${$scope.seo.pageImage}")`;
    }

    return background;
  };

  // Scroll to top on every 'update'
  $scope.$on('update', () => {
    debug('scrollTop');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  // Google analytics pageview on 'update'
  // update should fire on any seo-relevant changes to the state
  // hashtag links, tabs, area drop-downs, etc
  $scope.$on('update', () => {
    if (typeof (ga) === 'function') {
      $timeout(() => {
        ga('send', 'pageview');
      });
    }
    if (typeof (LassoCRM) === 'object') {
      $timeout(() => {
        LassoCRM.tracker.setPageTitle(document.title);
        LassoCRM.tracker.track();
      });
    }
  });

  websiteService.communityLimit = 20;
  websiteService.homeLimit = 20;
  websiteService.comPlanLimit = 6;
  websiteService.comHomeLimit = 6;
  websiteService.mapVisible = true;
  websiteService.mapTileUrl = 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
}

module.exports = CommonController;
