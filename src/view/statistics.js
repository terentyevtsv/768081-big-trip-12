import AbstractView from "./abstract.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getEventTypeMoneyStructure, getTransportUsageStructure, getTimeSpentStructure} from "../utils/statistics.js";
import {getDeltaTimeFormat} from "../utils/formats.js";
import moment from "moment";

const BAR_HEIGHT = 55;

const createStatisticsTemplate = () =>
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;

export default class Statistics extends AbstractView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = this._renderMoneyChart();
    this._transportChart = this._renderTransportChart();
    this._timeSpentChart = this._renderTimeSpentChart();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  _renderMoneyChart() {
    const eventTypeMoneyStructure = getEventTypeMoneyStructure(this._points);

    const moneyContextElement = this.getElement().querySelector(`.statistics__chart--money`);
    moneyContextElement.height = BAR_HEIGHT * eventTypeMoneyStructure.size;

    const moneyChart = new Chart(moneyContextElement, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Array.from(eventTypeMoneyStructure.keys()).map((name) => name.toUpperCase()),
        datasets: [{
          data: Array.from(eventTypeMoneyStructure.values()),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    return moneyChart;
  }

  _renderTransportChart() {
    const transportUsageStructure = getTransportUsageStructure(this._points);

    const transportContextElement = this.getElement().querySelector(`.statistics__chart--transport`);
    transportContextElement.height = BAR_HEIGHT * transportUsageStructure.size;

    const transportChart = new Chart(transportContextElement, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: Array.from(transportUsageStructure.keys()).map((name) => name.toUpperCase()),
        datasets: [{
          data: Array.from(transportUsageStructure.values()),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    return transportChart;
  }

  _renderTimeSpentChart() {
    const timeSpentStructure = getTimeSpentStructure(this._points);
    const timeSpentContextElement = this.getElement().querySelector(`.statistics__chart--time`);
    timeSpentContextElement.height = BAR_HEIGHT * timeSpentStructure.size;
    const tempLabels = Array.from(timeSpentStructure.keys()).map((name) => name.toUpperCase());

    const timeSpentChart = new Chart(timeSpentContextElement, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: tempLabels,
        datasets: [{
          data: Array.from(timeSpentStructure.values()),
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => {
              const tempTime = moment.duration(val);
              return (
                `${getDeltaTimeFormat(tempTime.days(), tempTime.hours(), tempTime.minutes())}`
              );
            }
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 100
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    return timeSpentChart;
  }
}
