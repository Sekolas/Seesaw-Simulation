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

plank.addEventListener('click', function(event) {
    var rect = plank.getBoundingClientRect();
    var pivotX = rect.left + rect.width / 2;
    var clickX = event.clientX;
    var distanceFromPivot = clickX - pivotX;

    // random weight between 1-10
    var weight = Math.floor(Math.random() * 10) + 1;

    createObjectElement(weight, distanceFromPivot, '#3498db');
    console.log('placed', weight, 'kg at', Math.round(distanceFromPivot), 'px');
});
