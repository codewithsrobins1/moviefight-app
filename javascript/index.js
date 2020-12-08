//Index JS - non-reusable code for project at hand

//MAIN Configuration Object
const autoCompleteConfig = {
    //method to generate poster image and movie title for the dropdown autocomplete
    renderOption(movie) {
        //if there is no image for movie poster, have the image source be an empty string
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `
    },
    //Change value of an exisiting input to title of movie clicked on
    inputValue(movie){
        return movie.Title;
    },
    //Function to Fetch Movie Data
    async fetchData(searchTerm){
        //await the response from api call  
        const response = await axios.get('http://www.omdbapi.com/', {
            //List out all parameters in object - Turn into string and append to api url
            params: {
                apikey: 'a3d723dc',
                s: searchTerm
            }
        });         
        
        //See if the response has an error message of movie not found --
        if(response.data.Error){
            return [];
        }
        else{
            //Return Data on Movie List
            return response.data.Search;
        }
    }       
}

//Configuration Objects for LEFT column
createAutoComplete({
    ...autoCompleteConfig,  //<-- make copy of everything inside the autoCompleteConfig object
    root: document.querySelector('#left-autocomplete'),   
    //Function for when user select movie
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden'); //hide the div when user selects a movie
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

//Configuration Objects for RIGHT column
createAutoComplete({
    ...autoCompleteConfig,  //<-- make copy of everything inside the autoCompleteConfig object
    root: document.querySelector('#right-autocomplete'),   
    //Function for when user select movie
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden'); //hide the div when user selects a movie
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});


let leftMovie;
let rightMovie;
//Function for Selecting a Movie from the Drop Down
const onMovieSelect = async (movie, summaryElement, side)  => {
    const response = await axios.get('http://www.omdbapi.com/', {
        //List out all parameters in object - Turn into string and append to api url
        params: {
            apikey: 'a3d723dc',
            i: movie.imdbID     //need to use movie ID 
        }
    });

    //#summary container will  update its content from movieTemplate
    summaryElement.innerHTML = movieTemplate(response.data);

    //Comparison of Movie Data
    if(side === 'left'){
        leftMovie = response.data;
    } else{
        rightMovie = response.data
    }

    //If both are showing, compare their info
    if(leftMovie && rightMovie) {
        runComparison();
    }
};

//Run Comparison of Right and Left Movies
const runComparison = () => {
    const leftSideStats = document.querySelectorAll("#left-summary .notification")
    const rightSideStats = document.querySelectorAll("#right-summary .notification")

    //Want to make sure comparing corresponding stats
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        //Change Color of Stats
        if(rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning')
        }
        else{
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })

}

//Generate Content After Selecting A Movie -- Need to Turn Strings into numbers for comparison
const movieTemplate = (movieDetail) => {
    const dollars = parseInt(
        movieDetail.BoxOffice.replace(/$/g, '').replace(/,/g, '') //Remove dollar signs and replace with empty string
    ); 
    
    const metascore = parseInt( //parseInt prevents decimal
        movieDetail.Metascore
    );

    const imdbRating = parseFloat( //parseFloat can take a string and turn into full number with decimal
        movieDetail.imdbRating
    );

    const imdbVotes = parseInt(
        movieDetail.imdbVotes.replace(/,/g, '')
    );

    //Whoever has most awards wins -- Combine wins and nominations
    const awards = movieDetail.Awards
        .split(' ')
        .reduce((prevValue, word) => {

            //parseInt on a string without a number --- returns NaN
            const value = parseInt(word);

            //Check to see if value is a number or not - 
            if(isNaN(value)) {
                return prevValue; 
            } else{
                return prevValue + value;
            }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src='${movieDetail.Poster}' />
                </p>
            </figure>

            <div class='media-content'>
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>

        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>

        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>

        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>

        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};