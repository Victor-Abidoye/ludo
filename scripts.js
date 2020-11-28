// Activates modal that diplays form for each players to choose color
$('#staticBackdrop').modal('show')

// On changing an option, all other options only should be selectable
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

// function colorCodeArr returns an array code for each selectable color
// The array code are in the order [start, turn, home]
// start contains the data-place of the table-cell a particular seed color will will move from home (home exit spot)
// turn is the data-place for the  entrace to the home corridor for each seed
// home is the data-place for the first cell-box of the corridor to the colored seed home
function colorCodeArr (x) {
  if (x == 'green') {
    return [0, 50, 52]
  } else if (x == 'red') {
    return [13, 11, 57]
  } else if (x == 'blue') {
    return [26, 24, 62]
  } else {
     return [39, 37, 67]
    }
}

// player contains an array or each player's color array
var player = []
// Sets the first player index to 0 at the beginning of the game
var currentPlayer = 0
// contain an array that had the number of seeds belonging to the current player that are currently outside the home
var rgby = []
// keeps the record of digits rolled on dice
var rolled = []
// activateSeed is set to false and is set to true to enable seed selection at the END of rolling the dice
var activateSeed = false

// this function returns true to signigy that all the seeds of the opponent(s) are all out of the board
function checkWinner () {
  for (i = 0; i < rgby.length; i++) {
    var a = player[i][0].toLowerCase()
    var b = player[i][player[i].length - 1].toLowerCase()
    // if any player has all his/her seeds out of the house no more seed on the game corrider for each player remove such player from the player[] and rgby[]
    if (rgby[i][0] == 0 & rgby[i][rgby[i].length - 1] == 0 && home[a] == 0 && home[b] == 0) {
      $('.' + player[i][0]).addClass('hide')
      $('.' + player[i][player[i].length - 1]).addClass('hide')
      player.splice(i, 1)
      rgby.splice(i, 1)
      alert("player " + (currentPlayer + 2) + " won")
    }
  }
  if (player.length == 1) {
    return false
  }
  return true
}

//setPlayers() helps fill the player array on starting the game
  function setPlayers () {
    player = [
      [$('#playerOne1 option:selected').text(),
      $('#playerOne2 option:selected').text()],
      [$('#playerTwo1 option:selected').text(),
      $('#playerTwo2 option:selected').text()],
      [$('#playerThree option:selected').text()],
      [$('#playerFour option:selected').text()]
    ]
    // create a cleaner player array with each array in the player array has only the player's color
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
    // If no color was selected by any player, then reload the page
    if (rgby.length == 0) {
      location.reload()
    } else {
      nextPlayer(player[currentPlayer])
    }
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
  // for each seed of the next player, set the cursor properter as pointer
  x.forEach(element => {
    $('.' + element).removeClass("hide")
    $('.' + element.toLowerCase() + 'seed').css('cursor', 'pointer')
    var count = ['One', 'Two', 'Three', 'Four']
    for (i = 0; i < count.length; i++) {
      $(`.${element.toLowerCase()} .inner${count[i]}`).css('cursor', 'pointer')
    }
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
var nine = ['faceOne',  'faceThree', 'faceFour', 'faceFive', 'faceSix', 'faceSeven', 'faceNine']

//now() creates a loop that generates a random number that is passed to other functions
$('.roll').on('click', function () {
  // Disables the roll button imediately it is clicked and changes the content to playing
  $('.roll').prop('disabled', true)
  $('.roll').text('PLAYING')

  // Variables a and c generate are the random numbers gernerated
  // Variavle b is and array of varibles that are themselves array of classes that controls the dice dots
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
      activateSeed = true

      // if a double 6 is rolled, the player is requested to roll again
      if (a == c && a == 5) {
        activateSeed = false
        nextPlayer(player[currentPlayer])
        $('.roll').prop('disabled', false)
        $('.roll').text('ROLL')
      }

      //if a player can move then check other inner condiditions before moving else, change to the next player's turn
      if (canMove(rgby[currentPlayer])) {
        // if the current player cannot make use of any seed on the dice to move, change player's turn of check if a six is rolled and there are seeds at home
        if (!(checkEntry())) {
          var hi = player[currentPlayer][0].toLowerCase()
          var hij = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
          if (rolled.includes(6) && (home[hi] > 0 || home[hij] > 0)) {

          } else {
            toChangeRoller()
            return
          }
        }
      } else {
        $('#staticBackdrop').modal('show')
        $('#message').removeClass('hide')
        $('#pick').css('display', 'none')
        $('.choose').css('display', 'none')
        $('#picks').html("")
        toChangeRoller()
        return
      }
    }, 100)
  }, 2000)
})

