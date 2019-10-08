//Game Logic//

var characters, gameState

function startGame() {

    characters = resetCharacters()
    gameState = gameStateReset()

    renderCharacters()
}

function resetCharacters() {

    return {
        'obi-wankenobi': {
            name: 'Obi-Wan Kenobi',
            health: 130,
            attack: 7,
            imageURL: 'assets\images\Obi-Wan Kenobi.webp',
            enemyAttackBack: 15,

        },

        'luke-skywalker': {
            name: 'Luck Skywalker',
            health: 150,
            attack: 8,
            imageURL: 'assets\images\Luke Skywalker.jpg',
            enemyAttackBack: 10,
        },
    }

}
