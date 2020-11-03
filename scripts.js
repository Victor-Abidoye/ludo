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

  // function colorCodeArr returns an array code for each color
  // The array code are in the order [start, turn, home]
  // start contains the data-place for the color to move from home
  // turn is the data-place for the  entrace to the home for each seed
  // home is the data-place to return  home for each color
function colorCodeArr () {
  if (toMoveColor == 'green') {
    return [0, 50, 52]
  } else if (toMoveColor == 'red') {
    return [13, 11, 57]
  } else if (toMoveColor == 'blue') {
    return [26, 24, 61]
  } else {
     return [39, 37, 66]
    }
  }

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
      stops(b[a])
      stop1(b[c])
      rolled.push(a + 1)
      rolled.push(c + 1)
      console.log(rolled)
      activateSeed = true
      if (canMove(rgby[currentPlayer])) {

      }
      if (a == c && a == 5) {
        activateSeed = false
        nextPlayer(player[currentPlayer])
        $('.roll').prop('disabled', false)
        $('.roll').text('ROLL')
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
      $('#pick').html("")
      toChangeRoller()
      break
    } else {
      return true
    }
  };
}

// toChangeRoller() changes the disables the roll for the current player and enables the action for the next player
// it passes turn in the way
function toChangeRoller () {
  $('.roll').prop('disabled', false)
  $('.roll').text('ROLL')
  activateSeed = false
  player[currentPlayer].forEach((element) => {
    $('.' + element).addClass('hide')
  })
  rolled = []
  changeCurrentPlayer()
  nextPlayer(player[currentPlayer])
}


// This variable holds the true or false value of whether a seed clicked is at home or not
var homeDice = false
// toMoveColor is the selected color to be moved
var toMoveColor

var chosen
// On click on any seed, check if such seed is owned by the current player before performing any operation
$('.inner div:not(.action)').on('click', function () {
  if (
    ($(this).hasClass(player[currentPlayer][0].toLowerCase()) ||
    $(this).hasClass(player[currentPlayer][player[currentPlayer].length - 1].toLowerCase())) && activateSeed == true
  ) {
    if (!rolled.includes(6)) {
      return
    }
    toMoveColor = this.dataset.seedColor
    homeDice = true
    console.log($(this))
    chosen = $(this)
    displayDice()
  }
})


// The sendMove() controls the moving of each seed
function sendMove (num, here) {
  if (homeDice) {
    // if a seed clicked is in stil at home a SIX has to be rolled
    // if this is true the seed should be brought out of the box
    homeDice = false
    if (num == 6 && here != 'here') {
      var storeDataColor = ''
      var a = `<div style="position: absolute; border-radius: 50%; height: 90%; width: 90%; background-color: ${toMoveColor}; border: 1px black solid;"></div>`
      $(chosen).css('display', 'none')
      $(chosen).addClass('remove')
      chosen = ""
      var x = colorCodeArr()
      console.log(x)
      storeDataColor = $(`[data-place=${x[0]}]`).attr('data-color')
      storeDataColor == undefined ? storeDataColor = "" : storeDataColor = storeDataColor
      $(`[data-place=${x[0]}]`).html(a)
      $(`[data-place=${x[0]}]`).attr("data-color", toMoveColor)
      var currentColorPosition = player[currentPlayer].indexOf(toMoveColor[0].toUpperCase() + toMoveColor.substring(1, toMoveColor.length))
      rgby[currentPlayer][currentColorPosition]++
      rolled.splice(rolled.indexOf(num), 1)
      if (kill(storeDataColor, toMoveColor)) {
        $(`[data-place=${x[0]}]`).html("")
        $(`[data-place=${x[0]}]`).attr('data-color', "")
      }
      if (rolled.length == 0) {
        toChangeRoller()
      }
    }
  } else {
    // takes count of the number of times a seed is to move
    var counter = 0
    // this contians the data-color value for the previous seed in a cell box
    var storeDataColor = ""
   // this is updated to contain the content of the HTML content of the box the current seed is to move to
    var previous = ""
    // the check var is a setInterval function that is called every 500ms to change the position of a seed
    var check = setInterval(function () {
      counter++
      // clear current position

      // assign content to be the html content of the seed to be moved
      var content = $(`[data-place=${myPosition}]`).html()

      // replaces the content of the current cell box with its former content
      $(`[data-place=${myPosition}]`).attr('data-color', storeDataColor)
      $(`[data-place=${myPosition}]`).html(previous)
      if (previous == "") {
        $(`[data-place=${myPosition}]`).attr('data-color', "")
      }

      // move seed to the next cell box

      myPosition++
      if (myPosition == 52) {
        myPosition = 0
      }
      previous = $(`[data-place=${myPosition}]`).html()
      console.log(previous)
      storeDataColor = $(`[data-place=${myPosition}]`).attr('data-color')
      $(`[data-place=${myPosition}]`).html(content)
      $(`[data-place=${myPosition}]`).attr('data-color', toMoveColor)
      // clear this interval when seed has moved num number of seeds
      console.log(toMoveColor[0].toUpperCase() +toMoveColor.substring(1,toMoveColor.length))
      console.log(player[currentPlayer][player[currentPlayer].indexOf(toMoveColor[0].toUpperCase() +toMoveColor.substring(1,toMoveColor.length))])
      if (counter == num) {
        clearInterval(check)
        rolled.splice(rolled.indexOf(num), 1)
        storeDataColor == undefined ? storeDataColor = "" : storeDataColor = storeDataColor

        if (kill(storeDataColor, toMoveColor)) {
          $(`[data-place=${myPosition}]`).html("")
          $(`[data-place=${myPosition}]`).attr('data-color', "")
        }
        // if the number clicked is the sum, empty rolled after moving
        if (here == 'here') {
          rolled = []
        }
        if (rolled.length == 0) {
          toChangeRoller()
        }
      }
    }, 500)
  }
}

