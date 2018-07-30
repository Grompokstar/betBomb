function all() {
  return true
}

function bot3(item) {
  if (item.odds['1_3'] && item.view.stats && item.view.stats.dangerous_attacks) {
    let totalOdds = item.odds['1_3'];
    let startTotalOdd = totalOdds[totalOdds.length - 1];

    if (startTotalOdd && item.view.stats) {
      let handicapArray = startTotalOdd.handicap.split(',');

      let goalsOnTarget = 0;
      if (item.view.stats.on_target) {
        goalsOnTarget = parseInt(item.view.stats.on_target[0]) + parseInt(item.view.stats.on_target[1]);
      }

      let attacksSumm = 0;
      if (item.view.stats.attacks) {
        attacksSumm = parseInt(item.view.stats.attacks[0]) + parseInt(item.view.stats.attacks[1]);
      }


      let dangerAttacksSumm = parseInt(item.view.stats.dangerous_attacks[0]) + parseInt(item.view.stats.dangerous_attacks[1]);

      return (parseFloat(startTotalOdd.over_od) <= 1.6 || parseFloat(handicapArray[0]) > 2.5 && startTotalOdd.over_od < 1.9)
        && goalsOnTarget >= 3 && attacksSumm >= 40 && dangerAttacksSumm/attacksSumm >= 0.5
    } else {
      return false
    }
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
    let leagueNameFilter = ['50', '60', '70', '80'];

    return item.league.name.indexOf(leagueNameFilter[0]) === -1
      && item.league.name.indexOf(leagueNameFilter[1]) === -1
      && item.league.name.indexOf(leagueNameFilter[2]) === -1
      && item.league.name.indexOf(leagueNameFilter[3]) === -1
  }
}

function attacks(item) {
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

export const filterFunctions = {
  bot3: bot3,
  all: all,
  startTB: startTB,
  leagueName: leagueName,
  attacks: attacks
}