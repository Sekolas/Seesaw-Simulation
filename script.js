const plank = document.getElementById('plank');
const resetBtn = document.getElementById('reset-btn');

const PLANK_WIDTH = 600;
let objects = [];

// load saved state on startup
window.addEventListener('load', function() {
    var savedData = localStorage.getItem('seesawStatus');

    if (savedData) {
        var savedObjects = JSON.parse(savedData);
        savedObjects.forEach(function(obj) {
            createObjectElement(obj.weight, obj.position, obj.color, true);
        });
        updateSimulation();
    }
});

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

    var weight = Math.floor(Math.random() * 10) + 1;

    createObjectElement(weight, distanceFromPivot, '#3498db');
    updateSimulation();
});

// reset everything
resetBtn.addEventListener('click', function() {
    objects = [];

    var weights = document.querySelectorAll('.weight');
    weights.forEach(function(el) {
        el.remove();
    });

    localStorage.removeItem('seesawStatus');

    plank.style.transform = 'rotate(0deg)';
});
