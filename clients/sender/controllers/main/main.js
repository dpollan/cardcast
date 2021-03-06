angular.module('cardcast.main', [])

// Set up main controller for Sender.
.controller('MainCtrl', function($scope, $timeout, $location, Service, user, deck) {

  $scope.deck = deck;
  $scope.currentCard = {};

  //toggles popup warning using 'ng-show' in main.html
  $scope.showWarning = false;
  $scope.showDelete = false;
  $scope.username = user;

  // First checks for a session and sees if anyone else is currently casting.
  // Casts the card that invoked it as long as no one else is casting,
  // otherwise triggers the popup warning.
  $scope.showPopup = function(card) {

    // if there is an active session and no one is casting, cast the card
    if (session && !isCasting) {
      console.log(session.status);
      $scope.castCard(card);

    // if there is an active session and someone else is casting show popup
    } else if (session && isCasting) {
      $scope.showWarning = true;
      $scope.currentCard = card;
    } else if (chrome.cast) {

    // if there is no active session request one
      chrome.cast.requestSession(function(currentSession) {
        sessionListener.call(null, currentSession);

        // Provides extra time for the reciever to respond
        $timeout(function() {
          if (!isCasting) {
            $scope.castCard(card);
          } else {
            $scope.showWarning = true;
            $scope.currentCard = card;
          }
        }, 100);

      }, console.log.bind(null, 'onError: '));
    }
  };

  // clears popup warning if user cancels the cast
  $scope.cancelCast = function() {
    $scope.showWarning = false;
  };



  // Sends cast using the card that invoked showPopup. The username tracks who is currently casting
  // Passing the 'clear' parameter stops the current cast and reverts everything to default state.
  $scope.castCard = function(card, clear = false) {
    var message = {
      username: clear ? null : user,
      card: clear ? '<h2>Welcome to CardCast!</h2><br/>Nothing has been casted yet...' : card.card,
      cardId: clear ? null : card._id
    };
    $scope.showWarning = false;
    session.sendMessage(namespace, JSON.stringify(message), console.log.bind(null, 'onSuccess: ', 'Message was sent: ' + message), console.log.bind(null, 'onError: '));
  };

  // Deletes selected card from the database
  $scope.deleteCard = function(card) {
    Service.deleteCard(card)
      .then(function(resp) {
        var index = $scope.deck.indexOf(card);
        $scope.deck.splice(index, 1);
        $scope.showDelete = false;
      });
  };

  $scope.warnDelete = function(card) {
    $scope.showDelete = true;
    $scope.currentCard = card;
  };

  $scope.cancelDelete = function() {
    $scope.showDelete = false;
  };

});
