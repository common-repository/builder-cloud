const app = window.ANGULAR_APP;

function HoaContactController($state, hoaPortalService) {
  const ctrl = this;
  ctrl.user = hoaPortalService.user;
  ctrl.message = {
    name: ctrl.user.name,
    phone: ctrl.user.phone,
    email: ctrl.user.email,
    comments: '',
  };

  ctrl.submitMessage = () => {
    hoaPortalService
      .contactManagement(ctrl.message)
      .then(() => {
        ctrl.success = true;
      });
  };

  hoaPortalService
    .getPortal()
    .then((portal) => { ctrl.management = portal.management; });
}

app.controller('HoaContactController', HoaContactController);
