// Please do not share or post this api key anywhere,
// Your JavaScript will go here, you can view api information at
// http://www.omdbapi.com/, but the short of it is you'll need to
// send an "s" param with your query, an "apiKey" which is provided above
// and a "type" param. The api also accepts "page" as a parameter, and
// accepts standard numbers as arguments (i.e. page=1)
const omdbUrl = 'http://www.omdbapi.com';
const omdbType = 'movie';
const omdbResultsPerPage = 10;
const omdbMissingPoster = 'N/A';

//#region Event handlers 

async function onSearchButtonClick() {

    hideMovieDetails();
    hideResultGrid();
    showStatusMessage('Please wait...');
    toggleSearchButton();
    const searchBox = document.getElementById('searchTerm');
    const searchTerm = searchBox.value;

    try {
        let searchResults = await searchOMDB(searchTerm);
        let sortedResults = sortResultsByDateThenName(searchResults);
        displaySearchResults(searchTerm, sortedResults);
    } catch (error) {
        console.error(error);
        showStatusMessage('Something went wrong, please try again.');
    } finally {
        toggleSearchButton();
    }

}

async function onBackButtonClick() {

    hideMovieDetails();
    showStatusMessage();
    showResultGrid();

}

async function onMovieClick(imdbID) {

    hideMovieDetails();
    hideResultGrid();
    showStatusMessage('Please wait...');

    try {
        let movie = await getMovieDetailsFromOMDB(imdbID);
        displayMovieDetails(movie);
        hideStatusMessage();
    } catch (error) {
        console.error(error);
        showStatusMessage('Something went wrong, please try again.');
    }   
    
}

//#endregion 

//#region OMDB methods

async function searchOMDB(searchTerm) {

    let currentPage = 1;
    let totalPages = 1;
    let result = [];

    while (currentPage <= totalPages) {

        let url = `${omdbUrl}?apikey=${omdbKey}&type=${omdbType}&s=${encodeURIComponent(searchTerm)}&page=${currentPage}`;

        // console.log(`Getting page ${currentPage} of ${totalPages} from ${url}`);

        let response = await fetch(url);
        let searchResults = await response.json();

        if (!searchResults.Response) {
            break;
        }

        result = result.concat(searchResults.Search);

        totalPages = Math.ceil(searchResults.totalResults / omdbResultsPerPage);
        currentPage++;

    }

    return result;

}

async function getMovieDetailsFromOMDB(imdbID) {

    let url = `${omdbUrl}?apikey=${omdbKey}&i=${encodeURIComponent(imdbID)}`;

    let response = await fetch(url);
    return await response.json();

}

function sortResultsByDateThenName(searchResults) {
    //Sorts first in descending order by release year, then ascending order by title
    return searchResults.sort((a, b) => (b.Year > a.Year) ? 1 : (a.Year === b.Year) ? ((a.Title > b.Title) ? 1 : -1) : -1);
}

//#endregion

//#region Movie display methods 

function displaySearchResults(searchTerm, results) {

    let resultGrid = document.getElementById('resultGrid');
    let resultTemplate = document.getElementById('resultTemplate');

    resultGrid.querySelectorAll('.row').forEach(row => row.remove());

    if (results.length === 0) {
        showStatusMessage(`No results found for "${searchTerm}"`);
        return;
    }

    results.forEach(movie => {

        let resultRow = resultTemplate.content.cloneNode(true);
        if (movie.Poster !== omdbMissingPoster) {
            let thumbnail = resultRow.querySelector('.thumb');
            thumbnail.src = movie.Poster;
        }
        let releaseYear = resultRow.querySelector('.releaseYear');
        releaseYear.innerHTML = movie.Year;
        let titleLink = resultRow.querySelector('.title');
        titleLink.text = movie.Title;
        titleLink.addEventListener('click', () => { onMovieClick(movie.imdbID); });
        resultGrid.appendChild(resultRow);

    });

    showStatusMessage(`${results.length} results found for "${searchTerm}"`);
    showResultGrid();

}

function displayMovieDetails(movie) {

    let detailGrid = document.getElementById('detailGrid');
    let detailTemplate = document.getElementById('detailTemplate');

    detailGrid.querySelectorAll('.detail').forEach(row => row.remove());

    for (const property in movie) {
        // console.log(`${property}: ${movie[property]}`);

        let detailRow = detailTemplate.content.cloneNode(true);
        let propertyLabel = detailRow.querySelector('.detailLabel');
        let propertyData = detailRow.querySelector('.detailData');

        // Handle a few special cases: 
        // - the "Response" property, which is a property of OMDB and not of the movie itself 
        // - The "Poster" property, which should display an image and may be either the image src or "N/A"
        // - the "Ratings" property, which is an array of ratings (source and rating)
        if (property === 'Response') {
            continue;
        } else if (property === 'Poster') {
            propertyLabel.innerHTML = 'Poster';
            if (movie.Poster !== omdbMissingPoster) {
                let posterTemplate = document.getElementById('detailPoster');
                let poster = posterTemplate.content.firstElementChild.cloneNode(true);
                poster.src = movie[property];
                propertyData.appendChild(poster);
            }
        } else if (property === 'Ratings') {
            propertyLabel.innerHTML = property;
            let ratingTemplate = document.getElementById('detailRatings')
            movie.Ratings.forEach(rating => {
                let ratingRow = ratingTemplate.content.cloneNode(true);
                let ratingSource = ratingRow.querySelector('.ratingSource');
                ratingSource.innerHTML = rating.Source;
                let ratingValue = ratingRow.querySelector('.ratingValue');
                ratingValue.innerHTML = rating.Value;
                propertyData.appendChild(ratingRow);
            });        
        } else {
            propertyLabel.innerHTML = property;
            propertyData.innerHTML = movie[property];
        }

        detailGrid.appendChild(detailRow);

      }

      showMovieDetails();

}

//#endregion

//#region UI helper methods

function showStatusMessage(message) {
    const searchStatus = document.getElementById('searchStatus');
    if (message && message.length > 0) {
        searchStatus.innerHTML = message;
    }
    searchStatus.classList.remove('hidden');
}

function hideStatusMessage() {
    const searchStatus = document.getElementById('searchStatus');
    searchStatus.classList.add('hidden');
}

function toggleSearchButton() {
    const searchButton = document.getElementById('searchButton');
    searchButton.disabled = !searchButton.disabled;
}

function showResultGrid() {
    let resultGrid = document.getElementById('resultGrid');
    resultGrid.classList.remove('hidden');
}

function hideResultGrid() {
    let resultGrid = document.getElementById('resultGrid');
    resultGrid.classList.add('hidden');
}

function showMovieDetails() {
    let details = document.getElementById('details');
    details.classList.remove('hidden');
}

function hideMovieDetails() {
    let details = document.getElementById('details');
    details.classList.add('hidden');
}

//#endregion