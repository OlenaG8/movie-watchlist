const apiKey = `c83e1e03`

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
    if (e.target.matches('#search-btn')) {
        handleSearchBtn()
    } 
    else if (e.target.dataset.movieid) {
        const movieId = e.target.dataset.movieid
        toggleAddRemoveBtn(movieId)
        console.log(moviesByIdMap.get(movieId))
        // addToOrRemoveFromWatchlist(moviesByIdMap.get(movieId))
    }
})

themeToggle.addEventListener("click", function() {
    const body = document.querySelector("body")
    const exploreIcon = document.getElementById("explore-icon")

    this.classList.toggle("fa-moon")
    if (this.classList.toggle("fa-sun")) {
        document.documentElement.setAttribute('data-theme', 'light')
        if(exploreIcon) {
            exploreIcon.setAttribute('src', 'assets/explore-icon.png')
        }
        body.style.transition = '2s'
    } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        if(exploreIcon) {
            exploreIcon.setAttribute('src', 'assets/explore-icon-dark.png')
        }
        body.style.transition = '2s'
    }
})

async function handleSearchBtn() {
    startPageCon.style.display = 'flex'
    foundMovies.innerHTML = ''

    try {
        const res = await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${userInput.value}`)
        const data = await res.json()
        if (data.Search) {
            getSearchDetails(data.Search)
        } else {
            startPageCon.innerHTML = `<p>${errMessage}</p>`
        }
    } catch (err) {
        console.log(err)
        startPageCon.innerHTML = `<p>${errMessage}</p>`
    }
}

async function getSearchDetails(movies) {
    try {
        const moviePromises = movies.map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
                .then(res => res.json())
        )

        const moviesListArr = await Promise.all(moviePromises)

        moviesByIdMap = new Map()
        for (let movie of moviesListArr) {
            moviesByIdMap.set(movie.imdbID, movie)
        }
        render(moviesListArr)

    } catch (err) {
        console.log('Error fetching movie details:', err)
        startPageCon.innerHTML = `<p>${errMessage}</p>`
    }
}

function getMovieHtml(movie) {
    const isInWatchlist = myWatchlist.some(watchlistMovie => watchlistMovie.imdbID === movie.imdbID)
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
                <i class="fa-solid ${isInWatchlist ? 'fa-circle-minus' : 'fa-circle-plus'}" id="i-${movie.imdbID}" data-movieid="${movie.imdbID}"></i>
                <h4 id="h4-${movie.imdbID}" data-movieid="${movie.imdbID}">${isInWatchlist ? 'Remove' : 'Watchlist'}</h4>
            </div>
        </div>
        <p>${movie.Plot}</p>
    </div>
    `
}

function render(movieArr) {
    let html = movieArr.map(getMovieHtml).join('')
    startPageCon.style.display = 'none'
    foundMovies.innerHTML = html
}

function addToOrRemoveFromWatchlist(movie) {
    console.log(movie)
    // const movieIndex = myWatchlist.findIndex(watchlistMovie => watchlistMovie.imdbID === movie.imdbID)
    // if (movieIndex === -1) {
    //     myWatchlist.push(movie)
    // } else {
    //     myWatchlist.splice(movieIndex, 1)
    // }
    // updateLocStorage()
}

function toggleAddRemoveBtn(id) {
    const icon = document.getElementById(`i-${id}`)
    const text = document.getElementById(`h4-${id}`)

    icon.classList.toggle("fa-circle-plus")
    icon.classList.toggle("fa-circle-minus")

    if (icon.classList.contains("fa-circle-minus")) {
        text.innerText = `Remove`
    } else {
        text.innerText = `Watchlist`
    }
}

function renderWatchlist() {
    if (myWatchlistCon && myWatchlist.length > 0) {
        startPageCon.style.display = 'none'
        let html = myWatchlist.map(getMovieHtml).join('')
        myWatchlistCon.innerHTML = html
    }
}

function updateLocStorage() {
    localStorage.setItem("watchlist", JSON.stringify(myWatchlist))
}

document.addEventListener("DOMContentLoaded", (e) => {
    const storedWatchlist = localStorage.getItem("watchlist")
    if (storedWatchlist) {
        myWatchlist = JSON.parse(storedWatchlist) || []
    }
    renderWatchlist()
})
