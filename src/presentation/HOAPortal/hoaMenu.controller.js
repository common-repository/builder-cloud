const app = window.ANGULAR_APP;

function HoaMenuController($state, $filter, hoaPortalService) {
  const ctrl = this;

  ctrl.user = hoaPortalService.user;
  ctrl.resources = [];

  hoaPortalService
    .getResources()
    .then((resources) => {
      ctrl.resources = resources.map(resource => ({
        ...resource,
        url: $filter('machine')(resource.title),
      }));
    });

  ctrl.logout = () => {
    hoaPortalService
      .logout();

    $state.go('hoa-login');
  };
}

app.controller('HoaMenuController', HoaMenuController);
