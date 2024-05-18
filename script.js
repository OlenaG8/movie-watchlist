const apiKey =  `c83e1e03`

const searchBtn = document.getElementById('search-btn')
const userInput = document.getElementById('search-movie')

const startPageCon = document.getElementById('start-page')

const foundMovies = document.getElementById('found-movies')

const myWatchlistCon = document.getElementById('my-watchlist-con')

let moviesListArr = []
let myWatchlist = []

const themeToggle = document.getElementById('theme-toggle')
const errMessage = `Unable to find what you're looking for. Please try again`

document.addEventListener("click", (e) => {
    if (e.target.dataset.movieid) {
        console.log(e.target.dataset.movieid)
        // addToMyWatchlist(e.target.dataset.movieid)
     }
}) 

themeToggle.addEventListener("click", function(){
    const body = document.querySelector("body")
    const exploreIcon = document.getElementById("explore-icon")

    this.classList.toggle("fa-moon")
    if (this.classList.toggle("fa-sun")) {
        document.documentElement.setAttribute('data-theme', 'light');
        exploreIcon.setAttribute('src', 'assets/explore-icon.png')
        body.style.transition = '2s'
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        exploreIcon.setAttribute('src', 'assets/explore-icon-dark.png')
        body.style.transition = '2s'
    }
})

searchBtn.addEventListener('click', async (e) => {
    startPageCon.style.display = 'flex'
    foundMovies.innerHTML = ''
    e.preventDefault()

    await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${userInput.value}`)
        .then(res => res.json())
        .then(data => getSearchDetails(data.Search))
        .catch(err => {
            console.log(err)
            startPageCon.innerHTML = `<p>${errMessage}</p>`
        })
})

async function getSearchDetails(movies) {
    moviesListArr = []

    try {
        const moviePromises = movies.map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                .then(res => res.json())
        )

        const moviesListArr = await Promise.all(moviePromises)
        render(moviesListArr)

    } catch (err) {
        console.log('Error fetching movie details:', err)
        startPageCon.innerHTML = `<p>${errMessage}</p>`
    }
}
 
function getMovieHtml(movie) {
    return `
    <div class="movie-cont">
        <img src="${movie.Poster}" class="movie-poster" alt="${movie.Title}">
        <div class="mov-headline">
            <h2>${movie.Title}</h2>
            <h3>⭐${movie.imdbRating}</h3>
        </div>
        <div class="mov-details">
            <h4>${movie.Genre}</h4>
            <h4>${movie.Runtime}</h4>
            <div class="watchlist-btn">
                <i class="fa-solid fa-circle-plus" data-movieid=${movie.imdbID}></i>
                <h4 data-movieid=${movie.imdbID}>Watchlist</h4>
            </div>
        </div>
        <p>${movie.Plot}</p>
     </div>
    `
}

function getMyWatchlistHtml() {
    return `
    <div class="movie-cont">
        <img src="${movie.Poster}" class="movie-poster" alt="${movie.Title}">
        <div class="mov-headline">
            <h2>${movie.Title}</h2>
            <h3>⭐${movie.imdbRating}</h3>
        </div>
        <div class="mov-details">
            <h4>${movie.Genre}</h4>
            <h4>${movie.Runtime}</h4>
            <div class="watchlist-btn">
                <i class="fa-solid fa-circle-minus"></i>
                <h4>Remove</h4>
            </div>
        </div>
        <p>${movie.Plot}</p>
     </div>
    `
}

function render(movieArr) {
    let html = ""
    html += movieArr.map(getMovieHtml).join('')
    startPageCon.style.display = 'none'
    foundMovies.innerHTML = html
}

function renderWatchlist() {
    let html = "";
    html += myWatchlistArr.map(getMyWatchlistHtml).join('');
    myWatchlistCon.innerHTML = html;
}

function addToWatchlist(id) {
    
    myWatchlist.push(movie)
    updateLocalStorage()
    renderWatchlist()
}
