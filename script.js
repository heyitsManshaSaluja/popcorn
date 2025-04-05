let APIKEY = "8b017b01";
let searchdata = document.getElementById("searchdata");
let searchbtn = document.getElementById("searchbtn");
let movieContainer = document.getElementById("movie-container");
let homebtn = document.getElementById("homebtn");
let favoritesContainer = document.getElementById("favorites-list");
let showFavoritesBtn = document.getElementById("showFavorites");
let newMoviesBtn = document.getElementById("newMovies"); // New button reference
let popularMoviesBtn = document.getElementById("popularMovies"); // New button reference
let genreSelect = document.getElementById("genreSelect");
// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const clearHomeSection = () => {
    let homeSection = document.querySelector(".home");
    if (homeSection) {
        homeSection.innerHTML = ""; // Clear Home Section
    }
};

//function to clear popular section
// function to clear new section
// function to clear genre section
const getData = async () => {
    clearHomeSection();
    if (!searchdata.value.trim()) {
        alert("Please enter a movie name");
        return;
    }

    try {
        let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&t=${searchdata.value}`);
        let jsondata = await fetchData.json();

        if (jsondata.Response === "False") {
            alert("Movie not found! Please enter a valid name.");
            return;
        }

        let div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <h1 class="card-title">${jsondata.Title}</h1>
            <p class="card-text">Genre: ${jsondata.Genre}</p>
            <p class="card-text">Year: ${jsondata.Year}</p>
            <div class="line">
            <img src="${jsondata.Poster}" class="movie-poster" alt="${jsondata.Title}">
            <p class="movie-description">${jsondata.Plot}</p>  
            </div>
            
            <button class="fav-btn" onclick="addToFavorites('${jsondata.Title}', '${jsondata.Poster}', '${jsondata.Year}', '${jsondata.Plot}')">❤️ Add to Favorites</button>
        `;

        // Clear previous search results
        movieContainer.innerHTML = "";
        movieContainer.appendChild(div);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again.");
    }
};
// Load new movies on page load
const getNewMovies = async () => {
    clearHomeSection();
    movieContainer.innerHTML = "<h2>Loading New Releases...</h2>";
    let currentYear = new Date().getFullYear();

    try {
        let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&s=movie&y=${currentYear}`);
        let jsondata = await fetchData.json();

        if (jsondata.Response === "False" || !jsondata.Search) {
            movieContainer.innerHTML = "<h2>No new movies found.</h2>";
            return;
        }

        let movies = jsondata.Search.slice(0, 12); // Ensure at least 12 movies are displayed
        movieContainer.innerHTML = ""; // Clear previous content

        movies.forEach((movie) => {
            let div = document.createElement("div");
            div.classList.add("popular-movie-card");

            div.innerHTML = `
                <h3 class="popular-movie-title">${movie.Title}</h3>
                <img class="popular-movie-poster" src="${movie.Poster}" alt="${movie.Title}">
                <p class="popular-movie-description">Year: ${movie.Year}</p>
            `;

            movieContainer.appendChild(div);
        });
    } catch (error) {
        movieContainer.innerHTML = "<h2>Error loading new movies.</h2>";
        console.error("Error fetching new movies:", error);
    }
};


// Add to Favorites
const addToFavorites = (title, poster, year, plot) => {
    let movie = { title, poster, year, plot };
    
    if (!favorites.some(fav => fav.title === title)) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        displayFavorites();
    } else {
        alert(`${title} is already in favorites!`);
    }
};

// Remove from Favorites
const removeFromFavorites = (title) => {
    favorites = favorites.filter(movie => movie.title !== title);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
};

// Display Favorites List
const displayFavorites = () => {
    clearHomeSection();
    favoritesContainer.innerHTML = "";
movieContainer.innerHTML = ""; // Clear the movie container when displaying favorites
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorites added yet.</p>";
        return;
    }

    favorites.forEach(movie => {
        let div = document.createElement("div");
        div.classList.add("favorite-card");

        div.innerHTML = `
            <h1 class="card-title">${movie.title}</h1>
            <p class="card-text">Year: ${movie.year}</p>
            <div class="line">
                <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">
                <p class="movie-description">${movie.plot}</p>  
            </div>
            <button class="remove-fav-btn" onclick="removeFromFavorites('${movie.title}')">Remove</button>
        `;

        favoritesContainer.appendChild(div);
    });
};



// Toggle Favorites list visibility
document.getElementById("showFavorites").addEventListener("click", () => {
    let favoritesSection = document.getElementById("favorites-container");

    if (favoritesSection.style.display === "none" || favoritesSection.style.display === "") {
        favoritesSection.style.display = "block";
    } else {
        favoritesSection.style.display = "none";
    }

    displayFavorites(); // Update the favorites list when opened
});
// Fetch and display popular movies
const getPopularMovies = async () => {
    clearHomeSection();
    movieContainer.innerHTML = "<h2>Loading Popular Movies...</h2>";

    try {
        let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&s=avengers`);
        let jsondata = await fetchData.json();

        if (jsondata.Response === "False" || !jsondata.Search) {
            movieContainer.innerHTML = "<h2>No popular movies found.</h2>";
            return;
        }

        let movies = jsondata.Search.slice(0, 12); 
        movieContainer.innerHTML = ""; 

        movies.forEach((movie) => {
            let div = document.createElement("div");
            div.classList.add("popular-movie-card");

            div.innerHTML = `
                <h3 class="popular-movie-title">${movie.Title}</h3>
                <img class="popular-movie-poster" src="${movie.Poster}" alt="${movie.Title}">
                <p class="popular-movie-description">Year: ${movie.Year}</p>
            `;

            movieContainer.appendChild(div);
        });
    } catch (error) {
        movieContainer.innerHTML = "<h2>Error loading popular movies.</h2>";
        console.error("Error fetching popular movies:", error);
    }
};
// Fetch and display movies by genre
const getMoviesByGenre = async () => {
    clearHomeSection();
    let genre = genreSelect.value;
    if (!genre) {
        alert("Please select a genre");
        return;
    }

    movieContainer.innerHTML = `<h2>Loading ${genre} Movies...</h2>`;

    try {
        let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&s=${genre}`);
        let jsondata = await fetchData.json();

        if (jsondata.Response === "False" || !jsondata.Search) {
            movieContainer.innerHTML = `<h2>No movies found for ${genre}.</h2>`;
            return;
        }

        let movies = jsondata.Search.slice(0, 12);
        movieContainer.innerHTML = "";

        movies.forEach((movie) => {
            let div = document.createElement("div");
            div.classList.add("popular-movie-card");

            div.innerHTML = `
                <h3 class="popular-movie-title">${movie.Title}</h3>
                <img class="popular-movie-poster" src="${movie.Poster}" alt="${movie.Title}">
                <p class="popular-movie-description">Year: ${movie.Year}</p>
            `;

            movieContainer.appendChild(div);
        });
    } catch (error) {
        movieContainer.innerHTML = `<h2>Error loading ${genre} movies.</h2>`;
        console.error("Error fetching genre movies:", error);
    }
};
// Add event listener for genre selection
genreSelect.addEventListener("change", getMoviesByGenre);


// Event Listeners
searchbtn.addEventListener("click", getData);
newMoviesBtn.addEventListener("click", getNewMovies); // Functionality for "New"
popularMoviesBtn.addEventListener("click", getPopularMovies); // Popular movies button

// Load favorites on page load
displayFavorites();
// Clear favorites when other options are used
const clearFavorites = () => {
    favoritesContainer.innerHTML = "";
    let favoritesSection = document.getElementById("favorites-container");
    favoritesSection.style.display = "none";
};

// Modify event listeners to clear favorites when other options are used
searchbtn.addEventListener("click", () => {
    clearFavorites();
    getData();
});

newMoviesBtn.addEventListener("click", () => {
    clearFavorites();
    getNewMovies();
});
let watchNowBtn = document.getElementById("watchnowBtn");

const getTrendingMovies = async () => {
    // Clear everything else
    clearHomeSection();
    clearFavorites();
    movieContainer.innerHTML = ""; // Clear popular/new/genre section if any

    movieContainer.innerHTML = `<h2>Loading Trending Movies...</h2>`;

    try {
        let fetchData = await fetch(`https://www.omdbapi.com/?apikey=${APIKEY}&s=batman`);
        let jsondata = await fetchData.json();

        if (jsondata.Response === "False" || !jsondata.Search) {
            movieContainer.innerHTML = `<h2>No trending movies found.</h2>`;
            return;
        }

        let movies = jsondata.Search.slice(0, 12);
        movieContainer.innerHTML = "";

        movies.forEach((movie) => {
            let div = document.createElement("div");
            div.classList.add("popular-movie-card");

            div.innerHTML = `
                <h3 class="popular-movie-title">${movie.Title}</h3>
                <img class="popular-movie-poster" src="${movie.Poster}" alt="${movie.Title}">
                <p class="popular-movie-description">Year: ${movie.Year}</p>
            `;

            movieContainer.appendChild(div);
        });
    } catch (error) {
        movieContainer.innerHTML = `<h2>Error loading trending movies.</h2>`;
        console.error("Error fetching trending movies:", error);
    }
};

