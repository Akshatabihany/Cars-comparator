let showingDifferences = false; // Flag to track the current state

// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to fetch car details by ID
async function fetchCarDetails(carId, containerId) {
    try {
        console.log("Car id : " + carId);
        const response = await fetch(`/api/cars/${carId}`);
        if (!response.ok) {
            throw new Error('Car not found');
        }
        const car = await response.json();
        carDataStorage[containerId] = car;
        displayCarDetails(car, containerId);

        // Check if all cars are loaded and calculate differences
        if (carDataStorage['currentCarDetails'] && carDataStorage['car1Details'] && carDataStorage['car2Details']) {
            calculateAndStoreDifferences(
                carDataStorage['currentCarDetails'],
                carDataStorage['car1Details'],
                carDataStorage['car2Details']
            );
        }
    } catch (error) {
        console.error('Error fetching car details:', error);
    }
}

// Function to display car details
function displayCarDetails(car, containerId) {
    const container = document.getElementById(containerId);
    const carDetailsHTML = `
        <h2 style="text-decoration: underline;">${car.brand} ${car.model} ${car.variant} (${car.year})</h2>
        <p class="compare-field" data-field="price"><strong>Price:</strong> $${car.price}</p>
        <p class="compare-field" data-field="bodyType"><strong>Body Type:</strong> ${car.bodyType}</p>
        <p class="compare-field" data-field="exteriorColor"><strong>Exterior Color:</strong> ${car.exteriorColor}</p>
        <p class="compare-field" data-field="interiorColor"><strong>Interior Color:</strong> ${car.interiorColor}</p>

        <!-- Engine Details -->
        <div class="compare-section" data-section="engineDetails">
            <h3 style="text-decoration: underline;">Engine Details</h3>
            <p class="compare-field" data-field="engineType"><strong>Type:</strong> ${car.engineDetails.engineType}</p>
            <p class="compare-field" data-field="horsepower"><strong>Horsepower:</strong> ${car.engineDetails.horsepower} HP</p>
            <p class="compare-field" data-field="torque"><strong>Torque:</strong> ${car.engineDetails.torque} Nm</p>
            <p class="compare-field" data-field="displacement"><strong>Displacement:</strong> ${car.engineDetails.displacement}</p>
            <p class="compare-field" data-field="transmissionType"><strong>Transmission Type:</strong> ${car.engineDetails.transmissionType}</p>
            <p class="compare-field" data-field="numberOfGears"><strong>Number Of Gears:</strong> ${car.engineDetails.numberOfGears}</p>
        </div>

        <!-- Performance Details -->
        <div class="compare-section" data-section="performanceDetails">
            <h3 style="text-decoration: underline;">Performance Details</h3>
            <p class="compare-field" data-field="topSpeed"><strong>Top Speed:</strong> ${car.performanceDetails.topSpeed} km/h</p>
            <p class="compare-field" data-field="zeroToHundredTime"><strong>Acceleration (0-100 km/h):</strong> ${car.performanceDetails.zeroToHundredTime} seconds</p>
        </div>

        <!-- Fuel Economy -->
        <div class="compare-section" data-section="fuelEconomy">
            <h3 style="text-decoration: underline;">Fuel Economy</h3>
            <p class="compare-field" data-field="cityMileage"><strong>City Mileage:</strong> ${car.fuelEconomy.cityMileage} km/l</p>
            <p class="compare-field" data-field="highwayMileage"><strong>Highway Mileage:</strong> ${car.fuelEconomy.highwayMileage} km/l</p>
            <p class="compare-field" data-field="fuelTankCapacity"><strong>Fuel Tank Capacity:</strong> ${car.fuelEconomy.fuelTankCapacity} l</p>
        </div>

        <!-- Dimensions -->
        <div class="compare-section" data-section="dimensions">
            <h3 style="text-decoration: underline;">Dimensions</h3>
            <p class="compare-field" data-field="length"><strong>Length:</strong> ${car.dimensions.length} mm</p>
            <p class="compare-field" data-field="width"><strong>Width:</strong> ${car.dimensions.width} mm</p>
            <p class="compare-field" data-field="height"><strong>Height:</strong> ${car.dimensions.height} mm</p>
        </div>

        <!-- Warranty Details -->
        <div class="compare-section" data-section="warrantyDetails">
            <h3 style="text-decoration: underline;">Warranty Details</h3>
            <p class="compare-field" data-field="warrantyYears"><strong>Duration:</strong> ${car.warrantyDetails.warrantyYears} years</p>
            <p class="compare-field" data-field="warrantyKilometers"><strong>Warranty in Kilometers:</strong> ${car.warrantyDetails.warrantyKilometers} km</p>
        </div>

        <!-- Comfort Features -->
        <div class="compare-section" data-section="comfortFeatures">
            <h3 style="text-decoration: underline;">Comfort Features</h3>
            <p class="compare-field" data-field="hasSunroof"><strong>Sunroof:</strong> ${car.comfortFeatures.hasSunroof}</p>
            <p class="compare-field" data-field="hasHeatedSeats"><strong>Heated Seats:</strong> ${car.comfortFeatures.hasHeatedSeats}</p>
            <p class="compare-field" data-field="hasVentilatedSeats"><strong>Ventilated Seats:</strong> ${car.comfortFeatures.hasVentilatedSeats}</p>
            <p class="compare-field" data-field="hasAutomaticClimateControl"><strong>Automatic Climate Control:</strong> ${car.comfortFeatures.hasAutomaticClimateControl}</p>
        </div>
    `;

    container.innerHTML = carDetailsHTML;
}

