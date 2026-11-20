
// ==========================================
// GET HTML ELEMENTS
// ==========================================

const cityCountInput = document.getElementById("cityCount");
const generateBtn = document.getElementById("generateBtn");
const cityInputs = document.getElementById("cityInputs");
const distanceInputs = document.getElementById("distanceInputs");
const message = document.getElementById("message");

const algorithmExplanation = document.getElementById("algorithmExplanation");
const algorithmResult = document.getElementById("algorithmResult");

const algorithmButtons = document.querySelectorAll(".algorithm-btn");

// Visual route elements
const routeVisualization = document.getElementById("routeVisualization");
const routeDiagram = document.getElementById("routeDiagram");


// ==========================================
// LIVE COMPARISON SETUP
// ==========================================

let comparisonResults = {};

const comparisonSection = document.querySelector(".comparison-section");

const liveComparison = document.createElement("div");

liveComparison.id = "liveComparison";
liveComparison.className = "live-comparison";

liveComparison.innerHTML = `
    <h3>Live Results Comparison</h3>

    <p>
        Run all four algorithms using the same city inputs
        to compare their actual results.
    </p>

    <p id="comparisonStatus">
        No algorithm results available yet.
    </p>

    <div id="comparisonResults"></div>
`;

if (comparisonSection) {
    comparisonSection.appendChild(liveComparison);
}

const comparisonResultsContainer =
    document.getElementById("comparisonResults");

const comparisonStatus =
    document.getElementById("comparisonStatus");


// ==========================================
// RESET LIVE COMPARISON AND STATISTICS
// ==========================================

function resetComparison() {

    comparisonResults = {};

    if (comparisonStatus) {
        comparisonStatus.textContent =
            "Inputs changed. Run the algorithms again to compare results.";
    }

    if (comparisonResultsContainer) {
        comparisonResultsContainer.innerHTML = "";
    }

    // Clear old execution statistics
    const statsPanel = document.getElementById("executionStats");

    if (statsPanel) {
        statsPanel.remove();
    }

}


// ==========================================
// DISPLAY LIVE COMPARISON
// ==========================================

