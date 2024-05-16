const searchBtn = document.getElementById('search-btn')
const userInput = document.getElementById('search-movie')

const foundMovies = document.getElementById('found-movies')

let moviesListArr = []

const themeToggle = document.getElementById('theme-toggle');

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


// searchBtn.addEventListener('click', getSearchResults)

// function getSearchResults() {
    
//     fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput.value}&include_adult=false&language=en-US&page=1`, options)
//     .then(res => res.json())
//     .then(data => {

//         const movieID = data.results[0].id

//         console.log(movieID)
//         })
//         .catch(err => console.error(err))
// }

const apiKey =  `c83e1e03`

searchBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    await fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}&s=${userInput.value}`)
        .then(res => res.json())
        .then(data => getSearchDetails(data.Search))
})

async function getSearchDetails(movies) {
    moviesListArr = []
    for(let movie of movies) {
        await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                moviesListArr.push(data)
            })
    }
    render()
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
                <i class="fa-solid fa-circle-plus"></i>
                <h4>Watchlist</h4>
            </div>
        </div>
        <p>${movie.Plot}</p>
     </div>
    `
}

function render() {
    let html = ""
    html += moviesListArr.map(getMovieHtml).join('')
    document.getElementById('start-page').style.display = 'none'
    foundMovies.innerHTML = html
}