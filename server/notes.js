//--------------TABLES----------------------

const user = {
    id: 'unique id',
    // email: 'your@email.here',
    password: 'hashpassword',
    token: 'acces token',
    name: 'Your Name',
    nick: 'nickname',
    cash: 5000,
    rp: 300,
    sealed_rp: 500,
    unchecked_games: 23,
    ranked_wins: 5,
    ranked_defeats: 7,
    ranked_draws: 1,
    sealed_unchecked_games: 7,
    sealed_wins: 2,
    sealed_defeats: 1,
    sealed_draws: 0,
}

const user_checked_game = {
    id: 'unique id',
    user_id: 'user unique id',
    partner_user_id: 'if is a tag duel, partner user unique id',
    //enemies_user_id: ['is an array of ids', 'if is a tag duel, enemies user unique ids'],
    status: 'game status', // win, defeat, draw
    type: 'game type', // ranked, sealed
    upload_date: 'date type here', // date the game was submitted
    check_date: 'date type here', // date the game was checked
}

const game_enemy_user = {
    id: 'unique id',
    game_id: 'unique user checked id',
    enemy_user_id: 'user id of the enemy',
}

const user_card = {
    id: 'unique id',
    user_id: 'user unique id',
    card_id: 'card id',
    amount: 2,
}

const card = {
    id: 'unique id', //unique id used inside the RR_YGO_3 software
    ygo_id: 'card id used inside de ygopro', //same as card id used by de .cdb and card images
}

const collection = {
    id: 'unique id',
    name: 'collection set name',
    alias: '4 letters',// 4 letter that reference the collection set
    total_cards: 120,
    price: 500,
    cards_per_pack: 9,
    pack_limit: 1000, //number of packs to sell, if NULL or -1, that pack has unlimited units to sell
    description: 'some description about the collection set'
}

const collection_slot = {
    id: 'unique id',
    collection_id: 'collection unique id',
    //possible_rarities: ['RR', 'SR', 'UR', 'SC'],
    //rarities_chances: [55, 30, 10, 5], //same order as possible_rarities, the sum of all values must be 100
}

const slot_rarity_chance = {
    id: 'unique id',
    slot_id: 'unique collection slot id',
    rarity_id: 'unique rarity id',
    chance: 30, // the sum of all chance with the same slot_id must be 100
}

const collection_card = {
    id: 'unique id',
    collection_id: 'collection unique id',
    card_id: 'card unique id',
    rarity_id: 'rarity unique id', 
}

const collection_junk = {
    id: 'unique id',
    collection_id: 'collection unique id',
    rarity_id: 'CM', //rarities thar has junk value
    value: 20, //same order as rarities
}

const rarity = {
    id: 'unique id', // CM, RR, SR, UR, SC, CL, PR, GH
    name: 'Secret Rare', // Common, Rare, Super Rare, Ultra Rare, Secret Rare, Collection Rare, Prize, Ghost Rare
    level: 12, //higher = rarest
}

//--------------SYSTEM CONFIGURATION----------------------

const lf_list = {
    id: 'unique id',
    name: 'LF list name',
    semi_limited: ['card unique id'], //use de card id of RR_YGO_3
    limited: ['card unique id'], //use de card id of RR_YGO_3
    forbidden: ['card unique id'], //use de card id of RR_YGO_3
    description: 'some description about this lf list',
}

const system_info = {
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
    sealed_draw_rp: 60,
}

const new_player_info = {
    starting_cash: 5000,
    //starting cards will be generated using a sample database cards with
    // x1 LV7 or higher Normal Monster
    // x1 LV7 or higher Effect Monster
    // x2 LV5 or LV6 Normal Monster
    // x3 LV5 or LV6 Effect Monster
    // x10 LV4 or lower Normal Monster
    // x7 LV4 or lower Effect Monster
    // x4 normal Spell
    // x3 equipe Spell
    // x3 continuous Spell
    // x6 traps
}

const error = {
    code: 'db-3', //where - id
    message: 'error create user', //some message about the error
    date: 'datetype here',
    datails: 'erros message from object'
}