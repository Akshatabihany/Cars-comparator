//// car-details.js
//
//// Function to get URL parameters
//function getUrlParameter(name) {
//    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
//    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
//    const results = regex.exec(location.search);
//    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
//}
//
//// Function to fetch car details
//async function fetchCarDetails() {
//    const carId = getUrlParameter('id'); // Get car ID from URL
//   selectedCarId = id;
//    try {
//        const response = await fetch(`/api/cars/${carId}`); // API call to fetch car details
//        if (!response.ok) {
//            throw new Error('Car not found');
//        }
//        const car = await response.json();
//        console.log("Parsed Car Data:", car); // Log the car data to verify structure
//        displayCarDetails(car);
//    } catch (error) {
//        console.error('Error fetching car details:', error);
//        alert('Car details could not be retrieved.');
//    }
//}
//
//// Function to display car details on the page
//function displayCarDetails(car) {
//    // 1. Get the car info container
//    const carInfoContainer = document.getElementById('carInfo');
//    const carouselContainer = document.getElementById('carouselContainer');
//
//    // 2. Build the car info section
//    const carDetailsHTML = `
//        <h2>${car.name}</h2>
//        <p><strong>Model:</strong> ${car.model}</p>
//        <p><strong>Manufacturer:</strong> ${car.manufacturer}</p>
//        <p><strong>Price:</strong> $${car.price}</p>
//        <p><strong>Year:</strong> ${car.year}</p>
//        <p><strong>Fuel Type:</strong> ${car.fuelType}</p>
//        <p><strong>Transmission:</strong> ${car.transmission}</p>
//        <p><strong>Mileage:</strong> ${car.mileage} km/l</p>
//    `;
//
//    // 3. Inject the car details HTML into the car info container
//    carInfoContainer.innerHTML = carDetailsHTML;
//
//    // 4. Build the image carousel (assuming car.images is an array of URLs)
//    if (car.images && Array.isArray(car.images.imageUrl) && car.images.imageUrl.length > 0) {
//        let carouselHTML = `<div class="carousel">`;
//        car.images.imageUrl.forEach(imageUrl => {
//            carouselHTML += `
//                <div class="carousel-item">
//                    <img src="${imageUrl}" alt="${car.model} image">
//                </div>
//            `;
//        });
//        carouselHTML += `</div>`;
//        carouselContainer.innerHTML = carouselHTML;
//    } else {
//        carouselContainer.innerHTML = '<p>No images available.</p>';
//    }
//}
//
//// Call the function to fetch car details when the page loads
//window.onload = fetchCarDetails;

// car-details.js

// car-details.js

// Function to get URL parameters
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
        const response = await fetch(`/api/cars/${carId}`); // API call to fetch car details
        if (!response.ok) {
            throw new Error('Car not found');
        }
        const car = await response.json();
        console.log("Fetched Car Data:", car); // Log car data to ensure it's fetched
       // displayCarDetails(car);

        console.log("Fetching similar cars..."); // Log before fetching similar cars
        fetchSimilarCars(carId); // Fetch similar cars after displaying car details
    } catch (error) {
        console.error('Error fetching car details:', error);
        alert('Car details could not be retrieved.');
    }
}

// Function to display car details on the page
function displayCarDetails(car) {
    const carInfoContainer = document.getElementById('carInfo');
    const carouselContainer = document.getElementById('carouselContainer');

    const carDetailsHTML = `
        <h2>${car.brand} ${car.model} ${car.variant} (${car.year})</h2>
        <p><strong>Price:</strong> $${car.price}</p>
        <p><strong>Body Type:</strong> ${car.bodyType}</p>
        <p><strong>Exterior Color:</strong> ${car.exteriorColor}</p>
        <p><strong>Interior Color:</strong> ${car.interiorColor}</p>
    `;

    carInfoContainer.innerHTML = carDetailsHTML;

    if (car.images && Array.isArray(car.images.imageUrl) && car.images.imageUrl.length > 0) {
        let carouselHTML = `<div class="carousel">`;
        car.images.imageUrl.forEach((imageUrl, index) => {
            carouselHTML += `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imageUrl}" class="d-block" alt="${car.model} image">
                </div>
            `;
        });
        carouselHTML += `</div>`;
        carouselContainer.innerHTML = carouselHTML;
    } else {
        carouselContainer.innerHTML = '<p>No images available.</p>';
    }
}

// Function to fetch similar cars
async function fetchSimilarCars(carId) {
    console.log("Inside fetchSimilarCars, Car ID:", carId); // Check if this function is called
    try {
        const response = await fetch(`/api/cars/${carId}/similar`); // API call to get similar cars
        if (!response.ok) {
            throw new Error('Could not fetch similar cars');
        }
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
        listItem.textContent = `${car.brand} ${car.model}`;
        similarCarsList.appendChild(listItem);
    });
}

// Call the function to fetch car details when the page loads
window.onload = fetchCarDetails;
