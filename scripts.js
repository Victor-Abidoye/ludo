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



// player contains an array player color array
var player = []
// Sets the first player index to 0 at the beginning of the game
var currentPlayer = 0
// an array to contain the number of seeds a current player has outside the home
var rgby = []
// keeps the record of digits rolled on dice
var rolled = []
// activateSeed is set to false and is set to true to enable seed selection at the END of rollin the dice
var activateSeed = false


function checkWinner () {
  // var holder = []
  for (i = 0; i < rgby.length; i++) {

    var a = player[i][0].toLowerCase()
    var b = player[i][player[i].length - 1].toLowerCase()
    if (rgby[i][0] == 0 & rgby[i][rgby[i].length - 1] == 0 && home[a] == 0 && home[b] == 0) {
      player.splice(i, 1)
      rgby.splice(i, 1)
      alert("player " + (currentPlayer + 1) + " won")
    }
  }
  if (player.length == 1) {
    return false
  }
  return true
}

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
    if (rgby.length == 0) {
      // $('#staticBackdrop').modal('show')
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

      if (a == c && a == 5) {
        activateSeed = false
        nextPlayer(player[currentPlayer])
        $('.roll').prop('disabled', false)
        $('.roll').text('ROLL')
      }

      if (canMove(rgby[currentPlayer])) {
        if (!(checkEntry())) {
          var hi = player[currentPlayer][0].toLowerCase()
          var hij = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
          if (rolled.includes(6) && (home[hi] > 0 || home[hij] > 0)) {

          } else {
            console.log('tuple')
            toChangeRoller()
            return
          }
        }


        // if (!(rolled.includes(6)) && !(checkEntry())) {
        //   console.log('tuple')
        //   toChangeRoller()
        // }
      } else {
        $('#staticBackdrop').modal('show')
        $('#message').removeClass('hide')
        $('.choose').css('display', 'none')
        $('#pick').html("")
        toChangeRoller()
        return
      }
    }, 100)
  }, 2000)
})



var home = {
  blue: 4,
  green: 4,
  red: 4,
  yellow: 4
}

function singularCheck (a) {
  console.log('hip')
  for (h = 0; h < player[currentPlayer].length; h++) {
    var x = $(`.${player[currentPlayer][h].toLowerCase() + 'seed'}`)
    console.log(x)
    for (i = 0; i < x.length; i++) {
      var place = x[i].parentElement.dataset.place
      var my_code = colorCodeArr(player[currentPlayer][h].toLowerCase())
      var distance = distanceLeft(place, my_code)

      console.log('sd')
      if (a == place && double[place] == undefined ) {
        continue

      } else {
        console.log(distance)

        for (j = 0; j < rolled.length; j++) {
          console.log('dlsek')
          if (rolled[j] <= distance) {
            return true
          }
        }
      }

    }

  }
  return false

}

// onclick of a seed, check if
function Check () {
  var unmovable = []
  var sum = 0
  var x = distanceLeft(myPosition, colorCodeArr(toMoveColor))
  for (i = 0; i < rolled.length; i++){
    sum += rolled[i]
    if (rolled[i] > x) {
      unmovable.push(rolled[i])
    }
  }
  if (sum > x) {
    unmovable.push(sum)
  }

  // if the seed selecected cannot be moved, then check for others
  if (rolled.length + 1 == unmovable.length) {
    // alert()
    // if any of the other seeds can be moved return true if not passturn
    if (checkEntry()) {
      if (unmovable.length == 2) {
        return unmovable
      } else if (unmovable.length == 1) {
        return unmovable
      } else {
        return 'others'
        // toChangeRoller()
      }
    } else {
      console.log('one')
      var p = player[currentPlayer][0].toLowerCase()
      var q = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
      if (rolled.includes(6) && (home[p] > 0 || home[q] > 0)) {
        // alert()
        return unmovable
      } else {
        toChangeRoller()
      }

    }
  } else {
    if (unmovable.length == 0) {
      console.log('two')
      return true
    } else {
      console.log('three')
      return unmovable
    }
  }
}