// keeps count of the number of seeds at home for each color
var home = {
  blue: 4,
  green: 4,
  red: 4,
  yellow: 4
}

// onclick of a seed by current player, check if it is possible to make movement if not pass turn
function Check () {
  // contains a list of unmovable dice
  var unmovable = []
  var sum = 0
  var x = distanceLeft(myPosition, colorCodeArr(toMoveColor))
  // check for all the rolled dice if anyone is greater than the possible distance to be moved by a current seed, add it to an unmovable array
  for (i = 0; i < rolled.length; i++){
    sum += rolled[i]
    if (rolled[i] > x) {
      unmovable.push(rolled[i])
    }
  }
  if (sum > x) {
    unmovable.push(sum)
  }

  // if the rolled.length + 1 is equal to the unmovable.length then it means there are no possible movenent
  if (rolled.length + 1 == unmovable.length) {

    // if any of the other seeds can be moved check other conditions else change the player if a not rolled or a rolled 6 cannot be moved (no seed at home)
    if (checkEntry()) {
      //return others if the ummovable is greater than 2 else return the unmovable array
      if (unmovable.length == 2) {
        return unmovable
      } else if (unmovable.length == 1) {
        return unmovable
      } else {
        return 'others'
      }
    } else {
      var p = player[currentPlayer][0].toLowerCase()
      var q = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
      if (rolled.includes(6) && (home[p] > 0 || home[q] > 0)) {
        return unmovable
      } else {
        toChangeRoller()
      }
    }
  } else {
    // if you can make all the dice movement then return true else return the unmovable array
    if (unmovable.length == 0) {
      return true
    } else {
      return unmovable
    }
  }
}

// check all the seeds of the current player if there is any possilbe movement with what is rolled then return true
function checkEntry (a) {
  for (h = 0; h < player[currentPlayer].length; h++){
    var x = $(`.${player[currentPlayer][h].toLowerCase() + 'seed'}`)
    for (i = 0; i < x.length; i++) {
      var place = x[i].parentElement.dataset.place
      var my_code = colorCodeArr(player[currentPlayer][h].toLowerCase())
      var distance = distanceLeft(place, my_code)

      // if the parameter passed is the current positon, then skip checking that seed else compare the distance left for each seed with what was rolled
      if (a == place && double[place] == undefined) {
        continue

      } else {
        for (j = 0; j < rolled.length; j++) {
          if (rolled[j] <= distance) {
            return true
          }
        }
      }
    }
  }
  return false
}

// takes the position of the current seed and the colorCodeArr of that color and returns the distance to the end of boxes(the middle box)
function distanceLeft (place, my_code) {
  var distance

  if (place > 51) {
    distance = (my_code[2] + 5) - Number(place)
  } else if (place > my_code[1]) {
    distance = 56 - (Number(place) - (my_code[1] + 2))
  } else if (place < my_code[1]) {
    distance = (my_code[1] - Number(place)) + 6
  } else {
    distance = 6
  }
  return distance
}

// canMove() takes in as input the rgby(array containing the number of seeds each color has outside)
// If it is not possible for the current player to make any movement, a modal is dropped and the current player is changed
function canMove (playerSeedOut) {
  for (i = 0; i < playerSeedOut.length; i++){
    if (!(playerSeedOut[i] > 0 || rolled.includes(6))) {
      continue
    } else {
      return true
    }
  };
  return false
}