function kill (x, y) {
  console.log(x)
  console.log(y)
  if (x != "") {
    if (!(player[currentPlayer].includes(x[0].toUpperCase() + x.substring(1, x.length)))) {
      alert(y + " kills " + x)
      var show = $(`.remove.${x}`)[0]
      $(show).css('display', 'inline-block')
      $(show).removeClass('remove')
      var z = []
      var z1 = []
      for (a = 0; a < player.length; a++){
        for (b = 0; b < player[a].length; b++){
          if (player[a][b] == x[0].toUpperCase() + x.substring(1, x.length)) {
            z = [a, b]
            console.log(z)
          } else if (player[a][b] == y[0].toUpperCase() + y.substring(1, y.length))
            z1 = [a, b]
        }
      }
      // var z = player[currentPlayer][player[currentPlayer].indexOf(x[0].toUpperCase() + x.substring(1, x.length))]
      // var z1 = player[currentPlayer][player[currentPlayer].indexOf(y[0].toUpperCase() + y.substring(1, y.length))]
      rgby[z[0]][z[1]]--
      rgby[z1[0]][z1[1]]--
      return true
  }
  }

}

// sum is the total of the 2 dice rolled
var sum

// displayDice() displays as a modal the nunber of the dice rolled for movement
function displayDice () {
  var myMessage = `<button id="myBtn" type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>`
  if (rgby[currentPlayer][0] == 0 && rgby[currentPlayer][rgby[currentPlayer].length - 1] == 0 && rolled.includes(6)) {
    if (rolled[0] == 6) {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
    } else {
      myMessage += `<div class="picNumber"style="background-color: yellow">${rolled[0]}</div>`
    }

    sum = rolled[0]
    for (i = 1; i < rolled.length; i++) {
      sum += rolled[i]
      if (rolled[i] == 6) {
        myMessage += `+<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
      } else {
        myMessage += `+<div class="picNumber" style="background-color: yellow">${rolled[i]}</div>`
      }
    }
    myMessage += `=<div class="picNumber" style="background-color: yellow">${sum}</div>`
  } else if ((rgby[currentPlayer].length == 1 && rgby[currentPlayer][0] == 1) ||
    (rgby[currentPlayer].length == 2 && (rgby[currentPlayer].includes(0) && rgby[currentPlayer].includes(1)))) {

    if (rolled[0] == 6 && homeDice) {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
    } else {
      myMessage += `<div class="picNumber"style="background-color: yellow">${rolled[0]}</div>`
    }
    sum = rolled[0]
    for (i = 1; i < rolled.length; i++) {
      sum += rolled[i]
      if (rolled[i] == 6 && homeDice) {
        myMessage += `+<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
      } else {
        myMessage += `+<div class="picNumber" style="background-color: yellow">${rolled[i]}</div>`
      }
    }
    if (rolled.includes(6) && homeDice){
        myMessage += `=<div class="picNumber" style="background-color: yellow">${sum}</div>`
    } else {
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
    }

  } else {
     myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
     sum = rolled[0]
     for (i = 1; i < rolled.length; i++) {
       sum += rolled[i]
       myMessage += `+<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
     }
     myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
  }
  $('#pick').html(myMessage)
  $('#staticBackdrop').modal('show')
  $('.choose').css('display', 'none')
  $('myBtn').removeClass('hide')
  $('#message').addClass('hide')
}

// contains the data-place value of a cliked cell-box
// which is the position of the current clicked seed in the board
var myPosition

// on click of the any cell-box, check the content of the box to know the seed
// if the seed belongs to the current player and he has rolled the dice, then display update teh position and the tomove color
// also call the displayDice() to show the dice rolled for movement
$('.cell-box').on('click', function () {
  console.log(this.dataset.color)
  if (
    (player[currentPlayer][0].toLowerCase() == this.dataset.color ||
    player[currentPlayer][player[currentPlayer].length - 1].toLowerCase() == this.dataset.color) && rolled.length != 0
  ) {
    myPosition = this.dataset.place
    console.log(myPosition)
    toMoveColor = this.dataset.color
    console.log(toMoveColor)
    displayDice()
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
  function stops(x) {
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


