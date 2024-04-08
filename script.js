const toggleDarkMode = document.getElementById("toggle-dark-mode")
const body = document.querySelector("body")

toggleDarkMode.addEventListener("click", function(){
    this.classList.toggle("fa-moon")
    if (this.classList.toggle("fa-sun")) {
        body.style.background = '#efefef'
        body.style.color = '#121212'
        body.style.transition = '2s'
    } else {
        body.style.background = '#121212'
        body.style.color = '#efefef'
        body.style.transition = '2s'
    }
})