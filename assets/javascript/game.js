

//----------------------------------------------------------INITIALIZE DATABASE------------------------------------------------------
var config = {
  apiKey: "AIzaSyDmlxzVgqsttBne_yPiYtqXR8MK3exXRLE",
  authDomain: "multiplayer-rps-9647f.firebaseapp.com",
  databaseURL: "https://multiplayer-rps-9647f.firebaseio.com",
  projectId: "multiplayer-rps-9647f",
  storageBucket: "multiplayer-rps-9647f.appspot.com",
  messagingSenderId: "1062129787281"
};
firebase.initializeApp(config);
var database = firebase.database();
var userOneRef = database.ref("/userOne");
var userTwoRef = database.ref("/userTwo");
var chatBoxRef = database.ref("/chatBox");


//----------------------------------------------------------USER OBJECTS------------------------------------------------------


userOne = {
  userName: 'Player 1',
  userChoices: ['rock', 'paper', 'scissors'],
  userSelection: null,
  userScore: 0,
  userSelected: false,
  selectedRock: false,
  selectedPaper: false,
  selectedScissors: false,
  // userScores: function () {},
  // userWins: function () {},
};

userTwo = {
  userName: 'Player 2',
  userChoices: ['rock', 'paper', 'scissors'],
  userSelection: null,
  userScore: 0,
  userSelected: false,
  selectedRock: false,
  selectedPaper: false,
  selectedScissors: false,
  // userScores: function () {},
  // userWins: function () {},
};


//----------------------------------------------------------SET DATABASE------------------------------------------------------



database.ref("/userOne").set({
  userName: 'Player 1',
  userChoices: ['rock', 'paper', 'scissors'],
  userSelection: null,
  userScore: 0,
  userSelected: false,
  selectedRock: false,
  selectedPaper: false,
  selectedScissors: false,
});

database.ref("/userTwo").set({
  userName: 'Player 2',
  userChoices: ['rock', 'paper', 'scissors'],
  userSelection: null,
  userScore: 0,
  userSelected: false,
  selectedRock: false,
  selectedPaper: false,
  selectedScissors: false,
});


database.ref("/chatBox").set({
  chatBox: 'goesHere'
});




//----------------------------------------------------------------------------------------------------------------



// playerOneSelection;
// playerTwoSelection;
playerOnePoints = 0;
playerTwoPoints = 0;
ties = 0;

//----------------------------------------------------------BASE RPS DETERMINE WINNER LOGIC------------------------------------------------------


if (userOne.userSelected === true && userTwo.userSelected === true) {

  if ((playerOneSelection === "rock") || (playerOneSelection === "paper") || (playerOneSelection === "scissors")) {

    if ((playerOneSelection === "rock" && playerTwoSelection === "scissors") ||
      (playerOneSelection === "scissors" && playerTwoSelection === "paper") ||
      (playerOneSelection === "paper" && playerTwoSelection === "rock")) {
      userOne.userScores();
    } else if (playerOneSelection === playerTwoSelection) {
      ties++;
    } else {
      userTwo.userScores();
    }
  }
};

//-------------------------------------------------------CLICK FUNCTION (RPS SELECTION)---------------------------------------------------------

$('#rock').click(function () {
  $(this).css('transform', 'translateX(-50px)');
});


//--------------------------------------------------------GENERATE RPS SELECTION BUTTONS------------------------------------------------------

function generateButtons() {
  for (i = 0; i < userOne.userChoices.length; i++) {
    selectionButton = $('<button>');
    selectionButton.addClass("choices");
    selectionButton.attr('id', userOne.userChoices[i])
    selectionButton.text(userOne.userChoices[i]);
    $("#action-div").append(selectionButton);
  }

};

generateButtons();


//--------------------------------------------------------AUTHENTICATION------------------------------------------------------

//--------------------------------------------------------CREATE ACCOUNT------------------------------------------------------

function createNewAccount() {
  var displayName = $('#display-name-input').val();
  var email = $('#email-input').val();
  var password = $('#password-input').val();

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      user.UpdateProfile({displayName: displayName});
    });
}

