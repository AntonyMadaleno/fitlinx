const weightChartCanvas = document.getElementById('weightChart');
const benchChartCanvas = document.getElementById('benchChart');
const squatChartCanvas = document.getElementById('squatChart');
const dlChartCanvas = document.getElementById('dlChart');
const pullChartCanvas = document.getElementById('pullChart');

const infos = document.querySelectorAll('.info');

let weightChart = null;
let benchChart = null;
let squatChart = null;
let dlChart = null;
let pullChart = null;

function processLogs(logs) 
{
    weight_log = logs.map(log => log.weight);
    bench_log = logs.map(log => log.bench);
    squat_log = logs.map(log => log.squat);
    dl_log = logs.map(log => log.dl);
    pull_log = logs.map(log => log.pull);
    dates = logs.map(log => log.date + ' 00:00:00');

    if (weightChart != null)
    {
        weightChart.destroy();
        benchChart.destroy();
        squatChart.destroy();
        dlChart.destroy();
        pullChart.destroy();
    }

    weightChart = new Chart(weightChartCanvas, {
        type: 'line',
        data: {
          labels: dates, // Provide the labels for the x-axis
          datasets: [{
            label: 'Weight Tracking',
            data: weight_log,
            backgroundColor: 'rgba(255, 80, 80, 0.30)',
            borderColor: 'rgba(255,80,80,0.70)',
            borderWidth: 5,
          }]
        },
        options: {
            responsive: true,
            tension: 0.3,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                }
            }
        }
    });

    benchChart = new Chart(benchChartCanvas, {
        type: 'line',
        data: {
          labels: dates, // Provide the labels for the x-axis
          datasets: [{
            label: 'Bench Press Tracking',
            data: bench_log,
            backgroundColor: 'rgba(255, 160, 80, 0.30)',
            borderColor: 'rgba(255,160,80,0.70)',
            borderWidth: 5,
          }]
        },
        options: {
            responsive: true,
            tension: 0.3,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                }
            }
        }
    });

    squatChart = new Chart(squatChartCanvas, {
        type: 'line',
        data: {
          labels: dates, // Provide the labels for the x-axis
          datasets: [{
            label: 'Squat Tracking',
            data: squat_log,
            backgroundColor: 'rgba(255, 80, 160, 0.30)',
            borderColor: 'rgba(255, 80, 160, 0.70)',
            borderWidth: 5,
          }]
        },
        options: {
            responsive: true,
            tension: 0.3,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                }
            }
        }
    });

    dlChart = new Chart(dlChartCanvas, {
        type: 'line',
        data: {
          labels: dates, // Provide the labels for the x-axis
          datasets: [{
            label: 'Dead Lift Tracking',
            data: dl_log,
            backgroundColor: 'rgba(80, 80, 255, 0.30)',
            borderColor: 'rgba(80, 80, 255, 0.70)',
            borderWidth: 5,
          }]
        },
        options: {
            responsive: true,
            tension: 0.3,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                }
            }
        }
    });

    pullChart = new Chart(pullChartCanvas, {
        type: 'line',
        data: {
          labels: dates, // Provide the labels for the x-axis
          datasets: [{
            label: 'Pull up Tracking',
            data: pull_log,
            backgroundColor: 'rgba(160, 255, 80, 0.30)',
            borderColor: 'rgba(160,255,80,0.70)',
            borderWidth: 5,
          }]
        },
        options: {
            responsive: true,
            tension: 0.3,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.25)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.15)'
                    },
                    ticks: {
                        color: 'white',
                        maxTicksLimit: 10,
                    }
                }
            }
        }
    });

}

function getCurrentUserLogs() 
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/user_logs');
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() 
    {
        if (xhr.status === 200) 
        {
            const response = JSON.parse(xhr.responseText);
            // Process the weight logs as needed
            processLogs(response);
        } 
        else 
        {
            console.log('Failed to retrieve user logs.');
        }
    };

    xhr.onerror = function() {
        console.log('Failed to retrieve user logs.');
    };

    xhr.send();
}

function display(parent, id)
{

    for (let i = 0; i < infos.length; i++)
    {
        infos[i].style = "border: none;";
    }

    parent.style = "border-top: 2px solid #ff5050; border-bottom: 2px solid #ff5050";
    weightChartCanvas.style.display = 'none';
    benchChartCanvas.style.display = 'none';
    squatChartCanvas.style.display = 'none';
    dlChartCanvas.style.display = 'none';
    pullChartCanvas.style.display = 'none';
    document.querySelector(id).style.display = 'block';
}

getCurrentUserLogs();
display(infos[1], '#weightChart');