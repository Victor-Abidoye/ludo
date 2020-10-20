// $(document).ready(function () {
  // selectedColor contains an ordered array of selected color
  let selectedColor = []
  // Activates modal to diplay form for players to choose color
  // $('#staticBackdrop').modal('show')

  // On changing the selected option, all options should be visible and then every selected option should be hidden
  $('select').change(function () {
    selectedColor = []
    // All options should be visible
    $('select').children().css('display', 'inline')
    // for each selected color, display is set to hide to prevent it from being chosen again
    $('select')
      .find('option:selected')
      .each(function () {
        var color = $(this).text()
        // push all the colors into an array
        if (color != '--Choose a color--') {
          selectedColor.push(color)
        }
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

  // DICE ROLL  CONTROL
  // array of classes that controls dice dots
  var one = ['faceFive']
  var two = ['faceOne', 'faceNine']
  var three = ['faceOne', 'faceFive', 'faceNine']
  var four = ['faceOne', 'faceThree', 'faceSeven', 'faceNine']
  var five = ['faceOne', 'faceThree', 'faceFive', 'faceSeven', 'faceNine']
  var six = [
    'faceOne',
    'faceThree',
    'faceFour',
    'faceSix',
    'faceSeven',
    'faceNine'
  ]

  //now() creates a loop that generates a random number that is passed to other functions
  function now() {
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
        console.log(a + 1)
        console.log(c + 1)
        // If a double 6 dice is rolled, then the dice is automatically rolled again and a small dice box is created
        // if (a == c && a == 5) {
        //   setTimeout(() => {
        //     var div = `<div id="six"></div><div id="six"></div>`
        //     document.getElementById('sixs').innerHTML =
        //       document.getElementById('sixs').innerHTML + div
        //     now()
        //   }, 1000)
        // }
      }, 100)
    }, 2000)
  }

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


