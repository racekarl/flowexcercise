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

    showStatusMessage('Please wait...');
    toggleSearchButton();
    const searchBox = document.getElementById('searchTerm');
    const searchTerm = searchBox.value;

    try {
        let searchResults = await searchOMDB(searchTerm);
        let sortedResults = await sortResultsByDateThenName(searchResults);
        displaySearchResults(searchTerm, sortedResults);
    } catch (error) {
        console.error(error);
        showStatusMessage('Something went wrong, please try again.');
    } finally {
        toggleSearchButton();
    }

}

async function onBackButtonClick() {

}

async function onMovieClick(imdbID) {
    console.log(`Clicked movie ${imdbID}`);
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

async function sortResultsByDateThenName(searchResults) {
    return searchResults;
}

//#endregion

//#region UI update methods

function showStatusMessage(message) {

    const searchStatus = document.getElementById('searchStatus');
    searchStatus.classList.remove('hidden');
    searchStatus.innerHTML = message;

}

function toggleSearchButton() {

    const searchButton = document.getElementById('searchButton');
    searchButton.disabled = !searchButton.disabled;

}

function displaySearchResults(searchTerm, results) {

    if (results.length === 0) {
        showStatusMessage(`No results found for "${searchTerm}"`);
        return;
    }

    let resultGrid = document.getElementById('resultGrid');
    let resultTemplate = document.getElementById('resultTemplate');

    results.forEach(movie => {

        let resultRow = resultTemplate.content.cloneNode(true);
        if (movie.Poster !== omdbMissingPoster) {
            let thumbnail = resultRow.querySelector('.thumb');
            thumbnail.src = movie.Poster;
        }
        let releaseYear =  resultRow.querySelector('.releaseYear');
        releaseYear.innerHTML = movie.Year;
        let titleLink =  resultRow.querySelector('.title');
        titleLink.text = movie.Title;
        titleLink.addEventListener('click', () => { onMovieClick(movie.imdbID); });
        resultGrid.appendChild(resultRow);
        
    });

    showStatusMessage(`${results.length} results found for "${searchTerm}"`);
    resultGrid.classList.remove('hidden');


}

//#endregion