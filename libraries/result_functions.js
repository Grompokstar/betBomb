import _ from 'lodash'

function tb1stHalfMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
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
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum > startGoalsSum) {
        count++
      }
    }
  })

  return count;
}

function tm1stHalfMinus() {
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

function tm1stHalfPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum === startGoalsSum) {
        count++
      }
    }
  })

  return count;
}

function tb1stHalfClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
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



function tb1stHalfDrawClass(item) {
  if (item.scores && item.resultView && item.resultView.scores) {
    let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
    let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
    if (finishGoalsSum === startGoalsSum) {
      return 'plus'
    } else {
      return 'minus'
    }
  } else {
    return 'default'
  }
}

function winnerPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
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
    if (item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['2'].home) >= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) <= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      }
    }
  })

  return count;
}

function _60minutePlusCount() {
  let count = 0;
  function goalTimes(events) {
    if (events) {
      let goalEvents = [];
      let goalTimes = [];

      _.forEach(events, function(event) {
        if (event.text && event.text.indexOf(' Goal ') >=0 ) {
          goalEvents.push(event.text)
        };
      });

      _.forEach(goalEvents, function(event) {
        goalTimes.push(event.substring(0, event.indexOf('\'')));
      })

      return goalTimes;
    } else {
      return '-'
    }

  }



  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum <= startGoalsSum) {
        if (item.resultView && item.resultView.events) {
          let timesArray = goalTimes(item.resultView.events);
          let isInterval = false;
          _.forEach(timesArray, function (minute) {
            let minuteNumber = parseInt(minute.slice(0, 2))
            if (minuteNumber >= 46 && minuteNumber <= 59) {
              isInterval = true
            }
          })

          if (isInterval) {
            count++
          }
        }
      }
    }
  })

  return count;
}

function halfTimeWinnerPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['1'].home) < parseInt(item.resultView.scores['1'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['1'].home) > parseInt(item.resultView.scores['1'].away)) {
          count ++
        }
      }
    }
  })

  return count;
}

function halfTimeWinnerMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['1'].home) >= parseInt(item.resultView.scores['1'].away)) {
          count ++
        }
      } else {
        if (parseInt(item.resultView.scores['1'].home) <= parseInt(item.resultView.scores['1'].away)) {
          count ++
        }
      }
    }
  })

  return count;
}


function drawPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
      if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
        count ++
      }
    }
  })

  return count;
}

function drawMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']) {
      if (parseInt(item.resultView.scores['1'].home) !== parseInt(item.resultView.scores['1'].away)) {
        count ++
      }
    }
  })

  return count;
}

function winnerClass(item) {
  if (item && item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
      if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    } else {
      if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    }
  }
}

function getHalfTimeWinnerClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
      if (parseInt(item.resultView.scores['1'].home) < parseInt(item.resultView.scores['1'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    } else {
      if (parseInt(item.resultView.scores['1'].home) > parseInt(item.resultView.scores['1'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    }
  }
}

function get1halfDrawClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
      return 'plus'
    } else {
      return 'minus'
    }
  }
}

function getDrawClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
      return 'plus'
    } else {
      return 'minus'
    }
  }
}

