// Settings
var piecesPerImage = 2; // how many pieces needed for score?
var players = 2;

// // // //
var usedTurns = 0;
var chosenIndice = [];
var currentTurn = 1; // whos turn is it
var scores = [] //

// default images to fallback to if error in the api
var images = [
    './Images/googleimg.png', // 1
    './Images/coin.png',      // 2
    './Images/moon.png',      // 3
    './Images/whiskers.png',  // 4
    './Images/cloud.png',     // 5
    './Images/socks.png',     // 6
    './Images/dog.png',       // 7
    './Images/girl.png',      // 8
]


function isImageSet(button) {
    const backgroundImage = button.style.backgroundImage;
    // Check if backgroundImage contains "url(" and ")" and it is not just "url()"
    return backgroundImage.includes('url("') && backgroundImage.includes('")') && backgroundImage.length > 6;
}

function checkChosen() {
    return chosenIndice.every(x => x === chosenIndice[0]);
}

function reset() {
    usedTurns = 0;
    chosenIndice = [];
    currentTurn = Math.ceil(Math.random() * players);

    // update turn
    let turnText = document.getElementById('turn');
    turnText.textContent = `Player${currentTurn}`;


    // update turns
    let turns = document.getElementById('turns')
    turns.textContent = `${usedTurns} / ${piecesPerImage}`

    var container = document.querySelector('.square');
    var pieces = document.querySelectorAll('.button.piece');


    // update images with randon new ones
    for (let i = 0; i < images.length; i++) {
        fetch('https://api.unsplash.com/photos/random?client_id=Jz50QFBUuwg6YtCzTMq4IkMjeDNMR0oKhiTH7sNh5oc')
        .then(response => response.json())
        .then(data => {
            images[i] = `url("${data.urls.regular}")`
        })
        .catch(error => console.error('Error fetching data: ', error));
    }




    // first remove old buttons
    pieces.forEach(function(button) {
        button.remove();
    });

    // create array with imageIndexes to choose from later
    var imageIndices = [];
    for (let i = 0; i < images.length; i++) { // image index
        for (let j = 0; j < piecesPerImage; j++) { // input the image index 'piecesPerImage' times
            imageIndices.push(i)
        }
    }

    // Fisher-Yates Shuffle Algorithm
    for (let i = imageIndices.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [imageIndices[i], imageIndices[j]] = [imageIndices[j], imageIndices[i]]; // Swap elements
    }

    // create buttons appropiately relative to the amount of images
    for (let i = 0; i < imageIndices.length; i++) {
        let button = document.createElement('button');
        button.className = 'button piece';

        container.appendChild(button);

        let randomIndex = imageIndices[i]
        button.setAttribute('imageIndex', randomIndex);

        // setup button 'click' event
        button.addEventListener('click', function() {
            // check state of game
            if (usedTurns >= piecesPerImage || isImageSet(button)) { return; }

            usedTurns += 1;

            // refresh turns
            let turns = document.getElementById('turns')
            turns.textContent = `${usedTurns} / ${piecesPerImage}`

            let currentIndex = parseInt(button.getAttribute('imageIndex'), 10);
            chosenIndice.push(currentIndex);
            console.log(images[currentIndex]);
            button.style.backgroundImage = images[currentIndex];
            
            // turn is done?
            if (usedTurns >= piecesPerImage) {
                if (checkChosen()) {
                    // all the chosen pieces were CORRECT
                    if (!scores[currentTurn-1]) {
                        scores[currentTurn-1] = 0
                    }
                    scores[currentTurn-1] += 1;

                    scoreElement = document.getElementById(`score${currentTurn}`);
                    scoreElement.textContent = scores[currentTurn-1].toString();

                    usedTurns = 0;
                    chosenIndice = []

                    // update turns
                    let turns = document.getElementById('turns')
                    turns.textContent = `${usedTurns} / ${piecesPerImage}`

                } else {
                    // all the chosen pieces were WRONG
                    setTimeout(function() {
                        // check if turns are used
    
                        // reset images based on chosen pieces
                        var pieces = document.querySelectorAll('.button.piece');

                        pieces.forEach(function(button) {
                            let currentIndex = parseInt(button.getAttribute('imageIndex'), 10);
                            if (chosenIndice.includes(currentIndex)) {
                                button.style.backgroundImage = '';
                            }
                        });

                        // change turn
                        currentTurn += 1;
                        if (currentTurn > players) { currentTurn = 1 };

                        // update turn
                        let turnText = document.getElementById('turn');
                        turnText.textContent = `Player${currentTurn}`;
                        
                        usedTurns = 0;
                        chosenIndice = []

                        // update turns
                        let turns = document.getElementById('turns')
                        turns.textContent = `${usedTurns} / ${piecesPerImage}`
                    }, 1000);
                }
            }
        });
    }
}

// Entry Point
document.addEventListener('DOMContentLoaded', function() {
    reset()

    // reset button
    var resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', function() {
        reset()
    });
});