const body = document.querySelector("body")
const themeToggle = document.getElementById('theme-toggle');


themeToggle.addEventListener("click", function(){
    this.classList.toggle("fa-moon")
    if (this.classList.toggle("fa-sun")) {
        document.documentElement.setAttribute('data-theme', 'light');
        body.style.transition = '2s'
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        body.style.transition = '2s'
    }
})