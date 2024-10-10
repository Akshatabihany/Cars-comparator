// scripts.js

// Function to search for cars based on user input
async function searchCar() {
    const query = document.getElementById('carSearch').value;

    if (query.length < 3) {  // Trigger search only if the input has at least 3 characters
        document.getElementById('searchResult').innerHTML = '';
        return;
    }

    try {
        // Ensure that the parameter matches your controller's request mapping
        const response = await fetch(`/api/cars/search?brand=${query}`);
        const carNames = await response.json();

        // Display the search results
        displaySearchResults(carNames);
    } catch (error) {
        console.error('Error fetching car names:', error);
    }
}

// Function to display search results in the result div
function displaySearchResults(carNames) {
    const resultDiv = document.getElementById('searchResult');
    resultDiv.innerHTML = ''; // Clear previous results

    if (carNames.length === 0) {
        resultDiv.innerHTML = '<p>No cars found.</p>';
        return;
    }

    carNames.forEach(car => {
        const div = document.createElement('div');
        div.textContent = car;  // Assuming car is a string
        resultDiv.appendChild(div);
    });
}

// Add an event listener to the input field to trigger search on input
document.getElementById('carSearch').addEventListener('input', searchCar);

// Suggestion fetching based on user input
function fetchCarSuggestions() {
    const brand = document.getElementById("carSearch").value;
    if (brand.length > 2) { // Start fetching suggestions only after 3 characters
        fetch(`/api/cars/search?brand=${brand}`)
            .then(response => response.json())
            .then(data => {
                console.log("Data from API:", data); // Log the entire response to verify structure

                // If you're expecting an array of cars with 'brand' and 'model' properties:
                if (!Array.isArray(data)) {
                    console.error("API response is not an array");
                    return;
                }

                // Optional: Filter unique data if needed (you can skip this if no duplicates)
                const uniqueData = data.filter((car, index, self) =>
                    index === self.findIndex(c => c.id === car.id)
                );
                console.log("Unique Data:", uniqueData); // Log the filtered data

                let suggestions = document.getElementById("suggestions");
                suggestions.innerHTML = ""; // Clear previous suggestions

                uniqueData.forEach(car => {
                    if (car.brand && car.model && car.id) { // Ensure car object has required fields
                        let div = document.createElement("div");
                        console.log("car:", car.brand); // Log the filtered data

                        // Display both brand and model properly
                        div.textContent = `${car.brand}`;

                        div.classList.add("suggestion-item");
                        div.setAttribute("data-id", car.id); // Store the car ID as a data attribute
                        div.onclick = () => selectCar(car.id); // Pass the car ID to selectCar
                        suggestions.appendChild(div);
                    } else {
                        console.warn("Car object missing required fields:", car);
                    }
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    } else {
        document.getElementById("suggestions").innerHTML = ""; // Clear suggestions if less than 3 chars
    }
}


// Add event listener to call suggestions when user types
document.getElementById('carSearch').addEventListener('input', fetchCarSuggestions);

//function selectCar(car) {
//    document.getElementById("carSearch").value = car;
//    document.getElementById("suggestions").innerHTML = ""; // Clear suggestions once selected
//}

// Function to select a car from suggestions
function selectCar(carId) {
    selectedCarId = carId; // Store the selected car ID
    const car = document.querySelector(`.suggestion-item[data-id="${carId}"]`);
    document.getElementById("carSearch").value = car.textContent; // Set the input field
    document.getElementById("suggestions").innerHTML = ""; // Clear suggestions
    document.getElementById("viewDetailsButton").disabled = false; // Enable the "View Details" button
}

// Function to redirect to car details page
function redirectToCarDetails() {
    if (selectedCarId) {
        window.location.href = `/car-details.html?id=${selectedCarId}`; // Redirect to car details page with car ID
        console.log("window.location.href : "+ window.location.href);
    }

   }