function checkEntry () {
  for (h = 0; h < player[currentPlayer].length; h++){
    var x = $(`.${player[currentPlayer][h].toLowerCase() + 'seed'}`)
    for (i = 0; i < x.length; i++) {
      var place = x[i].parentElement.dataset.place
      var my_code = colorCodeArr(player[currentPlayer][h].toLowerCase())
      var distance = distanceLeft(place, my_code)

      console.log(distance)

      for (j = 0; j < rolled.length; j++) {
        if (rolled[j] <= distance) {
          return true
        }
      }
    }

  }
  return false
}

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
      // alert()
      // console.log(rgby[currentPlayer])


    } else {
      return true
    }

  };
  return false
}

// toChangeRoller() changes the disables the roll for the current player and enables the action for the next player
// it passes turn in the way
function toChangeRoller () {
  if (!checkWinner()) {
    alert("Click Ok to to play again")
    location.reload()
    return
  }
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
    $(this).hasClass(player[currentPlayer][player[currentPlayer].length - 1].toLowerCase())) && activateSeed == true && active
  ) {
    Check()
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

function presendMOve (num) {
  var x = num - 6
  sendMove(6, 1)
  if (num == 6) {
    return
  }
  // alert()
  sendMove(x, 1)
  rolled = []
}

var tempPrev
var tempDataColor

var active = true

var trouble = 0
// The sendMove() controls the moving of each seed
function sendMove (num, here) {

  if (homeDice) {
    // if a seed clicked is in stil at home a SIX has to be rolled
    // if this is true the seed should be brought out of the box
    homeDice = false
    if (num == 6 && here != 'here') {

      var storeDataColor = ''
      var a = `<div class="${toMoveColor + 'seed'} " style="position: absolute; border-radius: 50%; height: 90%; width: 90%; background-color: ${toMoveColor}; border: 1px black solid;"></div>`
      $(chosen).css('display', 'none')
      $(chosen).addClass('remove')
      chosen = ""
      var x = colorCodeArr(toMoveColor)
      console.log(x)
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

      var hold_home = home[toMoveColor]
      hold_home--
      home[toMoveColor] = hold_home

      if (here != 1) {
        if (kill(storeDataColor, toMoveColor)) {
          $(`[data-place=${x[0]}]`).html('')
          $(`[data-place=${x[0]}]`).attr('data-color', '')
          // var hold_home = home[toMoveColor]
          // hold_home--
          // home[toMoveColor] = hold_home

          var hold_home2 = home[storeDataColor]
          hold_home2++
          home[storeDataColor] = hold_home2
          if (myPosition in double) {
            $(`[data-place=${myPosition}]`).attr('data-color', double[myPosition][double[myPosition].length - 1])
            // $(`[data-place=${myPosition}]`).addClass('double[myPosition][double[myPosition].length - 1]' + 'seed')
            $(`[data-place=${myPosition}]`).html(`<div class= ${double[myPosition][double[myPosition].length - 1] + 'seed'} style="position: absolute; border-radius: 50%; height: 90%; width: 90%; background-color: ${double[myPosition][double[myPosition].length - 1]}; border: 1px black solid;"></div>`)
            double[myPosition].splice(double[myPosition].length - 1, 1)
            if (double[myPosition].length == 0) {
              delete double[myPosition]
            }
          }
        }
      } else {
        myPosition = x[0]

      }

      if (rolled.length == 0) {
        toChangeRoller()
      }
    }
    trouble = 0
  } else {
    active = false
    // takes count of the number of times a seed is to move
    var counter = 0
    // this contians the data-color value for the previous seed in a cell box
    var storeDataColor = ""
   // this is updated to contain the content of the HTML content of the box the current seed is to move to
    var previous = ""

    if (myPosition in double) {
      storeDataColor = double[myPosition][double[myPosition].length - 1]
      previous = `<div class=${storeDataColor + 'seed'} style="position: absolute; border-radius: 50%; height: 90%; width: 90%; background-color: ${storeDataColor}; border: 1px black solid;"></div>`
      double[myPosition].splice(double[myPosition].length - 1, 1)
      if (double[myPosition].length == 0) {
        delete double[myPosition]
      }
    }

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

      var seedDetails = colorCodeArr(toMoveColor)
      if (myPosition == seedDetails[1] + 1) {
        myPosition = seedDetails[2]
      }

      // if ((seedDetails[1] - myPosition) + 6 )

      previous = $(`[data-place=${myPosition}]`).html()
      console.log(previous)
      storeDataColor = $(`[data-place=${myPosition}]`).attr('data-color')
      $(`[data-place=${myPosition}]`).html(content)
      $(`[data-place=${myPosition}]`).attr('data-color', toMoveColor)
      // clear this interval when seed has moved num number of seeds
      console.log(toMoveColor[0].toUpperCase() +toMoveColor.substring(1,toMoveColor.length))
      console.log(player[currentPlayer][player[currentPlayer].indexOf(toMoveColor[0].toUpperCase() +toMoveColor.substring(1,toMoveColor.length))])



      if (myPosition == (seedDetails[2] + 5)) {
        $(`[data-place=${myPosition}]`).html("")
        $(`[data-place=${myPosition}]`).attr('data-color', "")
        var z = []
        // var z1 = []
        for (a = 0; a < player.length; a++) {
          for (b = 0; b < player[a].length; b++) {
            if (player[a][b] == toMoveColor[0].toUpperCase() + toMoveColor.substring(1, toMoveColor.length)) {
              z = [a, b]
              console.log(z)
              // } else if (player[a][b] == y[0].toUpperCase() + y.substring(1, y.length))
              //   z1 = [a, b]
            }
          }

          // rgby[z1[0]][z1[1]]--



        }
        rgby[z[0]][z[1]]--
      }


      if (counter == num) {
        clearInterval(check)
        rolled.splice(rolled.indexOf(num), 1)
        storeDataColor == undefined ? storeDataColor = "" : storeDataColor = storeDataColor

        active = true


        if (kill(storeDataColor, toMoveColor)) {
          $(`[data-place=${myPosition}]`).html("")
          $(`[data-place=${myPosition}]`).attr('data-color', "")

          // var hold_home = home[toMoveColor]
          // hold_home--
          // home[toMoveColor] = hold_home

          var hold_home2 = home[storeDataColor]
          hold_home2++
          home[storeDataColor] = hold_home2

          if (myPosition in double) {
            $(`[data-place=${myPosition}]`).attr('data-color', double[myPosition][double[myPosition].length - 1])
            $(`[data-place=${myPosition}]`).html(`<div class= ${double[myPosition][double[myPosition].length - 1] + 'seed'} style="position: absolute; border-radius: 50%; height: 90%; width: 90%; background-color: ${double[myPosition][double[myPosition].length - 1]}; border: 1px black solid;"></div>`)
            double[myPosition].splice(double[myPosition].length - 1, 1)
            if (double[myPosition].length == 0) {
              delete double[myPosition]
            }
          }
        }




        // if the number clicked is the sum, empty rolled after moving
        if (here == 'here') {
          rolled = []
        }

        if (rolled > 0) {
          if (!checkEntry()) {
            var hi = player[currentPlayer][0].toLowerCase()
            var hij = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()
            if (rolled.includes(6) && (home[hi] > 0 || home[hij] > 0)) {

            } else {
              console.log('tupular')
              toChangeRoller()
              return
            }

          }
        }
        // if (rolled.length > 0) {
        //   if (!checkEntry()) {
        //     toChangeRoller()
        //   }
        // }
        checkWinner()
        if (rolled.length == 0) {
          toChangeRoller()
        }
      }
      trouble = 0
    }, 500)
  }
}

