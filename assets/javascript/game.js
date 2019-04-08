

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

//----------------------------------------------------STATE CHANGE LISTENER--------------------------------------------------

function authStateChangeListener(user) {
  if (user) {
    chatBoxRef.onlogin();
    Gamepad.onlogin();
  } else { //signout
    window.location.reload();
  }
}

//----------------------------------------------------CHAT BOX CODE--------------------------------------------------

function sendChat() {
  chatRef = firebase.database.ref('/chatBox');
  messageField = $('chat-msg-input').val();

  chatRef.push().set ({
    name: firebase.auth().currentUser.displayName,
    message: messageField
  });
}