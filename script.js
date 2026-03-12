const plank = document.getElementById('plank');

const PLANK_WIDTH = 600;
let objects = [];

function createObjectElement(weight, distance, color) {
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

// torque calculation
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

    // angle from torque difference, clamped to 30 deg
    var angle = (rightTorque - leftTorque) / 10;
    if (angle > 30) angle = 30;
    if (angle < -30) angle = -30;

    plank.style.transform = 'rotate(' + angle + 'deg)';

    console.log('left:', leftTotalWeight + 'kg', 'right:', rightTotalWeight + 'kg', 'angle:', Math.round(angle));
}

plank.addEventListener('click', function(event) {
    var rect = plank.getBoundingClientRect();
    var pivotX = rect.left + rect.width / 2;
    var clickX = event.clientX;
    var distanceFromPivot = clickX - pivotX;

    var weight = Math.floor(Math.random() * 10) + 1;

    createObjectElement(weight, distanceFromPivot, '#3498db');
    updateSimulation();
});