var double = {}

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
      rgby[z[0]][z[1]]--
      rgby[z1[0]][z1[1]]--

      return true
    } else {
      // alert()
      // update an object array that contains the "data-place" number as key and an array of data-color as value
      if (double[myPosition] == undefined) {
        double[myPosition] = [x]
      } else {
        double[myPosition].push(x)
      }
      console.log(double)
      return false
    }
  }

}

// sum is the total of the 2 dice rolled
var sum

// displayDice() displays as a modal the nunber of the dice rolled for movement
function displayDice () {
  var myMessage = `<button id="myBtn" type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="reset()">
                <span aria-hidden="true">&times;</span>
                </button>`
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
    myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
      sum = rolled[0]
      for (i = 1; i < rolled.length; i++) {
        sum += rolled[i]
        myMessage += `+<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
      }

      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`

  } else if ((rgby[currentPlayer].length == 1 && rgby[currentPlayer][0] == 1) ||
    (rgby[currentPlayer].length == 2 && (rgby[currentPlayer].includes(0) && rgby[currentPlayer].includes(1)))) {

    if (homeDice) {
      if (rolled[0] == 6) {
        myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
      } else {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
      }
    } else {
      if (rolled[0] == 6) {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
      } else {
        if (rolled.includes(6)){
          myMessage += `<div class="picNumber unmove" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
        }
      }
    }
    sum = rolled[0]
    for (i = 1; i < rolled.length; i++) {
      sum += rolled[i]
      if (homeDice) {
        if (rolled[i] == 6) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
        }
      } else {
        if (rolled[i] == 6) {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
        } else {
          if (rolled.includes(6)) {
            myMessage += `<div class="picNumber unmove" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
          } else {
            myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
          }
        }
      }
    }

    if (homeDice) {
      if (rolled.includes(6)) {
        if (rolled.length == 1) {
          myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum})">${sum}</div>`
        } else {
          myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
        }
      } else {
        myMessage += `=<div class="picNumber unmove" style="background-color: darkgray">${sum}</div>`
      }
    } else {
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
    }

  } else if (!singularCheck(myPosition)) {
    // if it is homedice and there is still a seed at home, allow 6 to be available and sum also
    console.log('aaa')
    if (homeDice && home[toMoveColor] > 0) {
      console.log('bbb')
      var myMessage = `<button id="myBtn" type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="reset()">
                <span aria-hidden="true">&times;</span>
                </button>`
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
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
    } else if (!homeDice) {
      console.log('ccc')
      var myMessage = `<button id="myBtn" type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="reset()">
                <span aria-hidden="true">&times;</span>
                </button>`
      sum = 0
      for (i = 0; i < rolled.length; i++) {
        sum += rolled[i]
          // myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        var p = player[currentPlayer][0].toLowerCase()
        var q = player[currentPlayer][player[currentPlayer].length - 1].toLowerCase()

        if (rolled.includes(6) && rolled[i] != 6 && (home[p] > 0 || home[q] > 0)) {
          myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div> +`
        } else {
          myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div> +`
        }

      }
      myMessage = myMessage.substr(0, myMessage.length - 1)
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum}, 'here')">${sum}</div>`
, 'here'
    }

    // else only allow sum
  } else {



    if (homeDice) {
      if (rolled[0] != 6) {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[0]}</div>`
      } else {
        myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
      }
    } else {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[0]})">${rolled[0]}</div>`
    }
     sum = rolled[0]
    for (i = 1; i < rolled.length; i++) {
      sum += rolled[i]
    if (homeDice) {
      if (rolled[i] != 6) {
        myMessage += `<div class="picNumber unmove" style="background-color: darkgray">${rolled[i]}</div>`
      } else {
        myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
      }
    } else {
      myMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
    }
      //  myMessage += `+<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>`
    }
    if (homeDice) {
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="presendMOve(${sum})">${sum}</div>`
    } else {
      myMessage += `=<div class="picNumber" data-dismiss="modal" onclick="sendMove(${sum},'here')">${sum}</div>`
    }
  }
  $('#pick').html(myMessage)
  $('#staticBackdrop').modal('show')
  $('.choose').css('display', 'none')
  $('myBtn').removeClass('hide')
  $('#message').addClass('hide')
}

function reset() {
  homeDice = false
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
    player[currentPlayer][player[currentPlayer].length - 1].toLowerCase() == this.dataset.color) && rolled.length != 0 && active
  ) {
    console.log(active)
    myPosition = this.dataset.place
    console.log(myPosition)
    toMoveColor = this.dataset.color
    console.log(toMoveColor)
    var status = Check()
    console.log(status)
    if (status == 'others') {

    } else if (typeof (status) == "object") {
      console.log(status)
      var myOwnMessage = `<button id="myBtn" type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="reset()">
                <span aria-hidden="true">&times;</span>
                </button>`
      var sum = 0
      for (i = 0; i < rolled.length; i++){
        sum+= rolled[i]
        if (status.includes(rolled[i])) {
          myOwnMessage += `<div class="picNumber" style="background-color: darkgray">${rolled[i]}</div>+`
        } else {
          myOwnMessage += `<div class="picNumber" data-dismiss="modal" onclick="sendMove(${rolled[i]})">${rolled[i]}</div>+`
        }
      }
      myOwnMessage = myOwnMessage.substr(0, myOwnMessage.length - 1)
      myOwnMessage += `=<div class="picNumber" style="background-color: darkgray">${sum}</div>`
      $('#pick').html(myOwnMessage)
      $('#staticBackdrop').modal('show')
      $('.choose').css('display', 'none')
      $('myBtn').removeClass('hide')
      $('#message').addClass('hide')
    }
    else if (status == true) {
      // alert()
      displayDice()
    }
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


