const selectedCars = new Set();

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to fetch car details
async function fetchCarDetails() {
    const carId = getUrlParameter('id'); // Get car ID from URL
    console.log("Car ID:", carId); // Verify car ID

    try {
        const response = await fetch(`/api/cars/${carId}`); // Use backticks around the entire URL
        if (!response.ok) {
            throw new Error('Car not found');
        }
        const car = await response.json();
        console.log("Fetched Car Data:", car); // Log car data to ensure it's fetched
        displayCarDetails(car);

        console.log("Fetching similar cars..."); // Log before fetching similar cars
        fetchSimilarCars(carId); // Fetch similar cars after displaying car details
    } catch (error) {
        console.error('Error fetching car details:', error);
        alert('Car details could not be retrieved.');
    }
}

function displayCarDetails(car) {
    const carInfoContainer = document.getElementById('carInfo');
    const carouselContainer = document.getElementById('carousel');

   const carDetailsHTML = `
       <h2>${car.brand} ${car.model} ${car.variant} (${car.year})</h2>
       <p><strong>Price:</strong> $${car.price}</p>
       <p><strong>Body Type:</strong> ${car.bodyType}</p>
       <p><strong>Exterior Color:</strong> ${car.exteriorColor}</p>
       <p><strong>Interior Color:</strong> ${car.interiorColor}</p>

       <!-- Engine Details -->
       <h4 class="toggle-header" style="cursor: pointer;">Engine Details</h4>
       <div class="toggle-content" style="display: none;">
           <p><strong>Type:</strong> ${car.engineDetails.engineType}</p>
           <p><strong>Horsepower:</strong> ${car.engineDetails.horsepower} HP</p>
           <p><strong>Torque:</strong> ${car.engineDetails.torque} Nm</p>
           <p><strong>Displacement:</strong> ${car.engineDetails.displacement}</p>
           <p><strong>Transmission Type:</strong> ${car.engineDetails.transmissionType}</p>
           <p><strong>Number Of Gears:</strong> ${car.engineDetails.numberOfGears}</p>

       </div>

       <!-- Performance Details -->
       <h4 class="toggle-header" style="cursor: pointer;">Performance Details</h4>
       <div class="toggle-content" style="display: none;">
           <p><strong>Top Speed:</strong> ${car.performanceDetails.topSpeed} km/h</p>
           <p><strong>Acceleration (0-100 km/h):</strong> ${car.performanceDetails.zeroToHundredTime} seconds</p>
       </div>

       <!-- Fuel Economy -->
       <h4 class="toggle-header" style="cursor: pointer;">Fuel Economy</h4>
       <div class="toggle-content" style="display: none;">
           <p><strong>City Mileage:</strong> ${car.fuelEconomy.cityMileage} km/l</p>
           <p><strong>Highway Mileage:</strong> ${car.fuelEconomy.highwayMileage} km/l</p>
           <p><strong>Fuel Tank Capacity:</strong> ${car.fuelEconomy.fuelTankCapacity} km/l</p>
       </div>

       <!-- Dimensions -->
       <h4 class="toggle-header" style="cursor: pointer;">Dimensions</h4>
       <div class="toggle-content" style="display: none;">
           <p><strong>Length:</strong> ${car.dimensions.length} mm</p>
           <p><strong>Width:</strong> ${car.dimensions.width} mm</p>
           <p><strong>Height:</strong> ${car.dimensions.height} mm</p>
       </div>

       <!-- Warranty Details -->
       <h4 class="toggle-header" style="cursor: pointer;">Warranty Details</h4>
       <div class="toggle-content" style="display: none;">
           <p><strong>Duration:</strong> ${car.warrantyDetails.warrantyYears} years</p>
           <p><strong>Warranty in Kilometers:</strong> ${car.warrantyDetails.warrantyKilometers} km</p>
       </div>

       <!-- Comfort Features -->
              <h4 class="toggle-header" style="cursor: pointer;">Comfort Details</h4>
              <div class="toggle-content" style="display: none;">
                  <p><strong>Sunroof:</strong> ${car.comfortFeatures.hasSunroof} </p>
                  <p><strong>Heated Seats:</strong> ${car.comfortFeatures.hasHeatedSeats}</p>
                  <p><strong>Ventilated Seats:</strong> ${car.comfortFeatures.hasVentilatedSeats} </p>
                  <p><strong>Automatic ClimateControl:</strong> ${car.comfortFeatures.hasAutomaticClimateControl} </p>
              </div>

       <!-- Technology Features -->
              <h4 class="toggle-header" style="cursor: pointer;">Technology Features</h4>
              <div class="toggle-content" style="display: none;">
                  ${generateListHTML(car.technologyFeatures.techFeatures, 'Technology Feature')}
              </div>

       <!-- Safety Features -->
             <h4 class="toggle-header" style="cursor: pointer;">Safety Features</h4>
             <div class="toggle-content" style="display: none;">
                 ${generateListHTML(car.safetyFeatures.safetyFeatures, 'Safety Feature')}
                 <p>Air Bags Counts: ${car.safetyFeatures.airbagsCount} </p>
             </div>

   `;

   // Inject the HTML content
   document.getElementById('carInfo').innerHTML = carDetailsHTML;

   // Add event listeners to each header after the content is loaded
   document.querySelectorAll('.toggle-header').forEach(header => {
       header.addEventListener('click', () => {
           const content = header.nextElementSibling;
           content.style.display = content.style.display === 'none' ? 'block' : 'none';
       });
   });

    // Carousel logic remains unchanged
    if (car.images && Array.isArray(car.images.imageUrl) && car.images.imageUrl.length > 0) {
        let carouselHTML = '';
        car.images.imageUrl.forEach((imageUrl, index) => {
            carouselHTML += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imageUrl}" class="d-block" alt="${car.model} image">
                </div>
            `;
        });
        carouselContainer.innerHTML = carouselHTML;
    } else {
        carouselContainer.innerHTML = '<p>No images available.</p>';
    }
}

// Helper function to generate list HTML dynamically
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

// Function to fetch similar cars
async function fetchSimilarCars(carId) {
    console.log("Inside fetchSimilarCars, Car ID:", carId); // Check if this function is called
    try {
        const response = await fetch(`/api/cars/similar/${carId}`); // API call to get similar cars
        if (!response.ok) {
            throw new Error('Could not fetch similar cars');
        }
        console.log("similar cars :" + response);
        const similarCars = await response.json();
        console.log("Fetched Similar Cars:", similarCars); // Log similar cars data
        displaySimilarCars(similarCars);
    } catch (error) {
        console.error('Error fetching similar cars:', error);
    }
}

// Function to display similar cars
function displaySimilarCars(cars) {
    const similarCarsList = document.getElementById('similarCarsList');
    similarCarsList.innerHTML = ''; // Clear previous content

    cars.forEach(car => {
        const listItem = document.createElement('li');
        listItem.className = 'similar-car-item';
        listItem.textContent = `${car.brand} ${car.model}`; // Corrected text content
        listItem.setAttribute('data-car-id', car.id); // Add data-car-id attribute
        similarCarsList.appendChild(listItem);
    });

    // Sample JavaScript to make similar cars clickable and manage the compare button
    document.querySelectorAll('.similar-car-item').forEach(item => {
        item.addEventListener('click', () => {
            const carId = item.getAttribute('data-car-id'); // Get car ID from the data attribute

            if (selectedCars.has(carId)) {
                selectedCars.delete(carId); // Deselect car
                item.classList.remove('selected'); // Remove selected class
            } else {
                if (selectedCars.size < 2) {
                    selectedCars.add(carId); // Select car
                    item.classList.add('selected'); // Add selected class
                } else {
                    alert('You can only select up to 2 cars for comparison.'); // Warn the user
                }
            }

            // Enable button if two cars are selected
            document.getElementById('compareButton').style.display = selectedCars.size === 2 ? 'block' : 'none';
        });
    });
}

function compareCars() {
    if (selectedCars.size === 2) {
        const carIds = Array.from(selectedCars);
        const currentCarId = getUrlParameter('id'); // Assuming the current car ID is available as a URL parameter
        const compareUrl = `compare.html?currentCar=${currentCarId}&car1=${carIds[0]}&car2=${carIds[1]}`;
        window.location.href = compareUrl; // Redirect to compare.html with the selected car IDs
    } else {
        alert('Please select exactly two cars to compare.'); // If less than 2 cars are selected
    }
}

function toggleSection(header) {
    const content = header.nextElementSibling;
    if (content.style.display === "none") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
}

// Call the function to fetch car details when the page loads
window.onload = fetchCarDetails;
