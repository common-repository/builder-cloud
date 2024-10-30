const app = window.ANGULAR_APP;

function BlogCardDirective() {
  return {
    restrict: 'E',
    scope: {
      blog: '=',
    },
    templateUrl: '/presentation/Blog/Card/template.html',
  }
}

app.directive('blogCard', BlogCardDirective);
