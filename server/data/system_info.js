const { Console } = require('console')
const Path = require('path')
const fs = require('fs')

// const paths_relative = {
//     log_dir: `${__dirname}/log`,
//     db_rr_ygo_3: `${__dirname}/rr_ygo_3.db`
// }

// const normalizePaths = () => {
//     let paths = {}
//     for (index in paths_relative){
//         paths[index] = Path.resolve(paths_relative[index]).replace('\\', '/')
//     }
//     console.log(paths)
//     return paths
// }

const paths = {
    log_dir: `${__dirname}/log`,
    db_rr_ygo_3: `${__dirname}/rr_ygo_3.db`,
    users_dir: `${__dirname}/user`,
    import_cards_config: `${__dirname}/import/import_cards_config.json`,
    import_cards_decks_dir: `${__dirname}/import/decks`
}

const general_info = {
    unchecked_game_value: 200,
    ranked_win_value: 500,
    ranked_win_rp: 75,
    ranked_defeat_value: 250,
    ranked_defeat_rp: -30,
    ranked_draw_value: 375,
    ranked_draw_rp: 30,
    sealed_unchecked_game_value: 300,
    sealed_win_value: 700,
    sealed_win_rp: 150,
    sealed_defeat_value: 350,
    sealed_defeat_rp: -60,
    sealed_draw_value: 525,
    sealed_draw_rp: 60
}

const new_player_info = {
    starting_cash: 5000,
    starting_rp: 100,
    starting_sealed_rp: 100,
    starting_deck_info: {
        normal_1: 1,
        normal_2: 2,
        normal_3: 10,
        effect_1: 1,
        effect_2: 3,
        effect_3: 7,
        spell_1: 4,
        spell_2: 3,
        spell_3: 3,
        trap_1: 6
    }
}

const starting_cards = {
    normal_1: ['34677013'],
    normal_2: ['34677013'],
    normal_3: ['34677013'],
    effect_1: ['34677013'],
    effect_2: ['34677013'],
    effect_3: ['34677013'],
    spell_1: ['34677013'],
    spell_2: ['34677013'],
    spell_3: ['34677013'],
    trap_1: ['34677013']
}

const errors = {
    'db-1': {
        message: 'Error opening database'
    },
    'db-2': {
        message: 'Error retrieving data from database'
    },
    'db-3': {
        message: 'User not found'
    },
    'db-4': {
        message: 'Error inserting'
    },
    'db-5': {
        message: 'Error updating'
    },
    'us-1': {
        message: 'Invalid password'
    },
    'fs-1': {
        message: 'Path does not exist'
    },
    'fs-2': {
        message: 'Error reading data'
    },
    'sy-1': {
        message: 'Error converting JSON'
    }
}

module.exports = {paths, general_info, new_player_info, starting_cards, errors}