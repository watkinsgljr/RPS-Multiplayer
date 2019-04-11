

$(document).ready(function() {





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


//----------------------------------------------------------USER CLASS------------------------------------------------------

class gameUser {
  constructor(displayName, uid) {
  this._uid = uid,  
  this._displayName = displayName,
  this._userChoices = ['rock', 'paper', 'scissors'],
  this._userSelection = null,
  this._userScore = 0,
  this._userSelion = null,
  this._userCreator = false,
  this._userJoiner = false
  // userScores: function () {},
  // userWins: function () {},
  }
};

let userOne = new gameUser("userOne");

// joinerClass = {
//   userName: 'Player 2',
//   userChoices: ['rock', 'paper', 'scissors'],
//   userSelection: null,
//   userScore: 0,
//   userSelected: false,
//   selectedRock: false,
//   selectedPaper: false,
//   selectedScissors: false,
//   userScores: function () {},
//   userWins: function () {},
// };


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


currentUser = firebase.auth().currentUser;

//----------------------------------------------------GLOBAL VARIABLES------------------------------------------------------------

let currentGame;




//----------------------------------------------------------BASE RPS DETERMINE WINNER LOGIC------------------------------------------------------

function selectWinner() {
  let creator = currentGame.creator;
  let joiner = currentGame.joiner;
  if (creator._userSelected === true && joiner._userSelected === true) {

    if ((creator._userSelection === "rock") || (creator._userSelection === "paper") || (creator._userSelection === "scissors")) {

      if ((creator._userSelection === "rock" && joiner._userSelection === "scissors") ||
        (creator._userSelection === "scissors" && joiner._userSelection === "paper") ||
        (creator._userSelection === "paper" && joiner._userSelection === "rock")) {
        creator.userScores();
      } else if (creator._userSelection === joiner._userSelection) {
        ties++;
      } else {
        joiner.userScores();
      }
    }
  };
}


//-------------------------------------------------------CLICK FUNCTION (RPS SELECTION)---------------------------------------------------------

$('#rock').click(function () {
  $(this).css('transform', 'translateX(-50px)');
});


//-------------------------------------------------------------------LOAD DASH-------------------------------------------------------------------

function loadDash() {
  generateCreatorButtons();
  generateJoinerButtons();
  $("creator-score").text(currentGame.creator._userScore);
  $("joiner-score").text(current.Game.joiner._userScore);
  $("joiner-score").empty();
}



//--------------------------------------------------------GENERATE RPS SELECTION BUTTONS------------------------------------------------------

function generateCreatorButtons() {
  let creator = currentGame.creator;
  for (i = 0; i < creator._userChoices.length; i++) {
    selectionButton = $('<button>');
    selectionButton.addClass("choices");
    selectionButton.attr('id', creator._userChoices[i])
    selectionButton.text(creator._userChoices[i]);
    $("#creator-action-div").append(selectionButton);
  }

};

function generateJoinerButtons() {
  let joiner = currentGame.joiner;
  for (i = 0; i < joiner._userChoices.length; i++) {
    selectionButton = $('<button>');
    selectionButton.addClass("choices");
    selectionButton.attr('id', creator._userChoices[i])
    selectionButton.text(creator._userChoices[i]);
    $("#creator-action-div").append(selectionButton);
  }

};



//--------------------------------------------------------AUTHENTICATION------------------------------------------------------

//--------------------------------------------------------CREATE ACCOUNT------------------------------------------------------

$('#register-button').on('click', function createNewAccount() {
  var displayName = $('#modalLRInput15').val();
  var email = $('#modalLRInput12').val();
  var password = $('#modalLRInput13').val();
  var repeatPassword = $('#modalLRInput14').val();
  

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      user = firebase.auth().currentUser;
      user.updateProfile({displayName: displayName});
    });
    $('#modalLRInput15').val("");
    $('#modalLRInput12').val("");
    $('#modalLRInput13').val("");
    $('#modalLRInput14').val("");
    $("#close-button").trigger("click");
    console.log(email);
    console.log(password);
    console.log(user);
});

//-------------------------------------------------SIGN IN VIA PREVEIOSLY CREATED ACCOUNT-------------------------------

$("#login-button").on("click", function signInWithEmailAndPassword(email, password) {
  var email = $('#modalLRInput10').val();
  var password = $('#modalLRInput11').val();
  $('#modalLRInput10').val("")
  $('#modalLRInput11').val("")
  $("#close-button").trigger("click");

  firebase.auth().signInWithEmailAndPassword(email, password);
  console.log(email);
  console.log(password);
  console.log(user);
}

  
);

//----------------------------------------------------SIGN IN VIA GOOGLE--------------------------------------------------

