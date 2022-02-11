window.addEventListener('DOMContentLoaded', () => {

    const starWarsCards = document.querySelector(".persons");
    var next = document.querySelector(".next");
    var prew = document.querySelector(".prew");

    function createCard(data) {
        starWarsCards.innerHTML = '';
        
        data.forEach(item => {
            let card = document.createElement("div");
            card.classList.add("card");

            card.innerHTML = `
                            <h1 class="title"><a href="#">${item.name}</a></h1>`;
            starWarsCards.appendChild(card);
            card.addEventListener("click", (e) => createModal(item))
        });
    }

    // Общая асинхроная функция принимающая url
    async function requestUrl(url) {
        localStorage.setItem('url', url);
        const res = await fetch(`${url}`);
        return await res.json();
    }

    async function getPlanet(id){
        const response = await fetch(id)
        const data = await response.json();
        let res = document.querySelector(".planet").innerHTML = data.name;
        return await res;
    }

    function getSpecies(id){
        let res = "";
        requestUrl(id).then(data => {
            res = document.querySelector(".species").innerHTML = data.name;
            return res;
        })
        if (res.innerHTML === "undefined" || res.innerHTML === null) res.innerHTML = " "

        return res
    }

    function getFilms(arr){
        
        let ul = document.createElement("ul");
        arr.forEach(item => {
            requestUrl(item)
            .then(index =>  {
                let res = document.querySelector(".films");
                res.textContent = " ";
                let li = document.createElement('li');
                li.innerHTML = index.title;
                ul.appendChild(li);
                res.appendChild(ul);
            })
        })
        

    }

    function req() {
        requestUrl(`https://swapi.dev/api/people/`)
        .then(data => data.results)
        .then(person => createCard(person))
        .catch(err => console.error(err))

        localStorage.setItem("count", count);
        document.querySelector('form').style.display = "flex";
        this.remove();
    }

    var count = 1;

    function nextPage() {
        count++;
        localStorage["count"] = count;
        if(count > 9) count = 1;
        requestUrl(`https://swapi.dev/api/people/?page=${count}`)
        .then(data => data.results)
        .then(person => createCard(person))
        .catch(err => console.error(err))
    }

    function prewPage() {
        count--;
        if(count < 1) count = 9;
        requestUrl(`https://swapi.dev/api/people/?page=${count}`)
        .then(data => data.results)
        .then(person => createCard(person))
        .catch(err => console.error(err))
    }

    function createModal(data) {
        let modalDiv = document.createElement("div");
        modalDiv.classList.add("modal");
        
        modalDiv.innerHTML = `
                            <div class="modal__content">
                                <span class="close">&times;</span>
                                <table class="iksweb">
                                    <tbody>
                                        <tr>
                                            <td colspan="2" class="modal__title">${data.name}</td>
                                        </tr>
                                        <tr>
                                            <td class="modal__info">Gender:</td>
                                            <td>${data.gender}</td>
                                        </tr>
                                        <tr>
                                            <td class="modal__info">Berth year:</td>
                                            <td>${data.birth_year}</td>
                                        </tr>
                                        <tr>
                                            <td class="modal__info">Planet:</td>
                                            <td class="td planet">${getPlanet(data.homeworld)}</td>
                                        </tr>
                                        <tr>
                                            <td class="modal__info">Films:</td>
                                            <td class="films">${getFilms(data.films)}</td>
                                        </tr>
                                        <tr>
                                            <td class="modal__info">Species:</td>
                                            <td class="td species">${getSpecies(data.species)}</td> 
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            `;
        document.body.appendChild(modalDiv);
        let span = document.querySelector(".close");

        span.addEventListener("click", () => {
            modalDiv.remove();
        });
    }


    next.addEventListener('click', nextPage);
    prew.addEventListener('click', prewPage)
    document.querySelector('.start').addEventListener('click', req, {"once": true});
});
