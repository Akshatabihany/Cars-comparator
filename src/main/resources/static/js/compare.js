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
        displayCarDetails(car, containerId);
    } catch (error) {
        console.error('Error fetching car details:', error);
    }
}

// Function to display car details
function displayCarDetails(car, containerId) {
    const container = document.getElementById(containerId);
    const carDetailsHTML = `
         <h2>${car.brand} ${car.model} ${car.variant} (${car.year})</h2>
                <p><strong>Price:</strong> $${car.price}</p>
                <p><strong>Body Type:</strong> ${car.bodyType}</p>
                <p><strong>Exterior Color:</strong> ${car.exteriorColor}</p>
                <p><strong>Interior Color:</strong> ${car.interiorColor}</p>

                <!-- Engine Details -->
                <h3>Engine Details</h3>
                <p><strong>Type:</strong> ${car.engineDetails.engineType}</p>
               <p><strong>Horsepower:</strong> ${car.engineDetails.horsepower} HP</p>
               <p><strong>Torque:</strong> ${car.engineDetails.torque} Nm</p>
               <p><strong>Displacement:</strong> ${car.engineDetails.displacement}</p>
               <p><strong>Transmission Type:</strong> ${car.engineDetails.transmissionType}</p>
               <p><strong>Number Of Gears:</strong> ${car.engineDetails.numberOfGears}</p>

                <!-- Performance Details -->
                <h3>Performance Details</h3>
                <p><strong>Top Speed:</strong> ${car.performanceDetails.topSpeed} km/h</p>
                           <p><strong>Acceleration (0-100 km/h):</strong> ${car.performanceDetails.zeroToHundredTime} seconds</p>

                <!-- Fuel Economy -->
                <h3>Fuel Economy</h3>
                      <p><strong>City Mileage:</strong> ${car.fuelEconomy.cityMileage} km/l</p>
                          <p><strong>Highway Mileage:</strong> ${car.fuelEconomy.highwayMileage} km/l</p>
                          <p><strong>Fuel Tank Capacity:</strong> ${car.fuelEconomy.fuelTankCapacity} km/l</p>

                <!-- Dimensions -->
                <h3>Dimensions</h3>
                 <p><strong>Length:</strong> ${car.dimensions.length} mm</p>
                           <p><strong>Width:</strong> ${car.dimensions.width} mm</p>
                           <p><strong>Height:</strong> ${car.dimensions.height} mm</p>


                <!-- Warranty Details -->
                <h3>Warranty Details</h3>
                   <p><strong>Duration:</strong> ${car.warrantyDetails.warrantyYears} years</p>
                           <p><strong>Warranty in Kilometers:</strong> ${car.warrantyDetails.warrantyKilometers} km</p>

                <!-- Comfort Features -->
                             <h3>Comfort Features</h3>
                      <p><strong>Sunroof:</strong> ${car.comfortFeatures.hasSunroof} </p>
                                       <p><strong>Heated Seats:</strong> ${car.comfortFeatures.hasHeatedSeats}</p>
                                       <p><strong>Ventilated Seats:</strong> ${car.comfortFeatures.hasVentilatedSeats} </p>
                                       <p><strong>Automatic ClimateControl:</strong> ${car.comfortFeatures.hasAutomaticClimateControl} </p>


                       <!-- Technology Features -->
                              <h3>Technology Features</h3>
                                  ${generateListHTML(car.technologyFeatures.techFeatures, 'Technology Feature')}

                       <!-- Safety Features -->
                             <h3>Safety Features</h3>
                                 ${generateListHTML(car.safetyFeatures.safetyFeatures, 'Safety Feature')}
                                 <p>Air Bags Counts: ${car.safetyFeatures.airbagsCount} </p>
    `;

    container.innerHTML = carDetailsHTML;3
}

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

// Execute after the page has fully loaded
window.onload = function() {
    // Get car IDs from URL
    const currentCarId = getUrlParameter('currentCar');
    const car1Id = getUrlParameter('car1');
    const car2Id = getUrlParameter('car2');

    // Fetch and display details for each car
    fetchCarDetails(currentCarId, 'currentCarDetails');
    fetchCarDetails(car1Id, 'car1Details');
    fetchCarDetails(car2Id, 'car2Details');
};
