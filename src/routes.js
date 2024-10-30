module.exports = routesConfig;

/** @ngInject */
function routesConfig($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider) {
  $urlMatcherFactoryProvider.strictMode(false);
  $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/404');

  var title = 'Stone Canyon Homes';
  var description = "Put a description here.";

  $stateProvider
    .state('404', {
      url: '/404',
      templateUrl: 'error_pages/404.html',
      data: {
        seo: {
          title: "Sample Preview - 404",
          description: "Sample Preview - 404 Page Not Found",
          h1: "oops!",
          pageImage: "{{pages.404.page_image.contentUrl}}"
        }
      }
    })
    .state('index', {
      url: '/',
      templateUrl: '/presentation/Pages/Index/template.html',
      data: {
        seo: {
          title: title + " - Home",
          description: description,
          h1: "Building Dreams One Home at a Time",
          pageImage: ""
        }
      }
    })
    .state('communities', {
      url: '/communities',
      templateUrl: '/presentation/Community/list.html',
      data: {
        seo: {
          title: title + " - {{community.name}}",
          description: description,
          h1: "Communities",
          pageImage: "{{pages.communities.page_image.contentUrl}}"
        }
      }
    })
    .state('community', {
      url: '/communities/:com_id',
      templateUrl: '/presentation/Community/detail.html',
      data: {
        seo: {
          title: "Sample Preview - {{community.name}}",
          description: description,
          h1: "{{community.name}}",
          pageImage: ""
        }
      }
    })
    .state('plans', {
      url: '/plans',
      templateUrl: '/presentation/Plan/list.html',
      data: {
        seo: {
          title: title + " - {{plan.name}} in {{community.name}}",
          description: description,
          h1: "Floor Plans",
          pageImage: ""
        }
      }
    })
    .state('plan', {
      url: '/plans/:plan_id',
      templateUrl: '/presentation/Plan/detail.html',
      data: {
        seo: {
          title: "Sample Preview - {{plan.name}} in {{community.name}}",
          description: description,
          h1: "{{plan.name}}",
          pageImage: ""
        }
      }
    })
    .state('community-plan', {
      url: '/communities/:com_id/:plan_id',
      templateUrl: '/presentation/Plan/detail.html',
      data: {
        seo: {
          title: "Sample Preview - {{plan.name}} in {{community.name}}",
          description: description,
          h1: "{{plan.name}}",
          pageImage: ""
        }
      }
    })
    .state('homes', {
      url: '/homes',
      templateUrl: '/presentation/Home/list.html',
      data: {
        seo: {
          title: title + " - {{community.name}}",
          description: description,
          h1: "Quick Move-In Homes",
          pageImage: "{{pages.homes.page_image.contentUrl}}"
        }
      }
    })
    .state('home', {
      url: '/homes/:inv_id',
      templateUrl: '/presentation/Home/detail.html',
      data: {
        seo: {
          title: "Sample Preview - {{home.address.streetAddress}}",
          description: description,
          h1: "{{home.address.streetAddress}}",
          pageImage: ""
        }
      }
    })
    .state('about', {
      url: '/about-us',
      templateUrl: '/presentation/Pages/About/template.html',
      data: {
        seo: {
          title: "About Us",
          description: description,
          h1: "Our Story",
          pageImage: "{{pages.about_us.page_image.contentUrl}}"
        }
      }
    }).state('style-guide', {
      url: '/style-guide',
      templateUrl: '/presentation/Pages/StyleGuide/template.html',
      data: {
        seo: {
          title: "Style Guide",
          description: description,
          h1: "Style Guide",
          pageImage: ""
        }
      }
    })
    .state('homebuying-guide', {
      url: '/homebuying-guide',
      templateUrl: 'templates/homebuying-guide.html',
      data: {
        seo: {
          title: "DSLD Homes - Homebuying Guide",
          description: description,
          h1: "Homebuying Guide",
          pageImage: "{{pages.homebuying_guide.page_image.contentUrl}}"
        }
      }
    })
    .state('blogposts', {
      url: '/blog',
      templateUrl: '/presentation/Blog/list.html',
      data: {
        seo: {
          title: "Sample Preview - Blog",
          description: description,
          h1: "Blog",
          pageImage: "/images/laptop.jpg"
        }
      }
    })
    .state('blogpost', {
      url: '/blog/:blog_id',
      templateUrl: '/presentation/Blog/detail.html',
      data: {
        seo: {
          title: title + " - Blog",
          description: description,
          h1: "{{blogpost.title}}",
          pageImage: "/images/laptop.jpg"
        }
      }
    })
    .state('contact', {
      url: '/contact-us',
      templateUrl: '/presentation/Pages/Contact/template.html',
      data: {
        seo: {
          title: title + " - Contact Us",
          description: description,
          h1: "Contact Us",
          pageImage: "{{pages.contact_us.page_image.contentUrl}}"
        }
      }
    })
    .state('warranty', {
      url: '/warranty',
      templateUrl: '/presentation/Pages/Warranty/template.html',
      data: {
        seo: {
          title: title + " - Warranty Request",
          description: description,
          h1: "Warranty Request",
          pageImage: "{{pages.warranty.page_image.contentUrl}}"
        }
      }
    })
    .state('permalink', {
      url: '/{permalink:[0-9a-fA-F]{24,24}}',
      templateUrl: '/presentation/Loading/template.html'
    })
    .state('permalinkCmod', {
      url: '/{com_id:[0-9a-fA-F]{24,24}}/{permalink:[0-9a-fA-F]{24,24}}',
      templateUrl: '/presentation/Loading/template.html'
    })
    .state('clientPage', {
      url: '/{page_id:[0-9a-z-]+}',
      templateUrl: 'presentaton/Pages/ClientPage/template.html',
      data: {
        seo: {
          title: "{{page.meta.name}}",
          description: "{{page.meta.description}}",
          h1: "{{page.meta.header}}",
          pageImage: "{{page.meta.page_image.contentUrl}}"
        }
      }
    });
}
