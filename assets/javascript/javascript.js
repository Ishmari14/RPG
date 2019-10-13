var characters, gameState

//RESET FUNCTIONS //
function startGame() {
    // resets the game to original state;
    characters = resetCharacters()
    gameState = resetGameState()

    // renders characters
    renderCharacters()
}

function resetCharacters() {
    // resets the character stats to originals.
    return {
        'obiWanKenobi': {
            name: 'Obi-Wan Kenobi',
            health: 120,
            attack: 7,
            imageUrl: 'assets/images/Obi-Wan Kenobi.webp',
            enemyAttackBack: 15
        },
        'lukeSkywalker': {
            name: 'Luke Skywalker',
            health: 100,
            attack: 12,
            imageUrl: 'assets/images/Luke Skywalker.jpg',
            enemyAttackBack: 5
        },
        'darthVader': {
            name: 'Darth Vader',
            health: 150,
            attack: 9,
            imageUrl: 'assets/images/Darth Vader.jpg',
            enemyAttackBack: 20
        },
        'darthMaul': {
            name: 'Darth Maul',
            health: 180,
            attack: 10,
            imageUrl: 'assets/images/Darth Maul.png',
            enemyAttackBack: 25
        }
    }
}

function resetGameState() {
    // resets game state to originals.
    return {
        selectedCharacter: null,
        selectedDefender: null,
        enemiesLeft: 0,
        numAttacks: 0
    }
}

/* RENDERING FUNCTIONS */


function createCharDiv(character, key) {
    var charDiv = $("<div class='character' data-name='" + key + "'>")
    var charName = $("<div class='character-name'>").text(character.name)
    var charImage = $("<img alt='image' class='character-image'>").attr('src', character.imageUrl)
    var charHealth = $("<div class='character-health'>").text(character.health)
    charDiv.append(charName).append(charImage).append(charHealth)
    return charDiv
}

// renders all characters in character-area to start
function renderCharacters() {
    console.log('rendering characters')
    var keys = Object.keys(characters)
    for (var i = 0; i < keys.length; i++) {
        // get the current character out of the object
        var characterKey = keys[i]
        var character = characters[characterKey]
        // append elements to the #character-area element
        var charDiv = createCharDiv(character, characterKey)
        $('#character-area').append(charDiv)
    }
}

// renders just the opponents (not the character that was just selected)
function renderOpponents(selectedCharacterKey) {

    var characterKeys = Object.keys(characters)
    for (var i = 0; i < characterKeys.length; i++) {
        if (characterKeys[i] !== selectedCharacterKey) {
            var enemyKey = characterKeys[i]
            var enemy = characters[enemyKey]

            var enemyDiv = createCharDiv(enemy, enemyKey)
            $(enemyDiv).addClass('enemy')
            $('#available-to-attack-section').append(enemyDiv)
        }
    }
}

/* LOGIC */

function enableEnemySelection() {
    $('.enemy').on('click.enemySelect', function () {
        console.log('opponent selected')
        var opponentKey = $(this).attr('data-name')
        gameState.selectedDefender = characters[opponentKey]

        // move enemy
        $('#defender').append(this)
        $('#attack-button').show()
        $('.enemy').off('click.enemySelect')
    })
}

function attack(numAttacks) {
    console.log('attacking defender')
    gameState.selectedDefender.health -= gameState.selectedCharacter.attack * numAttacks
}

function defend() {
    console.log('defender countering')
    // HP lost
    gameState.selectedCharacter.health -= gameState.selectedDefender.enemyAttackBack
}

function isCharacterDead(character) {
    console.log('checking if player is dead')
    return character.health <= 0
}

// checks if player has won
function isGameWon() {
    console.log('checking if you won the game')
    return gameState.enemiesLeft === 0
}

function isAttackPhaseComplete() {
    // logic to check if defender or player is dead.
    if (isCharacterDead(gameState.selectedCharacter)) {
        // you lose!
        alert('You were defeated by ' + gameState.selectedDefender.name + '. Click reset to play again.')
        // display lose message to user, and present reset button.
        $('#selected-character').empty()
        $('#reset-button').show()

        return true // returning true because attack phase has completed.
    } else if (isCharacterDead(gameState.selectedDefender)) {
        console.log('defender dead')

        // decrement enemiesLeft counter and empty defender div
        gameState.enemiesLeft--
        $('#defender').empty()

        // checks if you win the game, or if there are more characters to fight
        if (isGameWon()) {
            // show reset button and alert
            alert('You win! Click Reset to play again')
            $('#reset-button').show()
        } else {
            // Prompt user to select another enemy
            alert('You defeated ' + gameState.selectedDefender.name + '! Select another enemy to fight.')
            enableEnemySelection()
        }
        return true // returning true because attack phase has completed.
    }
    // returning false, because attack phase is not complete.
    return false
}

// used when clicking on reset button to reset the game.
function emptyDivs() {
    // empty out all content areas
    $('#selected-character').empty()
    $('#defender').empty()
    $('#available-to-attack-section .enemy').empty()
    $('#character-area').empty()
    $('#characters-section').show()
}

$(document).ready(function () {

    //click handler///
    $('#character-area').on('click', '.character', function () {
        // store selected character in javascript

        var selectedKey = $(this).attr('data-name')
        gameState.selectedCharacter = characters[selectedKey]
        console.log('player selected')

        // move to selected section
        $('#selected-character').append(this)

        renderOpponents(selectedKey)

        // then hide the characters-section from view
        $('#characters-section').hide()

        // set the number of enemies, and enable enemy selection;
        gameState.enemiesLeft = Object.keys(characters).length - 1
        enableEnemySelection()
    })

    $('#attack-button').on('click.attack', function () {
        console.log('attack clicked')
        // increment attackCounter (for power scaling of player attacks)
        gameState.numAttacks++

        // attack and defend stages
        attack(gameState.numAttacks)
        defend()

        // display updated values for character health
        $('#selected-character .character-health').text(gameState.selectedCharacter.health)
        $('#defender .character-health').text(gameState.selectedDefender.health)

        // hide the attack button if attack phase is over
        if (isAttackPhaseComplete()) {
            $(this).hide()
        }
    })

    $('#reset-button').on('click.reset', function () {
        console.log('resetting game')

        emptyDivs()

        // hide reset button
        $(this).hide()

        // start the game again
        startGame()
    })

    // KICKS OFF THE GAME
    startGame()
})
