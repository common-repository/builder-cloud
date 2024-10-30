const app = window.ANGULAR_APP;

function HOARoutes($stateProvider) {
  $stateProvider
    .state(
      'hoa-login',
      {
        url: '/home-owners',
        templateUrl: '/presentation/HOAPortal/login.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Login',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
      },
    )
    .state(
      'hoa-register',
      {
        url: '/home-owners/register',
        templateUrl: '/presentation/HOAPortal/register.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Registration',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
      },
    )
    .state(
      'hoa-password-reset',
      {
        url: '/home-owners/password-reset/:token',
        templateUrl: '/presentation/HOAPortal/password-reset.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Password Reset',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
      },
    )
    .state(
      'hoa-my-account',
      {
        url: '/home-owners/my-account',
        templateUrl: '/presentation/HOAPortal/account.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner My Account',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
        onEnter: (hoaPortalService, $state) => {
          'ngInject';

          if (!hoaPortalService.isLoggedIn()) {
            $state.go('hoa-login');
          }
        },
      },
    )
    .state(
      'hoa-residents',
      {
        url: '/home-owners/residents',
        templateUrl: '/presentation/HOAPortal/residents.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Residents List',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
        onEnter: (hoaPortalService, $state) => {
          'ngInject';

          if (!hoaPortalService.isLoggedIn()) {
            $state.go('hoa-login');
          }
        },
      },
    )
    .state(
      'hoa-contact',
      {
        url: '/home-owners/contact',
        templateUrl: '/presentation/HOAPortal/contact.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Contact Management',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
        onEnter: (hoaPortalService, $state) => {
          'ngInject';

          if (!hoaPortalService.isLoggedIn()) {
            $state.go('hoa-login');
          }
        },
      },
    )
    .state(
      'hoa-page',
      {
        url: '/home-owners/:page',
        templateUrl: '/presentation/HOAPortal/resources.html',
        controller: 'CommonController',
        data: {
          seo: {
            title: 'HOA Portal | Sample Preview',
            description: 'HOA Portal',
            h1: 'Homeowner Page',
            pageImage: '{{pages.404.page_image.contentUrl}}',
          },
        },
        onEnter: (hoaPortalService, $state) => {
          'ngInject';

          if (!hoaPortalService.isLoggedIn()) {
            $state.go('hoa-login');
          }
        },
      },
    );
}

app.config(HOARoutes);
