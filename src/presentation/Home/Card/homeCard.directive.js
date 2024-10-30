const app = window.ANGULAR_APP;

function HomeCardDirective() {
  return {
    restrict: 'E',
    scope: {
      home: '=',
    },
    templateUrl: '/presentation/Home/Card/template.html',
  }
}

app.directive('homeCard', HomeCardDirective);
