# Seesaw Mechanism Simulation

## Project Overview
This application simulates a seesaw where users can interactively place weights. The system calculates torque based on weight and distance from the pivot point, updating the plank's angle accordingly. Features include visual feedback, activity history, and automatic state persistence.

## Technical Stack
- Vanilla JavaScript
- CSS3
- LocalStorage
- HTML5 Audio

## File Structure
```
seesaw-mechanism/
├── index.html          # Main HTML structure
├── script.js           # Application logic and physics simulation
├── style.css           # Styling and animations
├── sound-effect.mp3    # Audio feedback for weight placement
└── README.md           # This file
```

## Usage
1. Open index.html in a modern web browser.
2. Move your mouse over the plank to see a preview of the next weight.
3. Click anywhere on the plank to place a weight at that position.
4. Observe the real-time calculation of torque and angle.
5. Use the "Pause Mechanism" button to freeze the current state.
6. Use the "Reset Mechanism" button to clear all weights and start fresh.

## Design Decisions
The application uses vanilla JavaScript without frameworks to keep it lightweight. The physics model is simplified to prioritize responsiveness and user experience over physical accuracy. Torque calculations use a linear relationship between weight, distance, and angle.

The angle is limited to 30 degrees in either direction for visual clarity. The application uses a pivot-centered coordinate system and implements automatic state persistence through LocalStorage.

## Trade-offs and Limitations
The simplified physics model does not account for complex properties like moment of inertia or friction. The simulation is optimized for desktop viewing and may have layout issues on mobile devices. LocalStorage has capacity limits and does not sync across devices.

## Future Enhancements
Potential improvements include physics engine integration, weight removal functionality, export/import features and accessibility improvements.

## Author
Sekolas

## License
This project is provided as-is for educational purposes.
