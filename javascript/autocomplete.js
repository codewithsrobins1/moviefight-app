//autocomplete - code that can be recycled - use for other projects

const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
    //Selectors
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results')

//    ================================= APPLICATION FUNCTIONS =================================

    //Input Code to Search Data
    const onInput = async event => {
        //Access the changed text in the input and call fetchData to send api request
        const items = await fetchData(event.target.value);

        //If there are no items at, hide the dropdown --- dont want an empty dropdown
        if(!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }

        //Clear the results wrapper whenver new information is fetched
        resultsWrapper.innerHTML = '';
        
        //After fetching the data, add the is-active class to the drop to show it
        dropdown.classList.add('is-active')

        //For Every item, Create an option anchor -- add class of dropdown-item and create image and item title
        for(let item of items) {
            //create anchor elements with item info
            const autoCompleteOption = document.createElement('a');

            //Add dropdown-item class to the item
            autoCompleteOption.classList.add('dropdown-item')

            //generate the item poster and title by calling renderOption from index.js
            autoCompleteOption.innerHTML = renderOption(item);

            //Close Dropdown menu after clicking a link & set input value to title of item clicked on
            autoCompleteOption.addEventListener('click', () => {
                dropdown.classList.remove('is-active')

                //Change value of an exisiting input to title of item clicked on
                input.value = inputValue(item)

                //Function for when user select item
                onOptionSelect(item);
            })

            //Select the div with id of target and add the divs with item poster and title
            resultsWrapper.appendChild(autoCompleteOption)
        }
    };

    //As the Input changes, call the onInput function
    input.addEventListener('input', debounce(onInput, 500));

    document.addEventListener('click', event => {
        //If root element for auto complete dropdown DOES NOT CONTAIN the element clicked on --> close the drop down menu --- ANYTHING CLICKED INSIDE THE DROPDOWN CLASS DOES NOT HIDE THE MENU
        if(!root.contains(event.target)){
            dropdown.classList.remove('is-active'); //remove is-active class to close dropdown
        }
    })
};

