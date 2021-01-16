// Please do not share or post this api key anywhere,
// Your JavaScript will go here, you can view api information at
// http://www.omdbapi.com/, but the short of it is you'll need to
// send an "s" param with your query, an "apiKey" which is provided above
// and a "type" param. The api also accepts "page" as a parameter, and
// accepts standard numbers as arguments (i.e. page=1)
const omdbUrl = 'http://www.omdbapi.com';
const omdbType = 'movie';
const omdbResultsPerPage = 10;


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

function onBackButtonClick() {

}

//#endregion 

//#region OMDB methods

async function searchOMDB(searchTerm) {

    let currentPage = 1;
    let totalPages = 1;
    let result = [];

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

}

//#endregion