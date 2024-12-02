// script.js

// Dropdown Functionality
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');

dropdownBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  dropdownContent.classList.toggle('show');
});

document.addEventListener('click', function () {
  dropdownContent.classList.remove('show');
});

// Define maximum heart rate for scaling
const MAX_HEART_RATE = 200; //realistic maximum heart rate (could be raised)

// Initialize Progress Bars
const friProgressBar = new ProgressBar.Circle('#friProgress', {
  color: '#55f20c',
  strokeWidth: 8,
  trailWidth: 4,
  easing: 'easeInOut',
  duration: 500,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#55f20c', width: 4 },
  to: { color: '#55f20c', width: 8 },
  step: function (state, circle) {
    const value = Math.round(circle.value() * 100);
    circle.setText(value);
  }
});

const heartbeatBar = new ProgressBar.Circle('#heartbeat', {
  color: '#f00c36',
  strokeWidth: 8,
  trailWidth: 4,
  easing: 'easeInOut',
  duration: 500,
  text: {
    autoStyleContainer: false
  },
  from: { color: '#f00c36', width: 4 },
  to: { color: '#f00c36', width: 8 },
  step: function (state, circle) {
    const value = Math.round(circle.value() * MAX_HEART_RATE);
    circle.setText(value);
  }
});

// Set initial values to zero
friProgressBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
friProgressBar.text.style.fontSize = '2rem';
friProgressBar.animate(0);

heartbeatBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
heartbeatBar.text.style.fontSize = '2rem';
heartbeatBar.animate(0);

// Initialize Chart
const ctx = document.getElementById('friChart').getContext('2d');

const friChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'FRI Score Over Time',
      data: [],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#4CAF50',
      pointHoverBackgroundColor: '#4CAF50',
      pointHoverBorderColor: '#fff',
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
          color: '#fff'
        },
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'FRI Score',
          color: '#fff'
        },
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff'
        }
      },
      tooltip: {
        titleColor: '#fff',
        bodyColor: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }
    }
  }
});



//not exactly sure how to do this

// Function to fetch the latest metrics
function fetchMetrics() {
  fetch('/api/metrics') //dont know what to do here... 
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error:', data.error);
      } else {
        updateMetrics(data);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}
//main part

// Function to update progress bars and chart with new data
function updateMetrics(data) {
  const { heartbeat, fri_score, timestamp } = data; //dont know what data exactly looks like??

  // Update progress bars
  //fri_score = calcScore(fri_score)
  friProgressBar.animate(fri_score / 100); // Assuming FRI score is out of 100
  heartbeatBar.animate(heartbeat / MAX_HEART_RATE);

  // Update chart data
  const timeLabel = new Date(timestamp).toLocaleTimeString();
  friChart.data.labels.push(timeLabel);
  friChart.data.datasets[0].data.push(fri_score);

  // Limit the number of data points on the chart
  if (friChart.data.labels.length > 10) {
    friChart.data.labels.shift();
    friChart.data.datasets[0].data.shift();
  }

  friChart.update();
}

// Fetch metrics every 5 seconds
setInterval(fetchMetrics, 5000);

// Initial fetch
fetchMetrics();










// Language Dropdown Functionality
const languageLinks = document.querySelectorAll('.language-dropdown .dropdown-content a');

languageLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const selectedLang = this.getAttribute('data-lang');
        changeLanguage(selectedLang);
    });
});

// Function to change language
function changeLanguage(lang) {
    // Implement language change logic here
    console.log('Language changed to:', lang);
    // You can call a function to load translations here
}


function calcScore(FHR, Baseline_FHR, FHR_Ave_Variability, Seconds, Uterine_Activity) {
  let score = 0;
  // Fetal Heart Rate between 110 and 160
  if (FHR >= 110 && FHR <= 160) {
      score += 1;
  }

  // Baseline FHR Variability between 5 and 25
  if (Baseline_FHR >= 5 && Baseline_FHR <= 25) {
      score += 1;
  }

  // FHR Baseline + Ave Variability Accelerations between 14 and 30
  if (FHR_Ave_Variability >= 14 && FHR_Ave_Variability <= 30) {
      score += 1;
  }

  // Seconds until return to Normal Deceleration between 1 and 135
  if (Seconds >= 1 && Seconds <= 135) {
      score += 1;
  }

  // Increased Uterine Activity Score between 1 and 4
  if (Uterine_Activity >= 1 && Uterine_Activity <= 4) {
      score += 1;
  }

  return score;
}