// toChangeRoller() changes the disables the roll for the current player and enables the action for the next player
// it passes turn in the way
function toChangeRoller () {
  // first check if there is only one player left in the game, if so end the game and reload
  if (!checkWinner()) {
    alert("Click Ok to to play again")
    location.reload()
    return
  }
  $('.roll').prop('disabled', false)
  $('.roll').text('ROLL')
  activateSeed = false

  // before changeing the current player, make all cursor of both seed outside and at home not-allowed
  player[currentPlayer].forEach((element) => {
    $('.' + element).addClass('hide')
    $('.' + element.toLowerCase() + 'seed').css('cursor', 'not-allowed')
    var count = ['One', 'Two', 'Three', 'Four']
    for (i = 0; i < count.length; i++){
      $(`.${element.toLowerCase()} .inner${count[i]}`).css('cursor', 'not-allowed')
    }
  })
  rolled = []
  changeCurrentPlayer()
  nextPlayer(player[currentPlayer])
}

// This variable holds the true or false value of whether a seed clicked is at home or not
var homeDice = false
// toMoveColor is the selected color to be moved
var toMoveColor
// this is everything about the clicked seed
var chosen

// On click on any seed, check if such seed is owned by the current player before performing any operation
$('.inner div:not(.action)').on('click', function () {
  if (
    ($(this).hasClass(player[currentPlayer][0].toLowerCase()) ||
    $(this).hasClass(player[currentPlayer][player[currentPlayer].length - 1].toLowerCase())) && activateSeed == true && active
  ) {
    Check()
    if (!rolled.includes(6)) {
      return
    }
    toMoveColor = this.dataset.seedColor
    homeDice = true
    chosen = $(this)
    displayDice()
  }
})

//when an home seed is clicked and a sum rolled is selcted insted of 6, the presendMOve breaks the fuction and send a signal to indicate continuity within break
function presendMOve (num) {
  var x = num - 6
  sendMove(6, 1)
  if (num == 6) {
    return
  }
  sendMove(x, 1)
  rolled = []
}

// holds the seed content of a the next cellbox the currently moved seed is to go to
var tempPrev
// holds the seed color of a the next cellbox the currently moved seed is to go to
var tempDataColor
// a variable to signify whether a seed is in movement or not
var active = true

