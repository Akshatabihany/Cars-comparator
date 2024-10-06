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
                let suggestions = document.getElementById("suggestions");
                suggestions.innerHTML = ""; // Clear previous suggestions

                data.forEach(car => {
                    let div = document.createElement("div");
                    div.textContent = car;
                    div.classList.add("suggestion-item");
                    div.onclick = () => selectCar(car);
                    suggestions.appendChild(div);
                });
            })
            .catch(error => console.error('Error:', error));
    } else {
        document.getElementById("suggestions").innerHTML = ""; // Clear suggestions if less than 3 chars
    }
}

// Add event listener to call suggestions when user types
document.getElementById('carSearch').addEventListener('input', fetchCarSuggestions);

function selectCar(car) {
    document.getElementById("carSearch").value = car;
    document.getElementById("suggestions").innerHTML = ""; // Clear suggestions once selected
}