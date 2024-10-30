const app = window.ANGULAR_APP;

function PlanCardDirective() {
  return {
    restrict: 'E',
    scope: {
      plan: '=',
    },
    templateUrl: '/presentation/Plan/Card/template.html',
    link: function (scope) {
      scope.photos =
        scope.plan.photos
        .concat(scope.plan.elevationPhotos)
      ;
    }
  }
}

app.directive('planCard', PlanCardDirective);