// The sendMove() controls the moving of each seed
function sendMove (num, here) {
  if (homeDice) {
    // if a seed clicked is in stil at home a SIX has to be rolled
    // if this is true the seed should be brought out of the box
    homeDice = false
    if (num == 6 && here != 'here') {
      var storeDataColor = ''
      var a = `<div class="${toMoveColor + 'seed'} ${toMoveColor}" style="position: absolute; border-radius: 50%; height: 90%; width: 90%; border: 1px black solid;"></div>`

      //The selected seed is hidden and a remove class is added to it to indicate its dissaperance
      $(chosen).css('display', 'none')
      $(chosen).addClass('remove')
      chosen = ""

      var x = colorCodeArr(toMoveColor)
      myPosition = x[0]
      storeDataColor = $(`[data-place=${x[0]}]`).attr('data-color')
      storeDataColor == undefined ? storeDataColor = "" : storeDataColor = storeDataColor
      tempPrev = $(`[data-place=${x[0]}]`).html()
      tempDataColor = $(`[data-place=${x[0]}]`).attr('data-color')
      $(`[data-place=${x[0]}]`).html(a)
      $(`[data-place=${x[0]}]`).attr("data-color", toMoveColor)

      var currentColorPosition = player[currentPlayer].indexOf(toMoveColor[0].toUpperCase() + toMoveColor.substring(1, toMoveColor.length))
      rgby[currentPlayer][currentColorPosition]++
      rolled.splice(rolled.indexOf(num), 1)

      // subtact the value of the color moved form the home object
      var hold_home = home[toMoveColor]
      hold_home--
      home[toMoveColor] = hold_home

      // here is an indicator, if set to 1, the movement is continous and no kill or stop is to be made else a kill can be made
      if (here != 1) {
        // when a successful kill has been made the home object is updated and the each cell box initially contianing multiple seed is filled
        if (kill(storeDataColor, toMoveColor)) {
          $(`[data-place=${x[0]}]`).html('')
          $(`[data-place=${x[0]}]`).attr('data-color', '')

          var hold_home2 = home[storeDataColor]
          hold_home2++
          home[storeDataColor] = hold_home2

          // updates the current cell box with the previous seed properties
          if (myPosition in double) {
            $(`[data-place=${myPosition}]`).attr('data-color', double[myPosition][double[myPosition].length - 1])
            $(`[data-place=${myPosition}]`).html(`<div class= '${double[myPosition][double[myPosition].length - 1] + 'seed'} ${double[myPosition][double[myPosition].length - 1]}' style="position: absolute; border-radius: 50%; height: 90%; width: 90%; border: 1px black solid;"></div>`)
            double[myPosition].splice(double[myPosition].length - 1, 1)

            // if the double object with the key as the current data-place is empty then, delente the data-place entry from the double's object
            if (double[myPosition].length == 0) {
              delete double[myPosition]
            }
          }
        }
      } else {
        // if the movement is not continous, the position stays the the home entrance spot
        myPosition = x[0]
      }

      // when the rolled array is empty, pass turn to the next player
      if (rolled.length == 0) {
        toChangeRoller()
      }
    }
  } else {
    active = false
    // takes count of the number of times a seed is to move
    var counter = 0
    // this contians the data-color value for the previous seed in a cell box
    var storeDataColor = ""
   // this is updated to contain the content of the HTML content of the box the current seed is to move to
    var previous = ""

    // the current cell box has multiplse seed, the store data holds the second seed as it's content to be replaced when the seed on top has been moved
    if (myPosition in double) {
      storeDataColor = double[myPosition][double[myPosition].length - 1]
      previous = `<div class='${storeDataColor + 'seed'} ${storeDataColor}' style="position: absolute; border-radius: 50%; height: 90%; width: 90%; border: 1px black solid;"></div>`
      double[myPosition].splice(double[myPosition].length - 1, 1)
      if (double[myPosition].length == 0) {
        delete double[myPosition]
      }
    }

    // If this intended movement is from a continous home exit, then:
    if (here == 1) {
      previous = tempPrev
      storeDataColor = tempDataColor
    }

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

      //reset the position to the turn colorCodeArr value if the position just passed the turn value by 1
      var seedDetails = colorCodeArr(toMoveColor)
      if (myPosition == seedDetails[1] + 1) {
        myPosition = seedDetails[2]
      }

      previous = $(`[data-place=${myPosition}]`).html()
      storeDataColor = $(`[data-place=${myPosition}]`).attr('data-color')
      $(`[data-place=${myPosition}]`).html(content)
      $(`[data-place=${myPosition}]`).attr('data-color', toMoveColor)

      //if a seed has succesfully made it to the middle box, it is totally removed from the box and the rgby[] is updated
      if (myPosition == (seedDetails[2] + 5)) {
        $(`[data-place=${myPosition}]`).html("")
        $(`[data-place=${myPosition}]`).attr('data-color', "")
        var z = []
        for (a = 0; a < player.length; a++) {
          for (b = 0; b < player[a].length; b++) {
            if (player[a][b] == toMoveColor[0].toUpperCase() + toMoveColor.substring(1, toMoveColor.length)) {
              z = [a, b]
            }
          }
        }
        rgby[z[0]][z[1]]--
      }

      // when the seed has made its last num movement, check for a clear the interval for the movemnet and check for kills
      if (counter == num) {
        clearInterval(check)
        rolled.splice(rolled.indexOf(num), 1)
        storeDataColor == undefined ? storeDataColor = "" : storeDataColor = storeDataColor
        active = true

        // if the seed moves into the middle box of the current color seed, then dont't check for kill
        if (!(myPosition == seedDetails[2] + 5)) {
          // when a successful kill has been made the home object is updated and the each cell box initially contianing multiple seed is filled
          if (kill(storeDataColor, toMoveColor)) {
            $(`[data-place=${myPosition}]`).html("")
            $(`[data-place=${myPosition}]`).attr('data-color', "")


            var hold_home2 = home[storeDataColor]
            hold_home2++
            home[storeDataColor] = hold_home2

            // updates the current cell box with the previous seed properties
            if (myPosition in double) {
              $(`[data-place=${myPosition}]`).attr('data-color', double[myPosition][double[myPosition].length - 1])
              $(`[data-place=${myPosition}]`).html(`<div class= '${double[myPosition][double[myPosition].length - 1] + 'seed'} ${double[myPosition][double[myPosition].length - 1]}' style="position: absolute; border-radius: 50%; height: 90%; width: 90%; border: 1px black solid;"></div>`)
              double[myPosition].splice(double[myPosition].length - 1, 1)
              if (double[myPosition].length == 0) {
                delete double[myPosition]
              }
            }
          }
        }

        // if the number clicked is the sum, empty rolled after moving
        if (here == 'here') {
          rolled = []
        }

        // there is still content in the rolled, check if there are possible movement for the current player, if not, pass turn to the next
        if (rolled > 0) {
          if (!checkEntry()) {
            var hi = player[currentPlayer][0].toLowerCase()
            var hij = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
            if (rolled.includes(6) && (home[hi] > 0 || home[hij] > 0)) {

            } else {
              toChangeRoller()
              return
            }
          }
        }

        checkWinner()

        if (rolled.length == 0) {
          toChangeRoller()
        }
      }
      trouble = 0
    }, 500)
  }
}

