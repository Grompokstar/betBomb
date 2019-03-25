import _ from 'lodash'

function winnerPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.resultView.scores['2'].away) > parseInt(item.resultView.scores['2'].home)) {
        count ++
      }
    }
  })

  return count;
}

function winnerMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
      if (parseInt(item.resultView.scores['2'].away) <= parseInt(item.resultView.scores['2'].home)) {
        count ++
      }
    }
  })

  return count;
}


function drawPlus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['2']) {
      if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
        count ++
      }
    }
  })

  return count;
}

function drawMinus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['2']) {
      if (parseInt(item.resultView.scores['2'].home) !== parseInt(item.resultView.scores['2'].away)) {
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

function drawClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
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
      && item.odds['1_1'] && item.odds['1_1'][0] && parseFloat(item.odds['1_1'][0].away_od) > 1 ) {

      //stavka = dataset[dataset.length - 1]/30

      /*if (dataset[dataset.length - 1]/stavka >= 60 && stavka < 2000) {
        stavka = stavka * 2
        console.log(stavka)
      } else if (dataset[dataset.length - 1]/stavka < 15) {
        stavka = stavka/2
        console.log(stavka)
      }*/
      if (parseInt(item.resultView.scores['2'].away) > parseInt(item.resultView.scores['2'].home)) {
        sum += (stavka*item.odds['1_1'][0].away_od - stavka)
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
      && item.odds.currentResultOdd && parseFloat(item.odds.currentResultOdd.draw_od) > 1 ) {

      if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
        sum += (stavka*parseFloat(item.odds.currentResultOdd.draw_od) - stavka)
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

function finalSum() {
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
      && item.odds.currentResultOdd && parseFloat(item.odds.currentResultOdd.draw_od) > 1 ) {

      if (item.botType === 'draw') {
        if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*parseFloat(item.odds.currentResultOdd.draw_od) - stavka)
        } else {
          sum -= stavka
        }
      } else if (item.botType === 'away') {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*parseFloat(item.odds.currentResultOdd.away_od) - stavka)
        } else {
          sum -= stavka
        }
      } else if (item.botType === 'home') {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
          sum += (stavka*parseFloat(item.odds.currentResultOdd.home_od) - stavka)
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

function plus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {

    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['2']) {
      if (item.botType === 'draw') {
        if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else if (item.botType === 'away') {
        if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else if (item.botType === 'home') {
        if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      }

    }
  })

  return count;
}

function minus() {
  let count = 0;
  _.forEach(this.$store.state.events, function (item) {
    if (item.scores && item.resultView && item.resultView.scores && item.resultView.scores['2']) {
      if (item.botType === 'draw') {
        if (parseInt(item.resultView.scores['2'].home) !== parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else if (item.botType === 'away') {
        if (parseInt(item.resultView.scores['2'].home) >= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      } else if (item.botType === 'home') {
        if (parseInt(item.resultView.scores['2'].home) <= parseInt(item.resultView.scores['2'].away)) {
          count ++
        }
      }

    }
  })

  return count;
}

function resultClass(item) {
  if (item.scores && item.resultView && item.resultView.scores && item.view.stats.dangerous_attacks) {
    if (item.botType === 'draw') {
      if (parseInt(item.resultView.scores['2'].home) === parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    } else if (item.botType === 'away') {
      if (parseInt(item.resultView.scores['2'].home) < parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    } else if (item.botType === 'home') {
      if (parseInt(item.resultView.scores['2'].home) > parseInt(item.resultView.scores['2'].away)) {
        return 'plus'
      } else {
        return 'minus'
      }
    }

  }
}

export const resultFunctions = {
  winnerPlus: winnerPlus,
  winnerMinus: winnerMinus,
  winnerFinalSum: winnerFinalSum,
  winnerClass: winnerClass,

  drawPlus: drawPlus,
  drawMinus: drawMinus,
  drawFinalSum: drawFinalSum,
  drawClass: drawClass,

  plus: plus,
  minus: minus,
  finalSum: finalSum,
  resultClass: resultClass,

}