// Event Listener for "Watch Now" Button
//watchNowBtn.addEventListener("click", getTrendingMovies);


// Function to show the home section
// Function to show the Home Section again
const showHomeSection = () => {
    // Clear everything else
    clearHomeSection();
    clearFavorites();
    movieContainer.innerHTML = ""; // Clear movie display section (Popular, New, Genre)

    // If home container already exists, reuse it
    let homeSection = document.querySelector(".home");

    // If not, create it and append to DOM
    if (!homeSection) {
        homeSection = document.createElement("div");
        homeSection.classList.add("home");
        document.querySelector(".container").appendChild(homeSection);
    }

    // Insert content
    homeSection.innerHTML = `
        <div class="homeBtn">
            <h1>Free Movies to Watch, Anytime Anywhere.</h1>
            <h2>The search is over! Let Popcorn help you find the perfect movie to watch tonight for free.</h2>
            <button id="watchnowBtn">Watch Now</button>
            
        </div>
    `;

    // Add event to "Watch Now" button
    document.getElementById("watchnowBtn").addEventListener("click", getTrendingMovies);
};


// Add click listener for Home button
homebtn.addEventListener("click", () => {
    clearFavorites(); // Optional: hide favorites
    showHomeSection();
});

// Show Home section on initial page load
showHomeSection();

