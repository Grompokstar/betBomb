function all() {
  return true
}

function totalGoals(item) {
  let totalGoals;

  if (item.view.scores) {
    totalGoals = parseInt(item.view.scores['2'].home) + parseInt(item.view.scores['2'].away);
    return totalGoals <= 0
  } else {
    return false
  }


}

function startTB(item) {
  if (item.odds['1_3']) {
    let totalOdds = item.odds['1_3'];
    let startTotalOdd = totalOdds[totalOdds.length - 1];

    if (startTotalOdd) {
      let handicapArray = startTotalOdd.handicap.split(',');

      return (parseFloat(startTotalOdd.over_od) <= 1.6 || parseFloat(handicapArray[0]) > 2.5 && startTotalOdd.over_od < 1.9)
    } else {
      return false
    }
  }
}

function leagueName(item) {
  if (item.league && item.league.name) {
    let leagueNameFilter = ['50', '60', '70'];

    return item.league.name.indexOf(leagueNameFilter[0]) === -1
      && item.league.name.indexOf(leagueNameFilter[1]) === -1
      && item.league.name.indexOf(leagueNameFilter[2]) === -1
      && item.league.name.indexOf(leagueNameFilter[3]) === -1
  }
}

function attacksBot3(item) {
  if (item.view && item.view.stats && item.view.stats.on_target && item.view.stats.attacks && item.view.stats.dangerous_attacks) {
    let goalsOnTarget = 0;
    goalsOnTarget = parseInt(item.view.stats.on_target[0]) + parseInt(item.view.stats.on_target[1]);

    let attacksSumm = 0;
    attacksSumm = parseInt(item.view.stats.attacks[0]) + parseInt(item.view.stats.attacks[1]);

    let dangerAttacksSumm = 0
    dangerAttacksSumm = parseInt(item.view.stats.dangerous_attacks[0]) + parseInt(item.view.stats.dangerous_attacks[1]);

    return goalsOnTarget >= 3 && attacksSumm >= 40 && dangerAttacksSumm/attacksSumm >= 0.5
  } else {
    return false
  }
}

function attacksBot2(item) {
  if (item.view && item.view.stats && item.view.stats.on_target  && item.view.stats.off_target && item.view.stats.attacks && item.view.stats.dangerous_attacks) {
    let goalsOnTarget = 0;
    goalsOnTarget = parseInt(item.view.stats.on_target[0]) + parseInt(item.view.stats.on_target[1]);

    let attacksSumm = 0;
    attacksSumm = parseInt(item.view.stats.attacks[0]) + parseInt(item.view.stats.attacks[1]);

    let dangerAttacksSumm = 0;
    dangerAttacksSumm = parseInt(item.view.stats.dangerous_attacks[0]) + parseInt(item.view.stats.dangerous_attacks[1]);

    let allGoals = 0;
    allGoals = goalsOnTarget + parseInt(item.view.stats.off_target[0]) + parseInt(item.view.stats.off_target[1]);

    let dangerAttacksDiff = Math.abs(parseInt(item.view.stats.dangerous_attacks[0]) - parseInt(item.view.stats.dangerous_attacks[1]));

    let dangerAttacksKef;
    if (parseInt(item.view.stats.dangerous_attacks[0]) >= parseInt(item.view.stats.dangerous_attacks[1])) {
      dangerAttacksKef = parseInt(item.view.stats.attacks[0])/parseInt(item.view.stats.dangerous_attacks[0])
    } else {
      dangerAttacksKef = parseInt(item.view.stats.attacks[1])/parseInt(item.view.stats.dangerous_attacks[1])
    }

    return goalsOnTarget >= 1 && allGoals >= 5 && (item.view.stats.dangerous_attacks[0] <= 10 || item.view.stats.dangerous_attacks[1] <= 10)
      && dangerAttacksDiff > 10 && dangerAttacksKef <= 1.5
  } else {
    return false
  }
}

function attacksBot1(item) {
  if (item.view && item.view.stats && item.view.stats.on_target && item.view.stats.attacks && item.view.stats.dangerous_attacks) {
    let goalsOnTarget = 0;
    goalsOnTarget = parseInt(item.view.stats.on_target[0]) + parseInt(item.view.stats.on_target[1]);

    let attacksSumm = 0;
    attacksSumm = parseInt(item.view.stats.attacks[0]) + parseInt(item.view.stats.attacks[1]);

    let dangerAttacksSumm = 0
    dangerAttacksSumm = parseInt(item.view.stats.dangerous_attacks[0]) + parseInt(item.view.stats.dangerous_attacks[1]);

    let dangerAttacksDif = Math.abs(parseInt(item.view.stats.dangerous_attacks[0]) - parseInt(item.view.stats.dangerous_attacks[1]));

    let dangerAttacksKef;

    if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
      dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[0])/parseInt(item.view.stats.dangerous_attacks[1]);
    } else {
      dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[1])/parseInt(item.view.stats.dangerous_attacks[0]);
    }

    return dangerAttacksKef >= 2.5 && dangerAttacksDif >= 8 && goalsOnTarget >= 2
  } else {
    return false
  }
}

function attacks(item) {
  //return item.view && item.view.stats && item.view.stats.on_target && item.view.stats.attacks && item.view.stats.dangerous_attacks
  if (item.view && item.view.stats && item.view.stats.on_target && item.view.stats.attacks && item.view.stats.dangerous_attacks) {
   /* let goalsOnTarget = 0;
    goalsOnTarget = parseInt(item.view.stats.on_target[0]) + parseInt(item.view.stats.on_target[1]);

    let attacksSumm = 0;
    attacksSumm = parseInt(item.view.stats.attacks[0]) + parseInt(item.view.stats.attacks[1]);

    let dangerAttacksSumm = 0
    dangerAttacksSumm = parseInt(item.view.stats.dangerous_attacks[0]) + parseInt(item.view.stats.dangerous_attacks[1]);

    let dangerAttacksDif = Math.abs(parseInt(item.view.stats.dangerous_attacks[0]) - parseInt(item.view.stats.dangerous_attacks[1]));*/

    let dangerAttacksKef;

    if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
      dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[0])/parseInt(item.view.stats.dangerous_attacks[1]);
    } else {
      dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[1])/parseInt(item.view.stats.dangerous_attacks[0]);
    }

    return dangerAttacksKef > 2.5
  } else {
    return false
  }
}

function currentWinner(item) {
  /*if (item.odds['1_1'] && item.odds['1_1'][0] && parseFloat(item.odds['1_1'][0].home_od) > 1  && parseFloat(item.odds['1_1'][0].away_od) > 1) {
    return true
  } else {
    return false
  }*/
  if (item.odds['1_1']) {
    let winnerOdds = item.odds['1_1'];
    let currentWinnerOdd = winnerOdds[0];

    if (parseFloat(currentWinnerOdd.home_od) >= 2 && parseFloat(currentWinnerOdd.away_od) >= 2) {
      return true
    } else {
      return false
    }
  }
}

export const filterFunctions = {
  all: all,
  startTB: startTB,
  leagueName: leagueName,
  attacksBot1: attacksBot1,
  attacksBot2: attacksBot2,
  attacksBot3: attacksBot3,
  totalGoals: totalGoals,
  attacks: attacks,
  currentWinner: currentWinner
}