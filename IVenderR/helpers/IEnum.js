// const EnumGameCode = Object.freeze({
//     "Baccarat":0, 
//     "UnderOver":100, 
//     "Slot":200, 
//     "Powerball":300, 
//     "Roulette":400, 
//     "Blackjack":500, 
//     "DragonTiger":600, 
//     "Holdem":700, 
//     "TeenPatti":800,
//     "Sicbo":900,
//     "Racing":1000,
//     "Lottery":1100,
// });
// exports.EGameCode = EnumGameCode;

// const EnumBettingAccount = Object.freeze({

//     "Tie":0,
//     "Player":1,
//     "Banker":2,
//     "PlayerPair":3,
//     "BankerPair":4,
//     "EitherPair":5,
//     "PerfectPair":6,
//     "PlayerBonus":7,
//     "BankerBonus":8,
//     "Baccarat":99,

//     "PlayerUnder":100,
//     "PlayerOver":101,
//     "BankerUnder":102,
//     "BankerOver":103,

//     "Roulette":400,
//     "Blackjack":500,
//     "DragonTiger":600,
//     "Holdem":700,
//     "TeenPatti":800,
//     "Sicbo":900,
//     "Racing":1000,
//     "Lottery":1100,
// });
// exports.EBettingAccount = EnumBettingAccount;

exports.EBetType = Object.freeze({
    "Tie":0, 
    "Player":1, 
    "Banker":2, 
    "PlayerPair":3, 
    "BankerPair":4, 
    "EitherPair":5, 
    "PerfectPair":6, 
    "PlayerBonus":7, 
    "BankerBonus":8,
    "PlayerUnder":100,
    "PlayerOver":101,
    "BankerUnder":102,
    "BankerOver":103,
    "TieUnder":104,
    "TieOver":105,
    "Roulette":400,
    "Blackjack":500,
    "DragonTiger":600,
    "Holdem":700,
    "TeenPatti":900,
    "LiveCasino":999,
});

exports.EGameCode = Object.freeze({
    "Baccarat":0, 
    "UnderOver":100, 
    "Slot":200, 
    "PowerBall":300, 
});


const EnumVender = Object.freeze({

    "LIVE_VIVO":"LIVE_VIVO",
    "LIVE_PP":"LIVE_PP",
    "LIVE_EVOLUTION":"LIVE_EVOLUTION",
    "LIVE_WORLD":"LIVE_WORLD",
    "LIVE_EZUGI":"LIVE_EZUGI",
    "LIVE_VOTA":"LIVE_VOTA",
    "LIVE_DOWON":"LIVE_DOWON",
    "LIVE_CQ9":"LIVE_CQ9",
    "LIVE_DREAM":"LIVE_DREAM",
    "LIVE_ASIAGAMING":"LIVE_ASIAGAMING",

    "SM_PP":"SM_PP",
    "SM_HABANERO":"SM_HABANERO",
    
    "SM_MICROGAMING":"SM_MICROGAMING",
    "SM_NETENT":"SM_NETENT",
    "SM_REDTIGER":"SM_REDTIGER",

    "SM_BLUEPRINT":"SM_BLUEPRINT",
    "SM_DRAGONSOFT":"SM_DRAGONSOFT",
    "SM_RELAX":"SM_RELAX",
    "SM_ELK":"SM_ELK",
    "SM_PLAYSTAR":"SM_PLAYSTAR",

    "SM_BOOONGO":"SM_BOOONGO",
    "SM_PLAYSON":"SM_PLAYSON",
    "SM_CQ9":"SM_CQ9",
    "SM_ASIASLOT":"SM_ASIASLOT",
    "SM_BETSOFT":"SM_BETSOFT",

});
exports.EVender = EnumVender;