// contians as key the data-place value of a cell box containing multiple seeds
var double = {}

//takes in as input the previous seed color and the present seed color
// if the previous color does not belong to the current player, a kill has to be made
function kill (x, y) {
  if (x != "") {
    // if seed does not belong to the current player, remove both seed from the cell box and update the rgby[]
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
          } else if (player[a][b] == y[0].toUpperCase() + y.substring(1, y.length))
            z1 = [a, b]
        }
      }
      rgby[z[0]][z[1]]--
      rgby[z1[0]][z1[1]]--

      return true
    } else {
      // update an object array that contains the "data-place" number as key and an array of data-color as value
      if (double[myPosition] == undefined) {
        double[myPosition] = [x]
      } else {
        double[myPosition].push(x)
      }
      return false
    }
  }
}

// sum is the total of the 2 dice rolled
var sum

// displayDice() displays as a modal the nunber of the dice rolled for movement
function displayDice () {
  myMessage = ''
  // if a double was rolled
  if (rolled.length > 2) {
    sum = 0
    for (i = 0; i < rolled.length; i++){
      sum += rolled[i]
      if (homeDice && rolled[i] != 6) {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
      } else {
        myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
      }
    }

    myMessage = myMessage.substr(0, myMessage.length - 1)
    myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum}, 'here')">${sum}</div>`

  } else if (rgby[currentPlayer][0] == 0 && rgby[currentPlayer][rgby[currentPlayer].length - 1] == 0 && rolled.includes(6)) {
    // if the current player has no seed outside and rolled a six, modal activates only the sum movement that sends to presendMOve()
    myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
      sum = rolled[0]
    for (i = 1; i < rolled.length; i++) {
      sum += rolled[i]
      myMessage += `+<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
    }

    if (rolled.length == 1) {
      myMessage = ''
    } else {
      myMessage += '='
    }

    myMessage += `<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`

  } else if ((rgby[currentPlayer].length == 1 && rgby[currentPlayer][0] == 1) ||
    (rgby[currentPlayer].length == 2 && (rgby[currentPlayer].includes(0) && rgby[currentPlayer].includes(1)))) {
    // if the current player has only one seed out, then display appropriately
    sum = 0
    for (i = 0; i < rolled.length; i++) {
      sum += rolled[i]
      if (homeDice) {
        if (rolled[i] == 6) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
        }
      } else {
        if (rolled[i] == 6) {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
        } else {
          if (rolled.includes(6)) {
            myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
          } else {
            myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
          }
        }
      }
    }

    myMessage = myMessage.substr(0, myMessage.length - 1)

    if (rolled.length == 1) {
      myMessage = ''
    } else {
      myMessage += '='
    }

    if (homeDice) {
      if (rolled.includes(6)) {
        if (rolled.length == 1) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum})">${sum}</div>`
        } else {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
        }
      } else {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${sum}</div>`
      }
    } else {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
    }

  } else if (!checkEntry(myPosition)) {
    //there are not othe possible movement except the seed clicked
    // if it is homedice and there is still a seed at home, allow 6 to be available and sum also
    if (homeDice && home[toMoveColor] > 0) {
      var myMessage = ''
      sum = 0
      for (i = 0; i < rolled.length; i++){
        sum += rolled[i]
        if (rolled[i] == 6) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
        }
      }
      myMessage = myMessage.substr(0, myMessage.length - 1)

      if (rolled.length == 1) {
        myMessage = ''
      } else {
        myMessage += '='
      }

      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
    } else if (!homeDice) {
      // if the seed clicked is not at home  then only sum and those that are not 6 will be made active
      var myMessage = ''
      sum = 0
      for (i = 0; i < rolled.length; i++) {
        sum += rolled[i]
        var p = player[currentPlayer][0].toLowerCase()
        var q = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()

        if (rolled.includes(6) && rolled[i] != 6 && (home[p] > 0 || home[q] > 0)) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
        }
      }

      myMessage = myMessage.substr(0, myMessage.length - 1)

      if (rolled.length == 1) {
        myMessage = ''
      } else {
        myMessage += '='
      }

      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum}, 'here')">${sum}</div>`
    }
  } else {
    sum = 0
    for (i = 0; i < rolled.length; i++) {
      sum += rolled[i]
    if (homeDice) {
      if (rolled[i] != 6) {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
      } else {
        myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
      }
    } else {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
    }
    }

    myMessage = myMessage.substr(0, myMessage.length - 1)

    if (rolled.length == 1) {
      myMessage = ''
    } else {
      myMessage +='='
    }

    if (homeDice) {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
    } else {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
    }
  }

  //drops modal and shows just myMessage on the modal
  $('#picks').html(myMessage)
  $('#pick').css('display', 'inline')
  $('#staticBackdrop').modal('show')
  $('.choose').css('display', 'none')
  $('myBtn').removeClass('hide')
  $('#message').addClass('hide')
}

