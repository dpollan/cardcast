angular.module('cardcast.new', [
  'ngSanitize'
])

.controller('NewCtrl', function($scope, $sanitize, $location, Service) {

  // Declare message in scope
  $scope.message = '';

  // Function that creates new card
  $scope.createCard = function() {

    // Format the card info to match card model schema
    var cardInfo = {
      title: $scope.title,
      card: $scope.message,
    };

    // Use the createCard function from the Service factory
    Service.createCard(cardInfo)
      .then(function(resp) {
        $location.path('/cards');
      });

  };

  // Function that watches for changes in message
  $scope.changes = function() {

    // If message is empty show Your Card Preview
    if ($scope.message === '') {
      $scope.preview = $sanitize('<h1>Your Card Preview</h1>');
    } else {
      // Else compile the message and set it as preview
      $scope.preview = $sanitize(Service.markDownCompile($scope.message));
    }
  };

  // Function is called initially to set the preview title
  $scope.changes();

});