// Function to generate list HTML (for features)
function generateListHTML(items, itemName) {
    if (!items || items.length === 0) {
        return `<p>No ${itemName.toLowerCase()}s available.</p>`;
    }

    let listHTML = '<ul>';
    items.forEach(item => {
        listHTML += `<li>${item}</li>`;
    });
    listHTML += '</ul>';

    return listHTML;
}

// Function to calculate and store the differences between the 3 cars
function calculateAndStoreDifferences(car1, car2, car3) {
    const sections = document.querySelectorAll('.compare-section');

    sections.forEach(section => {
        const sectionName = section.getAttribute('data-section');
        const fields = section.querySelectorAll('.compare-field');
        let sectionHasDifference = false;

        fields.forEach(field => {
            const fieldName = field.getAttribute('data-field');
            const value1 = car1[sectionName][fieldName];
            const value2 = car2[sectionName][fieldName];
            const value3 = car3[sectionName][fieldName];

            // If values differ, mark field as a difference
            if (value1 !== value2 || value2 !== value3 || value1 !== value3) {
                field.classList.add('is-difference');
                sectionHasDifference = true;
            } else {
                field.classList.remove('is-difference');
            }
        });

        // Hide section if no differences
        if (!sectionHasDifference) {
            section.classList.add('no-difference');
        } else {
            section.classList.remove('no-difference');
        }
    });
}

// Function to toggle displaying differences
function toggleDifferences() {
    const differenceFields = document.querySelectorAll('.is-difference');
    const allFields = document.querySelectorAll('.compare-field');

    if (showingDifferences) {
        allFields.forEach(field => field.style.display = 'block');
        document.getElementById('showDifferencesButton').innerText = 'Show Differences';
    } else {
        allFields.forEach(field => field.style.display = 'none');
        differenceFields.forEach(field => field.style.display = 'block');
        document.getElementById('showDifferencesButton').innerText = 'Show All';
    }

    showingDifferences = !showingDifferences;
}

// Handle the "Show Differences" button click
document.getElementById('showDifferencesButton').addEventListener('click', () => {
    toggleDifferences();
});

// Store car data globally
const carDataStorage = {};

// Execute after the page has fully loaded
window.onload = function () {
    const currentCarId = getUrlParameter('currentCar');
    const car1Id = getUrlParameter('car1');
    const car2Id = getUrlParameter('car2');

    fetchCarDetails(currentCarId, 'currentCarDetails');
    fetchCarDetails(car1Id, 'car1Details');
    fetchCarDetails(car2Id, 'car2Details');
};