// when the cancel button to click the modal is pressed the homeDice is set back to false
function reset() {
  homeDice = false
}

// contains the data-place value of a cliked cell-box
// which is the position of the current clicked seed in the board
var myPosition

// on click of the any cell-box, check the content of the box to know the seed
// if the seed belongs to the current player and he has rolled the dice, then display update the position and the tomove color
// also call the displayDice() to show the dice rolled for movement
$('.cell-box').on('click', function () {
  if (
    (player[currentPlayer][0].toLowerCase() == this.dataset.color ||
    player[currentPlayer][player[currentPlayer].length - 1].toLowerCase() == this.dataset.color) && rolled.length != 0 && active
  ) {
    myPosition = this.dataset.place
    toMoveColor = this.dataset.color
    var status = Check()
    if (status == 'others') {

    } else if (typeof (status) == "object") {
      // receives the unmovable array as entry and activates only rolled dice value not in the unmovable array
      var myOwnMessage = ''
      var sum = 0
      for (i = 0; i < rolled.length; i++){
        sum+= rolled[i]
        if (status.includes(rolled[i])) {
          myOwnMessage += `<div class="picNumber" style="background-color: darkgray">${rolled[i]}</div> +`
        } else {
          myOwnMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        }
      }

      myOwnMessage = myOwnMessage.substr(0, myOwnMessage.length - 1)

      if (rolled.length == 1) {
        myOwnMessage = ''
      } else {
        myOwnMessage += '='
      }

      myOwnMessage += `<div class="picNumber" style="background-color: darkgray">${sum}</div>`
      $('#picks').html(myOwnMessage)
      $('#pick').css('display', 'inline')
      $('#staticBackdrop').modal('show')
      $('.choose').css('display', 'none')
      $('myBtn').removeClass('hide')
      $('#message').addClass('hide')
    }
    else if (status == true) {
      displayDice()
    }
  }
})

// the roll and roll1() receives random array containing dot classes and displays the appropriate dots on each dice
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

// the stop() and stop1() receives a random array  from the now() removes all the dots on the current send and makes the final dots of the dice roll visible
function stops (x) {
  for (i = 0; i < nine.length; i++){

    document.getElementById(nine[i]).style.visibility = 'hidden'
  }
    for (i = 0; i < x.length; i++) {
      document.getElementById(x[i]).style.visibility = 'visible'
    }
  }

function stop1 (x) {
  for (i = 0; i < nine.length; i++) {
    var p = document.getElementsByClassName(nine[i])
    p[0].style.visibility = 'hidden'
  }
    for (i = 0; i < x.length; i++) {
      var p = document.getElementsByClassName(x[i])
      p[0].style.visibility = 'visible'
    }
}



