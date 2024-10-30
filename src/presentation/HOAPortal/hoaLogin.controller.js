import _ from 'lodash';

const app = window.ANGULAR_APP;

function HoaLoginController($state, $filter, hoaPortalService) {
  const ctrl = this;

  ctrl.login = () => {
    ctrl.resetSuccess = null;
    ctrl.resetFailure = null;
    hoaPortalService
      .login(ctrl.email, ctrl.password)
      .then(() => {
        hoaPortalService
          .getResources()
          .then((resources) => {
            const pages = _.keyBy(resources, resource => $filter('machine')(resource.title));

            let toPage = 'home';

            if (!_.has(pages, 'home')) {
              // If no home page exists use first page in collection
              [toPage] = Object.keys(pages);
            }

            $state.go('hoa-page', { page: toPage });
          });
      })
      .catch(() => {
        ctrl.failure = 'Username or Password was incorrect';
      });
  };

  ctrl.passwordReset = () => {
    ctrl.failure = null;
    hoaPortalService
      .requestPasswordReset(ctrl.resetEmail)
      .then(() => {
        ctrl.resetSuccess = 'You will receive an email shortly to reset your password.';
        ctrl.resetFailure = null;
      })
      .catch(() => {
        ctrl.resetSuccess = null;
        ctrl.resetFailure = 'There was an error resetting your password. Please check your email address.';
      });
  };
}

app.controller('HoaLoginController', HoaLoginController);
