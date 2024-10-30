const app = window.ANGULAR_APP;

function CommunityCardDirective() {
  return {
    restrict: 'E',
    scope: {
      community: '=',
    },
    templateUrl: '/presentation/Community/Card/template.html',
  }
}

app.directive('communityCard', CommunityCardDirective);
