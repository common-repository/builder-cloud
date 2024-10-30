const app = window.ANGULAR_APP;

function HoaPasswordResetController($stateParams, hoaPortalService, jwtHelper) {
  const ctrl = this;
  const token = atob($stateParams.token);

  ctrl.isTokenExpired = jwtHelper.isTokenExpired(token);
  ctrl.payload = jwtHelper.decodeToken(token);

  ctrl.passwordsMatch = () => ctrl.password === ctrl.confirm_password;
  ctrl.submitPasswordReset = () => {
    hoaPortalService.submitPasswordReset(token, ctrl.password);
  };
}

app.controller('HoaPasswordResetController', HoaPasswordResetController);
