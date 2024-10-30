const app = window.ANGULAR_APP;

function HoaRegisterController($state, $q, $scope, hoaPortalService) {
  const ctrl = this;
  ctrl.user = {
    babysit: false,
    petsit: false,
  };
  ctrl.communities = [];

  function getCommunities() {
    hoaPortalService
      .getPortals()
      .then((portals) => {
        const ids = portals.map(portal => portal.community_id);
        console.log('portalIds', ids);
        ctrl.communities = $scope
          .communities
          .filter(community => ids.indexOf(community._id) !== -1);
      });
  }

  $scope.$watch('communities', (newVal) => {
    if (newVal && newVal.length > 0) {
      getCommunities();
    }
  });


  ctrl.passwordsMatch = () => (
    Object.is(ctrl.user.password, ctrl.user.confirm_password)
  );

  ctrl.register = () => {
    console.log('register', ctrl.RegisterForm, ctrl.user);
    if (!ctrl.RegisterForm.$valid || !ctrl.passwordsMatch()) {
      return;
    }

    hoaPortalService
      .register(ctrl.user)
      .then(() => {
        ctrl.registered = true;
      });
  };
}

app.controller('HoaRegisterController', HoaRegisterController);
