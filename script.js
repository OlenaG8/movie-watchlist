const searchBtn = document.getElementById('search-btn')
const userInput = document.getElementById('search-movie')

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

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MjRhNjc3MWNjNTYyZGViYjZkMzI0NjFlNmI0M2Y2NCIsInN1YiI6IjY2NDIyY2I0MzQwZTlhOWE3ZTM3NmRiYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0aOlrqmyK-AOH8_Ywx-RP0XIjPVMLB0mZG6unYOx2qA'
    }
}

function getTheSearchResult() {
    
    fetch(`https://api.themoviedb.org/3/search/movie?query=${userInput.value}&include_adult=false&language=en-US&page=1`, options)
    .then(res => res.json())
    .then(data => {
        console.log(data.results)
        })
        .catch(err => console.error(err))
}
    
searchBtn.addEventListener('click', getTheSearchResult)

function getMovieHtml(movie) {
    return `
    <div>
    `
}