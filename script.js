// Function to set the circular progress bar's animation
function setProgress(selector, value) {
    const circle = document.querySelector(selector);
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    
    const offset = circumference - (value / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

// Example values for heartbeat rate and FRI score
setProgress('.circular-progress .progress-bar[style*="--value: 70"]', 70); // Heartbeat
setProgress('.circular-progress .progress-bar[style*="--value: 50"]', 50); // FRI Score

// Bar Chart for cached FRI Score Data
const ctx = document.getElementById('fri-chart').getContext('2d');
const friData = [45, 50, 55, 60, 53, 50, 48]; // Example cached FRI data

const friChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Example days
        datasets: [{
            label: 'FRI Score',
            data: friData,
            backgroundColor: '#4CAF50',
            borderColor: '#45a049',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});
