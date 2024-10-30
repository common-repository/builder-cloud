const app = window.ANGULAR_APP;

function AccountFormDirective() {
  return {
    restrict: 'E',
    scope: {
      user: '=',
      isSelf: '=',
      save: '&onSave',
      delete: '&onDelete',
    },
    templateUrl: '/presentation/HOAPortal/account_form.html',
  };
}

app.directive('accountForm', AccountFormDirective);