function displayLiveComparison() {

    const algorithmNames = {
        brute: "Brute Force",
        greedy: "Greedy",
        dp: "Dynamic Programming",
        backtracking: "Backtracking"
    };

    const algorithmOrder = [
        "brute",
        "greedy",
        "dp",
        "backtracking"
    ];

    const completedCount = Object.keys(comparisonResults).length;

    comparisonStatus.textContent =
        `${completedCount} of 4 algorithms completed.`;

    if (completedCount < 4) {

        comparisonResultsContainer.innerHTML = `
            <p>
                Run the remaining ${4 - completedCount}
                algorithm(s) to complete the comparison.
            </p>
        `;

    } else {

        comparisonStatus.textContent =
            "All four algorithms have been executed successfully!";

        let tableHTML = `
            <div class="comparison-container">

                <table class="comparison-table">

                    <thead>
                        <tr>
                            <th>Algorithm</th>
                            <th>Calculated Route</th>
                            <th>Total Distance</th>
                        </tr>
                    </thead>

                    <tbody>
        `;

        algorithmOrder.forEach(algorithm => {

            const result = comparisonResults[algorithm];

            const safeRoute = result.route.map(escapeHTML);

            tableHTML += `
                <tr>
                    <td>${algorithmNames[algorithm]}</td>
                    <td>${safeRoute.join(" → ")}</td>
                    <td>${result.distance}</td>
                </tr>
            `;

        });

        tableHTML += `
                    </tbody>

                </table>

            </div>
        `;

        comparisonResultsContainer.innerHTML = tableHTML;

    }

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


// ==========================================
// GENERATE CITY AND DISTANCE INPUTS
// ==========================================

generateBtn.addEventListener("click", function () {

    const count = Number(cityCountInput.value);

    if (!Number.isInteger(count) || count < 3 || count > 10) {

        message.textContent =
            "Please enter between 3 and 10 cities.";

        message.style.color = "#ef4444";

        return;
    }

    cityInputs.innerHTML = "";
    distanceInputs.innerHTML = "";

    algorithmExplanation.innerHTML =
        "Select an algorithm to view its explanation.";

    algorithmResult.innerHTML = "";

    // Clear previous visual route
    routeDiagram.innerHTML = "";

    const routeDistance = document.getElementById("routeDistance");

    if (routeDistance) {
        routeDistance.remove();
    }

    routeVisualization.querySelector("p").textContent =
        "Run an algorithm to visualize the calculated route.";

    resetComparison();

    algorithmButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Generate city name inputs
    cityInputs.innerHTML = "<h3>Enter City Names</h3>";

    for (let i = 0; i < count; i++) {

        cityInputs.innerHTML += `
            <div class="city-input">

                <label for="city${i}">
                    City ${i + 1}
                </label>

                <input
                    type="text"
                    id="city${i}"
                    placeholder="Enter city name"
                >

            </div>
        `;
    }

    // Generate distance inputs
    distanceInputs.innerHTML =
        "<h3>Enter Distances Between Cities</h3>";

    for (let i = 0; i < count; i++) {

        for (let j = i + 1; j < count; j++) {

            distanceInputs.innerHTML += `
                <div class="distance-row">

                    <div>

                        <label for="distance${i}_${j}">
                            Distance: City ${i + 1} to City ${j + 1}
                        </label>

                        <input
                            type="number"
                            id="distance${i}_${j}"
                            min="1"
                            step="any"
                            placeholder="Enter distance"
                        >

                    </div>

                </div>
            `;
        }
    }

    message.textContent =
        "City and distance fields generated successfully!";

    message.style.color = "#22c55e";

});


// ==========================================
// RESET COMPARISON WHEN INPUTS CHANGE
// ==========================================

cityInputs.addEventListener("input", resetComparison);
distanceInputs.addEventListener("input", resetComparison);


// ==========================================
// COLLECT CITY NAMES AND DISTANCES
// ==========================================

function getCityData() {

    const count = Number(cityCountInput.value);

    const cities = [];
    const distances = [];

    // Collect city names
    for (let i = 0; i < count; i++) {

        const cityInput = document.getElementById(`city${i}`);

        if (!cityInput || cityInput.value.trim() === "") {

            message.textContent =
                `Please enter the name of City ${i + 1}.`;

            message.style.color = "#ef4444";

            return null;
        }

        cities.push(cityInput.value.trim());
    }

    // Check duplicate city names
    const uniqueCities = cities.map(city => city.toLowerCase());

    if (new Set(uniqueCities).size !== cities.length) {

        message.textContent =
            "Please enter different names for every city.";

        message.style.color = "#ef4444";

        return null;
    }

    // Initialize distance matrix
    for (let i = 0; i < count; i++) {
        distances[i] = Array(count).fill(0);
    }

    // Collect distances
    for (let i = 0; i < count; i++) {

        for (let j = i + 1; j < count; j++) {

            const distanceInput =
                document.getElementById(`distance${i}_${j}`);

            if (!distanceInput || distanceInput.value.trim() === "") {

                message.textContent =
                    `Please enter the distance between ${cities[i]} and ${cities[j]}.`;

                message.style.color = "#ef4444";

                return null;
            }

            const distance = Number(distanceInput.value);

            if (!Number.isFinite(distance) || distance <= 0) {

                message.textContent =
                    "Please enter a valid positive distance.";

                message.style.color = "#ef4444";

                return null;
            }

            distances[i][j] = distance;
            distances[j][i] = distance;

        }
    }

    message.textContent =
        "City details and distances collected successfully!";

    message.style.color = "#22c55e";

    return { cities, distances };

}


// ==========================================
// BRUTE FORCE ALGORITHM
// ==========================================

function bruteForceTSP(cities, distances) {

    const n = cities.length;

    let minimumDistance = Infinity;
    let bestRoute = [];

    function findRoutes(currentCity, visited, currentRoute, totalDistance) {

        if (currentRoute.length === n) {

            const finalDistance =
                totalDistance + distances[currentCity][0];

            if (finalDistance < minimumDistance) {

                minimumDistance = finalDistance;
                bestRoute = [...currentRoute, 0];

            }

            return;
        }

        for (let nextCity = 1; nextCity < n; nextCity++) {

            if (!visited[nextCity]) {

                visited[nextCity] = true;
                currentRoute.push(nextCity);

                findRoutes(
                    nextCity,
                    visited,
                    currentRoute,
                    totalDistance + distances[currentCity][nextCity]
                );

                currentRoute.pop();
                visited[nextCity] = false;

            }
        }
    }

    const visited = Array(n).fill(false);

    visited[0] = true;

    findRoutes(0, visited, [0], 0);

    return {
        route: bestRoute.map(index => cities[index]),
        distance: minimumDistance
    };

}


// ==========================================
// GREEDY ALGORITHM
// ==========================================

function greedyTSP(cities, distances) {

    const n = cities.length;

    const visited = Array(n).fill(false);

    let currentCity = 0;
    let totalDistance = 0;

    const route = [0];

    visited[0] = true;

    for (let i = 1; i < n; i++) {

        let nearestCity = -1;
        let minimumDistance = Infinity;

        for (let j = 0; j < n; j++) {

            if (!visited[j] && distances[currentCity][j] < minimumDistance) {

                minimumDistance = distances[currentCity][j];
                nearestCity = j;

            }
        }

        visited[nearestCity] = true;

        totalDistance += minimumDistance;

        route.push(nearestCity);

        currentCity = nearestCity;

    }

    totalDistance += distances[currentCity][0];

    route.push(0);

    return {
        route: route.map(index => cities[index]),
        distance: totalDistance
    };

}


// ==========================================
// DYNAMIC PROGRAMMING ALGORITHM
// ==========================================

function dynamicProgrammingTSP(cities, distances) {

    const n = cities.length;
    const totalMasks = 1 << n;

    const dp = Array.from(
        { length: totalMasks },
        () => Array(n).fill(Infinity)
    );

    const parent = Array.from(
        { length: totalMasks },
        () => Array(n).fill(-1)
    );

    dp[1][0] = 0;

    for (let mask = 1; mask < totalMasks; mask++) {

        for (let current = 0; current < n; current++) {

            if (!(mask & (1 << current))) {
                continue;
            }

            if (dp[mask][current] === Infinity) {
                continue;
            }

            for (let next = 0; next < n; next++) {

                if (mask & (1 << next)) {
                    continue;
                }

                const newMask = mask | (1 << next);

                const newDistance =
                    dp[mask][current] + distances[current][next];

                if (newDistance < dp[newMask][next]) {

                    dp[newMask][next] = newDistance;
                    parent[newMask][next] = current;

                }
            }
        }
    }

    const fullMask = totalMasks - 1;

    let minimumDistance = Infinity;
    let lastCity = -1;

    for (let city = 1; city < n; city++) {

        const totalDistance =
            dp[fullMask][city] + distances[city][0];

        if (totalDistance < minimumDistance) {

            minimumDistance = totalDistance;
            lastCity = city;

        }
    }

    const route = [];

    let mask = fullMask;
    let current = lastCity;

    while (current !== -1) {

        route.push(current);

        const previous = parent[mask][current];

        mask = mask ^ (1 << current);
        current = previous;

    }

    route.reverse();
    route.push(0);

    return {
        route: route.map(index => cities[index]),
        distance: minimumDistance
    };

}


// ==========================================
// BACKTRACKING ALGORITHM
// ==========================================

function backtrackingTSP(cities, distances) {

    const n = cities.length;

    let minimumDistance = Infinity;
    let bestRoute = [];

    const visited = Array(n).fill(false);

    visited[0] = true;

    function findRoute(currentCity, currentDistance, route) {

        if (currentDistance >= minimumDistance) {
            return;
        }

        if (route.length === n) {

            const totalDistance =
                currentDistance + distances[currentCity][0];

            if (totalDistance < minimumDistance) {

                minimumDistance = totalDistance;
                bestRoute = [...route, 0];

            }

            return;
        }

        for (let nextCity = 1; nextCity < n; nextCity++) {

            if (!visited[nextCity]) {

                visited[nextCity] = true;
                route.push(nextCity);

                findRoute(
                    nextCity,
                    currentDistance + distances[currentCity][nextCity],
                    route
                );

                route.pop();
                visited[nextCity] = false;

            }
        }
    }

    findRoute(0, 0, [0]);

    return {
        route: bestRoute.map(index => cities[index]),
        distance: minimumDistance
    };

}


// ==========================================
// ALGORITHM EXPLANATIONS
// ==========================================

const algorithmDetails = {

    brute: {

        title: "Brute Force Algorithm",

        overview:
            "Brute Force checks every possible route and selects the route with the minimum total distance.",

        steps: [
            "Start from the first city.",
            "Generate every possible order of visiting the remaining cities.",
            "Calculate the distance of each route.",
            "Return to the starting city after visiting all cities.",
            "Compare all route distances and select the smallest one."
        ],

        time: "O(n!)",
        space: "O(n)",

        optimal:
            "Yes. It checks every possible route and guarantees the optimal solution.",

        working:
            "For n cities, the algorithm examines (n - 1)! possible visiting orders."

    },

    greedy: {

        title: "Greedy Algorithm",

        overview:
            "Greedy selects the nearest unvisited city at every step to build a route.",

        steps: [
            "Start from the first city.",
            "Find the nearest unvisited city.",
            "Move to that city and mark it as visited.",
            "Repeat until every city has been visited.",
            "Return to the starting city and calculate the total distance."
        ],

        time: "O(n²)",
        space: "O(n)",

        optimal:
            "No. It makes locally best choices and does not guarantee the globally shortest route.",

        working:
            "The algorithm checks the distances from the current city to find the nearest unvisited city."

    },

    dp: {

        title: "Dynamic Programming Algorithm",

        overview:
            "Dynamic Programming uses previously calculated results to find the shortest route efficiently. This approach is known as the Held-Karp algorithm.",

        steps: [
            "Start from the first city with distance zero.",
            "Represent visited-city combinations using bitmasks.",
            "Calculate the minimum distance for each combination of visited cities and current city.",
            "Store the best results to avoid repeating calculations.",
            "Find the minimum complete route and return to the starting city."
        ],

        time: "O(n² × 2ⁿ)",
        space: "O(n × 2ⁿ)",

        optimal:
            "Yes. It examines all relevant subsets and guarantees the optimal solution.",

        working:
            "The algorithm stores the minimum distance for each visited-city combination and uses these results to build the final route."

    },

    backtracking: {

        title: "Backtracking Algorithm",

        overview:
            "Backtracking explores possible routes and abandons a route when its current distance cannot improve the best solution already found.",

        steps: [
            "Start from the first city.",
            "Choose an unvisited city and add its distance.",
            "Continue exploring the selected route.",
            "If the current distance is already greater than or equal to the best complete route, stop exploring that path.",
            "Return to the previous city and try another unvisited city.",
            "Select the shortest complete route found."
        ],

        time: "O(n!)",
        space: "O(n)",

        optimal:
            "Yes. With positive distances, pruning only removes routes that cannot improve the current best solution.",

        working:
            "Backtracking uses recursion and pruning to avoid exploring some routes that cannot produce a better answer."

    }

};


// ==========================================
// DISPLAY ALGORITHM EXPLANATION
// ==========================================

function displayAlgorithmExplanation(algorithm) {

    const details = algorithmDetails[algorithm];

    const stepsHTML = details.steps.map(step => `
        <li>${escapeHTML(step)}</li>
    `).join("");

    algorithmExplanation.innerHTML = `

        <h4>${details.title}</h4>

        <p>${escapeHTML(details.overview)}</p>

        <h4>How the Algorithm Works</h4>

        <ol>
            ${stepsHTML}
        </ol>

        <h4>Working Principle</h4>

        <p>${escapeHTML(details.working)}</p>

    `;

}


// ==========================================
// DISPLAY ALGORITHM RESULT
// ==========================================

function displayAlgorithmResult(algorithm, result) {

    const details = algorithmDetails[algorithm];

    const safeRoute = result.route.map(escapeHTML);

    const routeLabel = algorithm === "greedy"
        ? "Calculated Route"
        : "Optimal Route";

    algorithmResult.innerHTML = `

        <h4>${routeLabel}</h4>

        <p class="result-route">
            ${safeRoute.join(" → ")}
        </p>

        <h4>Total Distance</h4>

        <p class="result-distance">
            ${result.distance}
        </p>

        <h4>Time Complexity</h4>

        <p>${details.time}</p>

        <h4>Space Complexity</h4>

        <p>${details.space}</p>

        <h4>Does It Guarantee an Optimal Route?</h4>

        <p>${details.optimal}</p>

    `;

}


// ==========================================
// DISPLAY VISUAL ROUTE
// ==========================================

function displayRouteVisualization(algorithm, result) {

    // Clear previous route
    routeDiagram.innerHTML = "";

    // Select correct route label
    const routeLabel = algorithm === "greedy"
        ? "Calculated Route"
        : "Optimal Route";

    // Update description
    const description = routeVisualization.querySelector("p");

    description.textContent =
        `${algorithmDetails[algorithm].title} - ${routeLabel}`;

    // Add starting city indicator
    const startLabel = document.createElement("p");

    startLabel.className = "route-start-label";
    startLabel.textContent = "START";

    routeDiagram.appendChild(startLabel);

    // Display every city and arrow
    result.route.forEach((city, index) => {

        const cityElement = document.createElement("span");

        cityElement.className = "route-city";
        cityElement.textContent = city;

        // Highlight starting city
        if (index === 0) {
            cityElement.classList.add("start-city");
        }

        // Highlight final return to starting city
        if (index === result.route.length - 1) {
            cityElement.classList.add("start-city");
        }

        routeDiagram.appendChild(cityElement);

        // Add arrows between cities
        if (index < result.route.length - 1) {

            const arrow = document.createElement("span");

            arrow.className = "route-arrow";
            arrow.textContent = "→";

            routeDiagram.appendChild(arrow);

        }

    });

    // Add return indicator
    const returnLabel = document.createElement("p");

    returnLabel.className = "route-return-label";
    returnLabel.textContent = "RETURN TO START";

    routeDiagram.appendChild(returnLabel);

    // Display total distance
    let distanceInfo = document.getElementById("routeDistance");

    if (!distanceInfo) {

        distanceInfo = document.createElement("p");
        distanceInfo.id = "routeDistance";

        routeDiagram.after(distanceInfo);

    }

    distanceInfo.textContent =
        `Total Route Distance: ${result.distance}`;

}


// ==========================================
// DISPLAY ALGORITHM EXECUTION STATISTICS
// ==========================================

function displayExecutionStats(algorithm, cities, result, executionTime) {

    let statsPanel = document.getElementById("executionStats");

    // Create the panel if it does not exist
    if (!statsPanel) {

        statsPanel = document.createElement("div");

        statsPanel.id = "executionStats";
        statsPanel.className = "execution-stats";

        routeVisualization.after(statsPanel);

    }

    // Display statistics
    statsPanel.innerHTML = `

        <h3>Algorithm Execution Statistics</h3>

        <div class="stats-grid">

            <div class="stat-card">
                <span>Selected Algorithm</span>
                <strong>${algorithmDetails[algorithm].title}</strong>
            </div>

            <div class="stat-card">
                <span>Number of Cities</span>
                <strong>${cities.length}</strong>
            </div>

            <div class="stat-card">
                <span>Total Distance</span>
                <strong>${result.distance}</strong>
            </div>

            <div class="stat-card">
                <span>Execution Time</span>
                <strong>${executionTime.toFixed(3)} ms</strong>
            </div>

        </div>

    `;

}


// ==========================================
// CONNECT ALGORITHM BUTTONS
// ==========================================

algorithmButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Collect city data
        const data = getCityData();

        if (!data) {
            return;
        }

        const { cities, distances } = data;

        let result;

        const algorithm = button.dataset.algorithm;

        // START measuring algorithm execution time
        const startTime = performance.now();

        // Execute selected algorithm
        if (algorithm === "brute") {

            result = bruteForceTSP(cities, distances);

        }
        else if (algorithm === "greedy") {

            result = greedyTSP(cities, distances);

        }
        else if (algorithm === "dp") {

            result = dynamicProgrammingTSP(cities, distances);

        }
        else if (algorithm === "backtracking") {

            result = backtrackingTSP(cities, distances);

        }

        // END measuring algorithm execution time
        const endTime = performance.now();

        const executionTime = endTime - startTime;

        // Validate result
        if (
            !result ||
            !Number.isFinite(result.distance) ||
            result.route.length === 0
        ) {

            message.textContent =
                "Unable to calculate the route.";

            message.style.color = "#ef4444";

            return;
        }

        // Highlight selected algorithm
        algorithmButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Display algorithm information
        displayAlgorithmExplanation(algorithm);

        displayAlgorithmResult(algorithm, result);

        // Display visual route
        displayRouteVisualization(algorithm, result);

        // Display execution statistics
        displayExecutionStats(
            algorithm,
            cities,
            result,
            executionTime
        );

        // Store result for comparison
        comparisonResults[algorithm] = {
            route: [...result.route],
            distance: result.distance
        };

        // Update comparison table
        displayLiveComparison();

    });

});