function winnerFinalSum() {
  let sum = this.startBank;
  let startBank = this.startBank;
  let stavka = this.startBank*this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
      datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }



  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks
      && item.odds['1_1'] && item.odds['1_1'][0] && parseFloat(item.odds['1_1'][0].home_od) > 1 ) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*item.odds['1_1'][0].away_od - stavka)
        } else {
          sum -= stavka
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*item.odds['1_1'][0].home_od - stavka)
        } else {
          sum -= stavka
        }
      }

      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function halfTimeWinnerFinalSum() {
  let sum = this.startBank;
  let startBank = this.startBank;
  let stavka = this.startBank*this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }



  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks
      && item.odds['1_8'] && item.odds['1_8'][0] && parseFloat(item.odds['1_8'][0].home_od) > 1 ) {
      if (parseInt(item.view.stats.dangerous_attacks[0]) < parseInt(item.view.stats.dangerous_attacks[1])) {
        if (parseInt(item.resultView.scores['1'].home) < parseInt(item.resultView.scores['1'].away)) {
          sum += (stavka*item.odds['1_8'][0].away_od - stavka)
        } else {
          sum -= stavka
        }
      } else {
        if (parseInt(item.resultView.scores['1'].home) > parseInt(item.resultView.scores['1'].away)) {
          sum += (stavka*item.odds['1_8'][0].home_od - stavka)
        } else {
          sum -= stavka
        }
      }

      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function trendsWinnerFinalSum() {
  let sum = this.startBank;
  let startBank = this.startBank;
  let stavka = this.startBank*this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }



  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks
      && item.odds['1_1'] && item.odds['1_1'][0] && parseFloat(item.odds['1_1'][0].home_od) > 1 ) {
      if (item.homeDangerAttacks > item.awayDangerAttacks) {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*item.odds['1_1'][0].home_od - stavka)
        } else {
          sum -= stavka
        }
      } else {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*item.odds['1_1'][0].away_od - stavka)
        } else {
          sum -= stavka
        }
      }

      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function _1stHalfWinnerFinalSum() {
  let sum = this.startBank;
  let stavka = this.startBank/20;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }



  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks
      && item.odds['1_8'] && item.odds['1_8'][0] && parseFloat(item.odds['1_8'][0].home_od) > 1 && item.odds['1_3']) {

      let totalOdds = item.odds['1_3'];
      let startTotalOdd = totalOdds[totalOdds.length - 1];
      let handicapArray = startTotalOdd.handicap.split(',');

      let attacksRatioKef;
      if (parseInt(item.view.stats.attacks[0]) > parseInt(item.view.stats.attacks[1])) {
        attacksRatioKef = parseInt(item.view.stats.attacks[0])/parseInt(item.view.stats.attacks[1]);
      } else {
        attacksRatioKef = parseInt(item.view.stats.attacks[1])/parseInt(item.view.stats.attacks[0]);
      }

      let dangerAttacksKef;

      if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
        dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[0])/parseInt(item.view.stats.dangerous_attacks[1]);
      } else {
        dangerAttacksKef = parseInt(item.view.stats.dangerous_attacks[1])/parseInt(item.view.stats.dangerous_attacks[0]);
      }

      if (dangerAttacksKef < 1.3 && attacksRatioKef < 1.3 && (startTotalOdd.over_od > 1.6 && parseFloat(handicapArray[0]) <= 2.5 || startTotalOdd.over_od > 1.9 && parseFloat(handicapArray[0]) > 2.5)) {
        if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
          sum += (stavka*item.odds['1_8'][0].draw_od - stavka)
        } else {
          sum -= stavka
        }
      } else if (dangerAttacksKef > 2.5 && attacksRatioKef > 2.2 && (startTotalOdd.over_od < 1.6 && parseFloat(handicapArray[0]) <= 2.5 || startTotalOdd.over_od < 1.9 && parseFloat(handicapArray[0]) > 2.5)) {
        if (parseInt(item.view.stats.dangerous_attacks[0]) > parseInt(item.view.stats.dangerous_attacks[1])) {
          if (parseInt(item.resultView.scores['1'].home) > parseInt(item.resultView.scores['1'].away)) {
            sum += (stavka*item.odds['1_8'][0].home_od - stavka)
          } else {
            sum -= stavka
          }
        } else {
          if (parseInt(item.resultView.scores['1'].home) < parseInt(item.resultView.scores['1'].away)) {
            sum += (stavka*item.odds['1_8'][0].away_od - stavka)
          } else {
            sum -= stavka
          }
        }
      }


      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function _1stHalfDrawSum() {
  let sum = this.startBank;
  let stavka = this.startBank*this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }

  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1']
      && item.odds['1_8'] && item.odds['1_8'][0] && parseFloat(item.odds['1_8'][0].draw_od) > 1 && item.odds['1_8']) {
      if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
        sum += (stavka*item.odds['1_8'][0].draw_od - stavka)
      } else {
        sum -= stavka
      }

      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function drawFinalSum() {
  let sum = this.startBank;
  let stavka = this.startBank * this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }

  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks
      && item.odds['1_1'] && item.odds['1_1'][0] && parseFloat(item.odds['1_1'][0].home_od) > 1 ) {
      if (parseInt(item.resultView.scores['1'].home) === parseInt(item.resultView.scores['1'].away)) {
        sum += (stavka*item.odds['1_1'][0].draw_od - stavka)
      } else {
        sum -= stavka
      }

      count++;
      dataset.push(sum);
      labels.push(count);
    }
  }.bind(this));

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function tb1stHalfFinalSum() {
  let sum = this.startBank;
  let stavka = this.startBank*this.betSize;
  let count = 0;
  let labels = [];
  let dataset = [];

  labels.push(count);
  dataset.push(sum);

  let chartData = {
    labels: [],
    datasets: [
      {
        label: 'Размер банка',
        backgroundColor: '#f87979',
        data: []
      }
    ]
  }

  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['1'] && item.scores['2']) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum > startGoalsSum) {
        sum += (stavka*1.5 - stavka);
      } else {
        sum -= stavka;
      }


      count++;
      labels.push(count);
      dataset.push(sum);
    }

  })

  chartData.datasets[0].data = dataset;
  chartData.labels = labels;
  this.chartData = chartData;

  return sum;
}

function TMFinalSum() {
  let sum = this.startBank;
  let stavka = this.startBank/20

  _.forEach(this.$store.state.events, function(item) {
    if (item.scores && item.resultView && item.resultView.scores) {
      let startGoalsSum = parseInt(item.scores['2'].home) + parseInt(item.scores['2'].away);
      let finishGoalsSum = parseInt(item.resultView.scores['1'].home) + parseInt(item.resultView.scores['1'].away);
      if (finishGoalsSum === startGoalsSum) {
        sum += (stavka*1.6 - stavka);
      } else {
        sum -= stavka;
      }
    }

  })

  return sum;
}

export const resultFunctions = {
  winnerPlus: winnerPlus,
  winnerMinus: winnerMinus,
  winnerFinalSum: winnerFinalSum,
  winnerClass: winnerClass,

  _60minutePlusCount: _60minutePlusCount,
  tb1stHalfMinus: tb1stHalfMinus,
  tb1stHalfPlus: tb1stHalfPlus,
  tb1stHalfClass: tb1stHalfClass,
  tb1stHalfFinalSum: tb1stHalfFinalSum,

  TMFinalSum: TMFinalSum,
  _1stHalfWinnerFinalSum: _1stHalfWinnerFinalSum,
  _1stHalfDrawSum: _1stHalfDrawSum,
  get1halfDrawClass: get1halfDrawClass,
  drawPlus: drawPlus,
  drawMinus: drawMinus,
  drawFinalSum: drawFinalSum,
  getDrawClass: getDrawClass,
  trendsWinnerFinalSum: trendsWinnerFinalSum,
  getHalfTimeWinnerClass: getHalfTimeWinnerClass,
  halfTimeWinnerFinalSum: halfTimeWinnerFinalSum,
  halfTimeWinnerMinus: halfTimeWinnerMinus,
  halfTimeWinnerPlus: halfTimeWinnerPlus

}