function googleSignIn(googleUser) {
  var credential = firebase.auth.GoogleAuthProvider.credential({
    'idToken': googleUder.getAuthResponse().id_token
  });
  firebase.auth().signInWithCredential(credential);
}

//----------------------------------------------------SIGN OUT--------------------------------------------------------------

$("#log-out-button").on("click", function() {
  firebase.auth().signOut()
  .then(function() {
    // Sign-out successful.
  })
  .catch(function(error) {
    // An error happened
  });
});

//----------------------------------------------------CREATE NEW GAME------------------------------------------------------

$("#new-game-button").on("click", function() {
  gameRef = firebase.database().ref('/games');
  var user = firebase.auth().currentUser;
  // displayName = user.displayName;
  // userid = user.uid;
  let creator = new gameUser("Greg", 155);
  currentGame = {
    creator,
    state: STATE.OPEN
    }; creator._userCreator = true;
    generateCreatorButtons();
    console.log(creator);
    console.log(user);
    // $("#user-one-name").text(currentGame.creator.userName);
    gameRef.push().set(currentGame);
})

  //----------------------------------------------------USER JOINS GAME------------------------------------------------------
  var user = firebase.auth().currentUser;
  function joinGame(gameKey) {
    var joinGameRef = gameRef.child(gameKey);
    let joiner = new gameUser(user.displayName, user.uid)
    joinGameRef.transction()(function(game) {
      if (!game.joiner) {
        game.state = STATE.JOINED;
        game.joiner = joiner;
      } generateJoinerButtons();
      joiner._userJoiner = true;
      console.log(joiner);
      return game;
    })
  }; 

    //---------------------------------------------------------GAME STATES------------------------------------------------------
var STATE = {
  OPEN: 1,
  JOINED: 2,
  CREATOR_SELECT: 3,
  JOINER_SELECT: 4,
  SELECT_WINNER: 5,
  GAME_OVER: 6
};

  //-------------Join Game Button Generated -----filter available games------


  gameRef = firebase.database().ref('/games');
  var openGames = gameRef.orderByChild('state').equalTo(STATE.OPEN);
  openGames.on('child_added', function(snapshot) {
    var data = snapshot.val();
    var gameKey = data.key;

    if (data.creator.uid != firebase.auth().currentUser.uid) {
      addJoinGameButton();
    }
    function addJoinGameButton() {
      var joinGameBtn = $("<button>");
      joinGameBtn.addClass("btn btn-default btn-rounded my-3 join-game-button");
      joinGameBtn.attr("id", gameKey);
      joinGameBtn.text("JOIN GAME");
      $(".item-2").append(joinGameBtn);
      joinGameBtn.on("click", joinGame(gameKey));
  
    };
  });




  //-------------Remove game after someone has joined----

  openGames.on('child_removed', function(snapshot) {
    var item = $('#' + snapshot.key);
    if (item) {
      item.remove();
    }
  });



//----------------------------------------------------STATE CHANGE LISTENER--------------------------------------------------
// firebase.auth().onAuthStateChanged(authStateChangeListener);
// function authStateChangeListener(user) {
//   if (user) {
//     chatBoxRef.onlogin();
//     Game.onlogin();
//   } else { //signout
//     window.location.reload();
//   }
// }

//----------------------------------------------------STATE CHANGE SWITCH CASE--------------------------------------------------

function gamePlay(key) {
  var joinGameRef = gameRef.child(key);
  joinGameRef.on('value', function(snapshot) {
    var game = snapshot.val();
    switch (game.state) {
      case STATE.OPEN: createGame(); break;
      case STATE.JOINED: joinGame(gameRef, game); break;
      case STATE.CREATOR_SELECT: generateButtons(); break;
      // case STATE.JOINER_SELECT: selectWinner(); break;
      case STATE.SELECT_WINNER: announceWinner(); break;
    }
  })
}


  //---------------------------------------------------------CREATOR SELECTION------------------------------------------------------






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

// chatRef = firebase.database().ref('/chatBox');

// chatRef.on('child_added', function(snapshot) {
//   var message = snapshot.val();
//   addChatMessage(message.name, message.message);
// });



});



//--------------------------------SOURCES----------------------------------------------------------------------------

//--------------------------FIREBASE DOCUMENTATION---------------------------------------------------------------------

// https://firebase.google.com/docs/auth/web/manage-users 

// MARK MANDEL SIMINAR
// https://events.google.com/io2016/schedule?sid=16651ff7-0bef-e511-a517-00155d5066d7#day1/16651ff7-0bef-e511-a517-00155d5066d7

// https://howtofirebase.com/firebase-authentication-for-web-d58aad62cf6d

//RPS SINGLE PLAYER IN CLASS ASSIGNMENT
//FRIDGE ASSIGNMENT FOR DYNAMICALLY GENERATED BUTTONS