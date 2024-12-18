const raw_data = JSON.parse('[["gcc", 1.0, 1.0], ["rust", 1.31, 2.0], ["gpp", 1.39, 3.0], ["csharpaot", 1.71, 4.0], ["csharpcore", 2.36, 5.0], ["chapel", 2.36, 6.0], ["java", 2.78, 8.0], ["ifx", 2.99, 7.0], ["julia", 3.17, 15.0], ["ifc", 3.34, 10.0], ["go", 3.92, 9.0], ["ghc", 3.96, 11.0], ["openj9", 4.54, 16.0], ["gnat", 5.32, 13.0], ["fpascal", 5.76, 14.0], ["ocaml", 6.04, 12.0], ["node", 6.86, 17.0], ["dartjit", 7.21, 21.0], ["dartexe", 8.11, 19.0], ["swift", 8.15, 18.0], ["sbcl", 8.19, 23.0], ["fsharpcore", 12.58, 24.0], ["racket", 13.87, 22.0], ["Pypy", 20.07, 27.0], ["php", 24.81, 20.0], ["javaxint", 33.45, 26.0], ["ruby", 40.73, 31.0], ["Pyston", 48.14, 25.0], ["python3", 52.72, 28.0], ["perl", 75.18, 30.0], ["vw", 95.53, 32.0], ["lua", 137.87, 35.0], ["pharo", 169.88, 34.0], ["clang", 276.82, 29.0], ["icx", 293.21, 33.0], ["graalvm", 298.44, 36.0], ["mri", 452.48, 37.0], ["erlang", 508.54, 39.0], ["toit", 525.13, 38.0], ["micropython", 2099.91, 40.0]]')
const render_date = '2024-12-18'
const container = document.getElementById('main')
container.style.width="1080px"
container.style.height= raw_data.length * 48 + "px"
const container2 = document.getElementById('main2')
container2.style.width="1080px"
container2.style.height= raw_data.length * 48 + "px"
const myChart = echarts.init(container);
const myChart2 = echarts.init(container2);
const colors = ['#454C6F', '#D1DDE2', '#7A97A3', '#A89882', '#484E2A', '#EDF0F4', '#C2B7A7']

let option = {
  title: [
    {
      text: 'The Computer Language Benchmarks Game Visualization',
      link: "https://benchmarksgame-team.pages.debian.net/benchmarksgame/index.html",
      textStyle: {
        fontStyle: "normal",
        fontFamily: "Arial",
        fontSize: 23,
      },
      top: "4px",
      left: '50%',
      textAlign: "center",
      subtextStyle: {
        color: colors[0]
      }
    },
    {
      text: "Data source from benchmarksgame-team.pages.debian.net\nRender by GoodManWEN/Programming-Language-Benchmarks-Visualization.git",
      link: "https://github.com/GoodManWEN/Programming-Language-Benchmarks-Visualization",
      textStyle: {
        fontStyle: "normal",
        fontFamily: "Arial",
        fontWeight: "normal",
        color: colors[0],
        opacity: 0.5,
        fontSize: 13,
        lineHeight: 16,
      },
      top: 'bottom',
      left: 'right',
    },
    {
      text: "Update date: "+render_date,
      textStyle: {
        fontStyle: "normal",
        fontFamily: "Arial",
        fontWeight: "normal",
        color: colors[0],
        opacity: 0.5,
        fontSize: 14,
      },
      top: "28px",
      left: 'right',
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Time consumption(multiplier)','Ranking (weighted by time and memory)'],
    top: '30px',
    left: '23%',
    textStyle: {
      fontSize: 15,
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    name: 'Time consumption\n(multiplier)',
    nameLocation: "start",
    min: 0,
    max: value => Math.round(Math.min(value.max * 1.08, value.max + 10)),
    splitLine: {
      show: false,
    },
    axisLabel: {
      formatter: '{value}x',
      fontSize: 15,
    },
  },
  yAxis: {
    type: 'category',
    name: 'Language',
    nameLocation: "start",
    data: raw_data.map(item => item[0]),
    axisLine: {
      lineStyle: {
        color: colors[0]
      }
    },
    axisLabel: {
      fontSize: 15,
    },
    inverse: true,
  },
  series: [
    {
      name: 'Time consumption(multiplier)',
      type: 'bar',
      itemStyle: {
        color: colors[2],
        opacity:0.8,
      },
      data:  raw_data.map(item => item[1]),
      label: {
        show: true,
        position: 'right',
        color: colors[0],
        fontSize: 14,
        formatter: '{c}x',
      },
    },
    {
      name: 'Ranking (weighted by time and memory)',
      type: 'pie',
      itemStyle: {
        color: colors[6],
        opacity:0.88,
      },
      label: {
        show: true,
        position: 'right',
        color: colors[4],
        formatter: '{c}x',
      },
    },
  ],
};
let option2 = {
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: []
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'value',
    inverse: true,
    splitArea: {
      show: true,
    },
    axisLabel: {
      opacity: 0,
      fontSize: 15,
    },
    splitLine: {
      lineStyle: {
        color: colors[1],
        opacity: 0.5
      }
    },
  },
  yAxis: {
    type: 'category',
    data: raw_data.map(item => item[0]),
    inverse: true,
    axisLabel: {
      opacity: 0,
      fontSize: 15,
    }
  },
  series: [
    {
      name: 'Time',
      type: 'bar',
      itemStyle: {
        color: colors[3],
        opacity:0.8,
      },
      data:  raw_data.map(item => raw_data.length + 1 - item[2]),
      label: {
        show: true,
        position: 'right',
        color: colors[4],
        fontSize: 14,
        formatter: (params) => {
          let num = raw_data.length - params.data + 1;
          let str = ""
          if (num < 10) {
            str = '  ' + num
          }
          else {
            str = num.toString()
          }
          if (str.substr(str.length-1,1) === '1' ) {
            str += "st"
          } else if (str.substr(str.length-1,1) === '2' ) {
            str += "nd"
          } else if (str.substr(str.length-1,1) === '3' ) {
            str += "rd"
          } else {
            str += "th"
          }
          return str
        },
      },
    },
  ],
};
myChart.setOption(option);
myChart2.setOption(option2);
