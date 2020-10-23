// $(document).ready(function () {
  // Activates modal to diplay form for players to choose color
$('#staticBackdrop').modal('show')

  // On changing the selected option, all options should be visible and then every selected option should be hidden
  $('select').change(function () {
    // All options should be visible
    $('select').children().css('display', 'inline')
    // for each selected color, display is set to hide to prevent it from being chosen again
    $('select')
      .find('option:selected')
      .each(function () {
        var color = $(this).text()
        // if any option is selected and is not '--Choose a color--' hide that option
        $('select')
          .children()
          .each(function () {
            if (this.innerHTML == color && color != '--Choose a color--') {
              $(this).hide()
            }
          })
      })
  })

// player contains an array player color array
var player
// Sets the first player index to 0 at the beginning of the game
var currentPlayer = 0
// an array to contain the number of seeds a current player has outside the home
var rgby = []
// keeps the record of digits rolled on dice
var rolled = []
// activateSeed is set to false and is set to true to enable seed selection at the END of rollin the dice
var activateSeed = false

//setPlayers() helps fill the player array
  function setPlayers () {
    player = [
      [$('#playerOne1 option:selected').text(),
      $('#playerOne2 option:selected').text()],
      [$('#playerTwo1 option:selected').text(),
      $('#playerTwo2 option:selected').text()],
      [$('#playerThree option:selected').text()],
      [$('#playerFour option:selected').text()]
    ]
    // creare a cleaner player array with each array in the player array has only the player's color
    for (i = 0; i < player.length; i++){
      for (j = 0; j < player[i].length; j++){
        if (player[i][j] == "--Choose a color--") {
          player[i].splice(j, 1)
          j--
        }
      }
      //  Removes empty array from the player array
      if (player[i].length == 0) {
        player.splice(i, 1)
        i--
      }
    }
    // Creates the rgby array the contains the number of seed in the corridor for each player[color(s)]
    for (k = 0; k < player.length; k++){
      m = []
      for (l = 0; l < player[k].length; l++){
        m.push(0)
      }
      rgby.push(m)
    }
    console.log(player)
    console.log(rgby)
    nextPlayer(player[currentPlayer])
}

// The changeCurrentPlayer() passes turn to the next player in the game
function changeCurrentPlayer () {
  currentPlayer++
  if (currentPlayer == player.length) {
    currentPlayer = 0
  }
}

// Takes in as input an array containing the home colors of the current player and activates those color for rolling
// by hiding the roll button in each
function nextPlayer (x) {
  console.log(x)
  x.forEach(element => {
    $('.' + element).removeClass("hide")
  });
}


  // DICE ROLL  CONTROL
  // array of classes that controls dice dots
  var one = ['faceFive']
  var two = ['faceOne', 'faceNine']
  var three = ['faceOne', 'faceFive', 'faceNine']
  var four = ['faceOne', 'faceThree', 'faceSeven', 'faceNine']
  var five = ['faceOne', 'faceThree', 'faceFive', 'faceSeven', 'faceNine']
  var six = ['faceOne', 'faceThree', 'faceFour', 'faceSix', 'faceSeven', 'faceNine']

  //now() creates a loop that generates a random number that is passed to other functions
$('.roll').on('click', function () {
  // Disables the roll button imediately it is clicked
  $('.roll').prop('disabled', true)
  $('.roll').text('PLAYING')

  // Variables a and b generate are ther random numbers gernerated
  // Variavle c is and array of varibles that are themselves array of classes that controls the dice dots
  var a
  var b
  var c
  var myVar = setInterval(() => {
    a = Math.floor(Math.random() * 6)
    c = Math.floor(Math.random() * 6)
    b = [one, two, three, four, five, six]
    roll(b[a])
    roll1(b[c])
  }, 100)
  setTimeout(() => {
    clearInterval(myVar)
    setTimeout(() => {
      stop(b[a])
      stop1(b[c])
      rolled.push(a + 1)
      rolled.push(c + 1)
      console.log(rolled)
      activateSeed = true
      if (canMove(rgby[currentPlayer])) {
        return
      }
      if (a == c && a == 5) {
        activateSeed = false
        nextPlayer(player[currentPlayer])
        $('.roll').prop('disabled', false)
        $('.roll').text('ROLL')
        // setTimeout(() => {
        //   var div = `<div id="six"></div><div id="six"></div>`
        //   document.getElementById('sixs').innerHTML =
        //     document.getElementById('sixs').innerHTML + div
        //   now()
        // }, 1000)
      }
    }, 100)
  }, 2000)
})

// canMove() takes in as input the rgby(array containing the number of seeds each color has outside)
// If it is not possible for the current player to make any movement, a modal is dropped and the current player is changed
function canMove (playerSeedOut) {
  for (i = 0; i < playerSeedOut.length; i++){
    if (!(playerSeedOut[i] > 0 || rolled.includes(6))) {
      $('#staticBackdrop').modal('show')
      $('#message').removeClass('hide')
      $('.choose').css('display', 'none')
      $('.roll').prop('disabled', false)
      $('.roll').text('ROLL')
      activateSeed = false
      player[currentPlayer].forEach(element => {
        $('.' + element).addClass('hide')
      });
      rolled = []
      changeCurrentPlayer()
      nextPlayer(player[currentPlayer])
      break
    } else {
      return true
    }
  };
}

// On click on any seed, check if such seed is owned by the current player befor performing any operation
$('.inner div').on('click', function () {
  if (
    ($(this).hasClass(player[currentPlayer][0].toLowerCase()) ||
    $(this).hasClass(player[currentPlayer][player[currentPlayer].length - 1].toLowerCase())) && activateSeed == true
  ) {
    alert()
  }
})

  // the roll and roll1() receives random integer input from the now() and displays the appropriate dots on each dice
  function roll(x) {
    for (i = 0; i < x.length; i++) {
      document.getElementById(x[i]).style.visibility = 'visible'
    }

    setTimeout(() => {
      for (i = 0; i < x.length; i++) {
        document.getElementById(x[i]).style.visibility = 'hidden'
      }
    }, 50)
  }

  function roll1(x) {
    for (i = 0; i < x.length; i++) {
      var p = document.getElementsByClassName(x[i])
      p[0].style.visibility = 'visible'
    }

    setTimeout(() => {
      for (i = 0; i < x.length; i++) {
        var p = document.getElementsByClassName(x[i])
        p[0].style.visibility = 'hidden'
      }
    }, 50)
  }

  // the stop() and stop1() receives a random integer input from the now and makes the final dots of the dice roll visible
  function stop(x) {
    for (i = 0; i < x.length; i++) {
      document.getElementById(x[i]).style.visibility = 'visible'
    }
  }

  function stop1(x) {
    for (i = 0; i < x.length; i++) {
      var p = document.getElementsByClassName(x[i])
      p[0].style.visibility = 'visible'
    }
}


// })


