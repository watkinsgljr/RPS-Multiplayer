
userOne = {
    userName: 'Player 1',
    userChoices: ['rock', 'paper', 'scissors'],
    userSelection: null,
    userScore: 0,
    userSelected: false,
    selectedRock: false,
    selectedPaper: false,
    selectedScissors: false,
    userScores: function(){

    },
    userWins: function() {

    },
};

userTwo = {
    userName: 'Player 2',
    userChoices: ['rock', 'paper', 'scissors'],
    userSelection: null,
    userScore: 0,
    userSelected = false,
    selectedRock: false,
    selectedPaper: false,
    selectedScissors: false,
    userScores: function(){

    },
    userWins: function() {

    },
};

playerOneSelection;
playerTwoSelection;
playerOnePoints = 0;
playerTwoPoints = 0;
ties = 0;

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
}

