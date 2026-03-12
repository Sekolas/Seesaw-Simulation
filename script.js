const plank = document.getElementById('plank');
const leftTotalWeightDisplay = document.getElementById('left-total-weight');
const rightTotalWeightDisplay = document.getElementById('right-total-weight');
const nextWeightDisplay = document.getElementById('next-weight');
const angleDisplay = document.getElementById('angle');
const resetBtn = document.getElementById('reset-btn');
const weightPreviewDisplay = document.getElementById('weight-preview');
const historyContainer = document.getElementById('history-container');

const PLANK_WIDTH = 600;
let objects = [];
let nextWeight = 0;
let activityHistory = [];

window.addEventListener('load', function() {
    createNextWeight();

    var savedHistory = localStorage.getItem('seesawHistory');
    if (savedHistory) {
        activityHistory = JSON.parse(savedHistory);
        activityHistory.forEach(function(log) {
            pushHistoryEntry(log.weight, log.position, true);
        });
    }

    var savedData = localStorage.getItem('seesawStatus');
    if (savedData) {
        var savedObjects = JSON.parse(savedData);
        savedObjects.forEach(function(obj) {
            createObjectElement(obj.weight, obj.position, obj.color, true);
        });
        updateSimulation();
    }
});

function getRandomWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pushHistoryEntry(weight, position, isRestoring) {
    var placeholder = document.querySelector('.placeholder');
    if (placeholder) placeholder.remove();

    var side = position < 0 ? 'left' : 'right';
    var distance = Math.abs(position).toFixed(0);

    var entry = document.createElement('div');
    entry.classList.add('history-entry');
    entry.innerText = ' ' + weight + 'kg dropped on ' + side + ' side at ' + distance + 'px from pivot';
    historyContainer.prepend(entry);

    if (!isRestoring) {
        activityHistory.push({ weight: weight, position: position });
        localStorage.setItem('seesawHistory', JSON.stringify(activityHistory));
    }
}

function createNextWeight() {
    nextWeight = getRandomWeight(1, 10);
    nextWeightDisplay.innerText = nextWeight + ' kg';

    weightPreviewDisplay.innerText = nextWeight + 'kg';
    weightPreviewDisplay.style.backgroundColor = '#3498db';
}

function createObjectElement(weight, distance, color, fromStorage) {
    var weightDiv = document.createElement('div');
    weightDiv.classList.add('weight');
    weightDiv.innerText = weight + 'kg';
    weightDiv.style.backgroundColor = color || '#3498db';

    var leftPosition = (PLANK_WIDTH / 2) + distance;
    weightDiv.style.left = leftPosition + 'px';

    plank.appendChild(weightDiv);

    objects.push({
        weight: weight,
        position: distance,
        color: color || '#3498db',
        element: weightDiv
    });
}

function updateSimulation() {
    var leftTorque = 0;
    var rightTorque = 0;
    var leftTotalWeight = 0;
    var rightTotalWeight = 0;

    objects.forEach(function(obj) {
        var normalizedDistance = Math.abs(obj.position) / 10;
        var torque = obj.weight * normalizedDistance;

        if (obj.position < 0) {
            leftTorque += torque;
            leftTotalWeight += obj.weight;
        } else {
            rightTorque += torque;
            rightTotalWeight += obj.weight;
        }
    });

    var angle = (rightTorque - leftTorque) / 10;
    if (angle > 30) angle = 30;
    if (angle < -30) angle = -30;

    plank.style.transform = 'rotate(' + angle + 'deg)';
    angleDisplay.innerText = Math.round(angle) + '°';

    leftTotalWeightDisplay.innerText = leftTotalWeight + ' kg';
    rightTotalWeightDisplay.innerText = rightTotalWeight + ' kg';

    saveStatus();
}

function saveStatus() {
    var statusToSave = objects.map(function(obj) {
        return {
            weight: obj.weight,
            position: obj.position,
            color: obj.color
        };
    });
    localStorage.setItem('seesawStatus', JSON.stringify(statusToSave));
}

plank.addEventListener('click', function(event) {
    var rect = plank.getBoundingClientRect();
    var pivotX = rect.left + rect.width / 2;
    var distanceFromPivot = event.clientX - pivotX;

    var weight = nextWeight;
    createObjectElement(weight, distanceFromPivot, '#3498db');
    updateSimulation();
    pushHistoryEntry(weight, distanceFromPivot);
    createNextWeight();
});

// preview follows mouse on plank
plank.addEventListener('mousemove', function(event) {
    var rect = plank.getBoundingClientRect();
    var x = event.clientX - rect.left;

    weightPreviewDisplay.style.display = 'flex';
    weightPreviewDisplay.style.left = x + 'px';
});

plank.addEventListener('mouseleave', function() {
    weightPreviewDisplay.style.display = 'none';
});

resetBtn.addEventListener('click', function() {
    objects = [];

    var weights = document.querySelectorAll('.weight');
    weights.forEach(function(el) {
        if (el.id !== 'weight-preview') {
            el.remove();
        }
    });

    localStorage.removeItem('seesawStatus');
    plank.style.transform = 'rotate(0deg)';
    leftTotalWeightDisplay.innerText = '0 kg';
    rightTotalWeightDisplay.innerText = '0 kg';
    angleDisplay.innerText = '0°';

    activityHistory = [];
    localStorage.removeItem('seesawHistory');
    historyContainer.innerHTML = '<div class="history-entry placeholder">No action has been taken.</div>';

    createNextWeight();
});