//-------------------------------------------------SIGN IN VIA PREVEIOSLY CREATED ACCOUNT-------------------------------

function signInWithEmailAndPassword() {
  var email = $('#email-input').val();
  var password = $('#password-input').val();

  firebase.auth().signInWithEmailAndPassword(email, password);
}

//----------------------------------------------------SIGN IN VIA GOOGLE--------------------------------------------------

function googleSignIn(googleUser) {
  var credential = firebase.auth.GoogleAuthProvider.credential({
    'idToken': googleUder.getAuthResponse().id_token
  });
  firebase.auth().signInWithCredential(credential);
}

//----------------------------------------------------CREATE NEW GAME------------------------------------------------------

gameRef = firebase.database().ref('/games');

function createGame() {
  var user = firebase.auth().currentUser;
  var currentGame = {
    creator: {
      uid: user.uid,
      displayName: user.displayName
    },
    state: STATE.OPEN
    };

    gameRef.push().set(currentGame);
  }

  //----------------------------------------------------USER JOINS GAME------------------------------------------------------

  function joinGame(key) {
    var user = firebase.auth().currentUser;
    var joinGameRef = gameRef.child(key);
    joinGameRef.transction(function(game) {
      if (!game.joiner) {
        game.state = STATE.JOINED;
        game.joiner = {
          uid: user.uid,
          displayName: user.displayName
        }
      }
      return game;
    })
  }

  //-------------Join Game Button Generated -----filter available games------

  gameRef = firebase.database().ref('/games');
  var openGames = gameRef.orderByChild('state').equalTo(STATE.OPEN);
  openGames.on('child_added', function(snapshot) {
    var data = snapshot.val();

    if (data.creator.uid != firebase.auth().currentUser.uid) {
      addJoinGameButton(snapshot.key, data);
    }
  });

  //-------------Remove game after someone has joined----

  openGames.on('child_removed', function(snapshot) {
    var item = $('#' + snapshot.key);
    if (item) {
      item.remove();
    }
  });

//----------------------------------------------------STATE CHANGE LISTENER--------------------------------------------------

function authStateChangeListener(user) {
  if (user) {
    chatBoxRef.onlogin();
    Gamepad.onlogin();
  } else { //signout
    window.location.reload();
  }
}

//----------------------------------------------------STATE CHANGE SWITCH CASE--------------------------------------------------

function gamePlay(key) {
  var joinGameRef = gameRef.child(key);
  joinGameRef.on('value', function(snapshot) {
    var game = snapshot.val();
    switch (game.state) {
      case STATE.JOINED: joinedGeme(gameRef, game); break;
      case STATE.MAKESELECTION:
      // case STATE.:

    }
  })
}

//----------------------------------------------------CHAT BOX CODE-------------------------------------------------------------

function sendChat() {
  chatRef = firebase.database.ref('/chatBox');
  messageField = $('chat-msg-input').val();

  chatRef.push().set ({
    name: firebase.auth().currentUser.displayName,
    message: messageField
  });
}
//-------------CHAT EVENT LISTENER---------------

chatRef = firebase.database().ref('/chatBox');

chatRef.on('child_added', function(snapshot) {
  var message = snapshot.val();
  addChatMessage(message.name, message.message);
});




//--------------------------------SOURCES----------------------------------------------------------------------------

//--------------------------FIREBASE DOCUMENTATION---------------------------------------------------------------------

// https://firebase.google.com/docs/auth/web/manage-users 

// MARK MANDEL SIMINAR
// https://events.google.com/io2016/schedule?sid=16651ff7-0bef-e511-a517-00155d5066d7#day1/16651ff7-0bef-e511-a517-00155d5066d7

// https://howtofirebase.com/firebase-authentication-for-web-d58aad62cf6d

//RPS SINGLE PLAYER IN CLASS ASSIGNMENT
//FRIDGE ASSIGNMENT FOR DYNAMICALLY GENERATED BUTTONS