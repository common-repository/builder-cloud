const app = window.ANGULAR_APP;

function HoaResourceController($state, $stateParams, $filter, hoaPortalService) {
  const ctrl = this;

  ctrl.resource = {};

  hoaPortalService
    .getResources()
    .then((resources) => {
      ctrl.resource = resources
        .find(resource => $filter('machine')($stateParams.page) === $filter('machine')(resource.title));
    });

  ctrl.logout = () => {
    hoaPortalService
      .logout();

    $state.go('hoa-login');
  };
}

app.controller('HoaResourceController', HoaResourceController);
