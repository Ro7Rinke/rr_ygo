import {starting_cards, new_player_info} from '../data/system_info'
import {between} from './common'

export default () => {
    let starting_deck = "#created by RR_YGO_3 rnd deck\n#main"
    let local_starting_cards = [...starting_cards]
    for (let type in new_player_info.starting_deck_info){
        for(let index = 0; index < new_player_info.starting_deck_info[type]; index++){
            const card_index = between(0, local_starting_cards[type].length - 1)
            starting_deck = `${starting_deck}\n${local_starting_cards[type].splice(card_index, 1)}`
        }
    }
    return starting_deck = `${starting_deck}\n#extra\n!side\n`
}