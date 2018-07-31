import _ from 'lodash'

function tb1stHalfMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum <= startGoalsSum) {
        count++
      }
    }
  })

  return count;
}

function tb1stHalfPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum > startGoalsSum) {
        count++
      }
    }
  })

  return count;
}

function getTB1stHalfClass(item) {
  if (item.scores && item.resultView && item.resultView.scores) {
    let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
    let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
    if (finishGoalsSum <= startGoalsSum) {
      return 'minus'
    } else {
      return 'plus'
    }
  } else {
    return 'default'
  }
}

function winnerPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      }
    }
  })

  return count;
}

function winnerMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['2'].home) <= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) >= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      }
    }
  })

  return count;
}

function getWinnerClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
      if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    } else {
      if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    }
  }
}

export const resultFunctions = {
  tb1stHalfMinus: tb1stHalfMinus,
  tb1stHalfPlus: tb1stHalfPlus,
  winnerPlus: winnerPlus,
  winnerMinus: winnerMinus,
  getTB1stHalfClass: getTB1stHalfClass,
  getWinnerClass: getWinnerClass
}