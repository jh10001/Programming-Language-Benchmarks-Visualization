const raw_data = JSON.parse('[["gcc", 1.0, 1.0], ["clang", 1.06, 2.0], ["icx", 1.07, 3.0], ["rust", 1.21, 4.0], ["gpp", 1.3, 5.0], ["csharpaot", 1.79, 6.0], ["csharpcore", 1.8, 7.0], ["ifx", 2.74, 8.0], ["chapel", 3.02, 9.0], ["ifc", 3.06, 10.0], ["graalvm", 3.11, 15.0], ["java", 3.13, 14.0], ["gnat", 3.52, 11.0], ["go", 3.64, 12.0], ["julia", 3.79, 18.0], ["ghc", 4.5, 13.0], ["openj9", 4.95, 19.0], ["fpascal", 5.17, 16.0], ["dartjit", 6.72, 22.0], ["sbcl", 7.23, 21.0], ["ocaml", 7.57, 17.0], ["swift", 7.58, 20.0], ["node", 7.81, 23.0], ["dartexe", 8.07, 26.0], ["gfortran", 8.22, 25.0], ["fsharpcore", 11.16, 28.0], ["racket", 11.43, 27.0], ["php", 12.93, 24.0], ["Pypy", 19.67, 34.0], ["ruby", 42.64, 32.0], ["Pyston", 48.5, 29.0], ["python3", 56.65, 31.0], ["vw", 76.53, 33.0], ["perl", 77.87, 30.0], ["javaxint", 85.01, 35.0], ["lua", 134.65, 38.0], ["pharo", 148.64, 37.0], ["mri", 544.05, 36.0], ["erlang", 557.13, 40.0], ["toit", 702.32, 39.0]]')
const render_date = '2024-05-08'
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
