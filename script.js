const apiKey =  `c83e1e03`

const searchBtn = document.getElementById('search-btn')
const userInput = document.getElementById('search-movie')

const startPageCon = document.getElementById('start-page')
const foundMovies = document.getElementById('found-movies')
const myWatchlistCon = document.getElementById('my-watchlist-con')

let moviesByIdMap = new Map()

let moviesListArr = []
let myWatchlist = []

const themeToggle = document.getElementById('theme-toggle')
const errMessage = `Unable to find what you're looking for. Please try again`

 document.addEventListener("click", (e) => {
    if (e.target.id === 'search-btn') {
        handleSearchBtn()
    }

     if (e.target.dataset.movieid) {
         console.log(e.target.dataset.movieid)
         addToMyWatchlist(moviesByIdMap.get(e.target.dataset.movieid))
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

async function handleSearchBtn() {
    startPageCon.style.display = 'flex'
    foundMovies.innerHTML = ''

    await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${userInput.value}`)
        .then(res => res.json())
        .then(data => getSearchDetails(data.Search))
        .catch(err => {
            console.log(err)
            startPageCon.innerHTML = `<p>${errMessage}</p>`
        })
}

async function getSearchDetails(movies) {

    try {
        const moviePromises = movies.map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                .then(res => res.json())
        )

        const moviesListArr = await Promise.all(moviePromises)

        moviesByIdMap = new Map()        
        for(let movie of moviesListArr) {
            moviesByIdMap.set(movie.imdbID, movie)
        } 

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
            <div class="watchlist-btn" id="btn-toggle-${movie.imdbID}">
                <i class="fa-solid fa-circle-plus" data-movieid=${movie.imdbID}></i>
                <h4 data-movieid=${movie.imdbID}">Watchlist</h4>
            </div>
        </div>
        <p>${movie.Plot}</p>
     </div>
    `
}

function getAddOrRemoveHtml(movieId) {

    if (isInWatchlist(movieId)) {
        return `
        <div class="watchlist-btn" id="btn-toggle-${movie.imdbID}">
            <i class="fa-solid fa-circle-minus" data-movieid=${movie.imdbID}></i>
            <h4 data-movieid=${movie.imdbID}">Remove</h4>
        </div>
        `
    } else {
        return `
        <div class="watchlist-btn" id="btn-toggle-${movie.imdbID}">
            <i class="fa-solid fa-circle-plus" data-movieid=${movie.imdbID}></i>
            <h4 data-movieid=${movie.imdbID}">Watchlist</h4>
        </div>`
    }

}

function isInWatchlist(movieId) {
    for (let movie of myWatchlist) {
        if (movie.imdbID === movieId ) {
            return true
        }
    }
    return false
}

function render(movieArr) {
    let html = ""
    html += movieArr.map(getMovieHtml).join('')
    startPageCon.style.display = 'none'
    foundMovies.innerHTML = html
}


function addToMyWatchlist(movie) {
    
    if (myWatchlist.includes(movie)) {
        alert("Already in your watchlist")
    } else {
        myWatchlist.push(movie)
        updateLocStorage() 
        renderWatchlist()
    }
}

function renderWatchlist() {
    if (myWatchlistCon) {
        startPageCon.style.display = 'none'
        let html = ""
        html += myWatchlist.map(getMovieHtml).join('')
        myWatchlistCon.innerHTML = html
    }
}

function updateLocStorage() {
    localStorage.setItem("watchlist", JSON.stringify(myWatchlist))
}

document.addEventListener("DOMContentLoaded", () => {
    const storedWatchlist = localStorage.getItem("watchlist")
    if (storedWatchlist) {
        myWatchlist = JSON.parse(storedWatchlist)
        renderWatchlist()
    }
})
