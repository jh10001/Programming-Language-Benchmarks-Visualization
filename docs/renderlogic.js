const raw_data = JSON.parse('[["rust", 1.0, 1.0], ["clang", 1.53, 2.0], ["csharpaot", 1.99, 4.0], ["chapel", 2.1, 5.0], ["gcc", 2.18, 3.0], ["csharpcore", 2.39, 7.0], ["fsharpcore", 2.78, 10.0], ["icc", 3.14, 6.0], ["gnat", 3.23, 9.0], ["icx", 3.32, 8.0], ["java", 3.59, 13.0], ["gpp", 3.69, 11.0], ["csharppgo", 4.26, 14.0], ["go", 4.29, 12.0], ["graalvm", 4.56, 16.0], ["ghc", 4.63, 20.0], ["ifx", 5.18, 17.0], ["ifc", 5.84, 18.0], ["sbcl", 6.43, 22.0], ["dartjit", 6.58, 23.0], ["swift", 7.12, 19.0], ["ocaml", 7.26, 15.0], ["julia", 7.75, 25.0], ["fpascal", 7.77, 21.0], ["corretto", 8.31, 24.0], ["node", 8.88, 27.0], ["gfortran", 12.14, 28.0], ["racket", 25.37, 30.0], ["Pypy", 27.92, 31.0], ["erlang", 33.2, 34.0], ["Pyston", 33.77, 26.0], ["dartexe", 39.19, 36.0], ["python3", 42.21, 29.0], ["perl", 49.25, 32.0], ["php", 53.52, 35.0], ["lua", 68.88, 39.0], ["vw", 76.69, 33.0], ["ruby", 77.25, 37.0], ["pharo", 120.97, 40.0], ["mri", 362.75, 38.0]]')
const render_date = '2023-10-22'
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
