// Declare global variables
let setViewType = 'grid'; // Default view type
let totalPages;
let booksdata; // Stores fetched book data

// Array to store book data and corresponding DOM elements for search
let bookDataArr = [];

// Get DOM elements
const pages = document.getElementById("pages");
const bookslistings = document.getElementById("bookslistings");
const switchViewBtn = document.getElementById("switch");
const prevbtn = document.getElementById("prevbtn");
const nextbtn = document.getElementById("nextbtn");
const search = document.getElementById("input");
const sortdate = document.querySelector(".sortdate");
const sortab = document.querySelector(".sortab");

// Function to toggle view between grid and list
function changeView() {
    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.classList.contains('grid')) {
            card.classList.remove('grid');
            card.classList.add('list');
            setViewType = 'list';
        } else {
            card.classList.remove('list');
            card.classList.add('grid');
            setViewType = 'grid';
        }
    });
}

// Function to display books on the page
function displayBooks(booksdata) {
    bookDataArr = []; // Reset search data
    bookslistings.innerHTML = ''; // Clear existing content
    const unavailable = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
    
    booksdata.forEach(book => {
        const card = document.createElement('div');
        card.classList.add('card', setViewType);
        
        card.innerHTML = `
            <a href="${book.volumeInfo.infoLink}" target="_blank">
                <div class="card-image">
                    <img src="${book.volumeInfo.imageLinks?.thumbnail || unavailable}" alt="Book Cover">
                </div>
                <div class="text">
                    <div class="category"> ${book.volumeInfo.categories || 'Unknown'} </div>
                    <div class="title"> ${book.volumeInfo.title}
                        <div class="author"> By <span class="name"> ${book.volumeInfo.authors || 'Unknown'} </span></div>
                        <div class="publisherdata">
                            <div> Publisher: <span class="name"> ${book.volumeInfo.publisher || 'Unknown'} </span></div>
                            <div> Published on: <span class="name"> ${book.volumeInfo.publishedDate || 'Unknown'} </span></div>
                        </div>
                    </div>
                </div>
            </a>`;
        
        bookslistings.appendChild(card);
        
        // Store book title and author for search functionality
        bookDataArr.push({
            bookTitle: book.volumeInfo.title.toLowerCase(),
            bookAuthors: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ').toLowerCase() : '',
            element: card
        });
    });
}

// Function to display pagination buttons
function displayPageCount(pageCount,pagenum) {
    pages.innerHTML = '';
    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        if(pagenum==i){
            li.innerHTML = 
            `<li>
                <button href="#" aria-current="page" id=""
                    class="navbutton flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-100 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 .:bg-gray-800 .:border-gray-700 .:text-gray-400 .:hover:bg-gray-700 .:hover:text-white">
                        ${i}
                </button>
            </li>`;
        }else{
            li.innerHTML = 
            `<li>
                <button href="#" aria-current="page" id=""
                    class="navbutton flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 .:bg-gray-800 .:border-gray-700 .:text-gray-400 .:hover:bg-gray-700 .:hover:text-white">
                        ${i}
                </button>
            </li>`;
        }
        pages.appendChild(li);
    }
    
    let navbuttons = document.querySelectorAll('.navbutton');
    changePage(navbuttons);
}

// Function to change page when a pagination button is clicked
function changePage(navbuttons) {
    navbuttons.forEach(navbutton => {
        navbutton.addEventListener('click', () => {
            pagenum = navbutton.innerText;
            fetchBooksData(pagenum);
        });
    });
}

// Function to organize fetched data
function organizeData(obj) {
    booksdata = obj.data.data;
    displayBooks(booksdata);
    totalPages = obj.data.totalPages;
    displayPageCount(totalPages,pagenum);
}

// Fetch books data from API
async function fetchBooksData(pagenum) {
    fetch(`https://api.freeapi.app/api/v1/public/books?page=${pagenum}&limit=20`)
        .then(res => res.json())
        .then(organizeData)
        .catch(e => console.log(e));
}

// Sorting event listeners
sortdate.addEventListener('click', () => setOrderByDate());
sortab.addEventListener('click', () => setOrderByAlphabet());

// Function to sort books by published date (descending)
function setOrderByDate() {
    booksdata.sort((a, b) => {
        let dateA = new Date(a.volumeInfo.publishedDate || "0000-00-00");
        let dateB = new Date(b.volumeInfo.publishedDate || "0000-00-00");
        return dateB - dateA;
    });
    displayBooks(booksdata);
}

// Function to sort books alphabetically by title
function setOrderByAlphabet() {
    booksdata.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
    displayBooks(booksdata);
}

// Search functionality
search.addEventListener('input', e => {
    const value = e.target.value.toLowerCase().trim();
    bookDataArr.forEach(book => {
        const titleMatch = book.bookTitle.includes(value);
        const authorMatch = book.bookAuthors.includes(value);
        book.element.style.display = titleMatch || authorMatch ? "block" : "none";
    });
});

// Pagination button handlers
prevbtn.addEventListener('click', () => {
    if (pagenum > 1) {
        pagenum--;
        fetchBooksData(pagenum);
        // displayPageCount(totalPages,pagenum);
    }
});

nextbtn.addEventListener('click', () => {
    if (pagenum < totalPages) {
        pagenum++;
        fetchBooksData(pagenum);
        // displayPageCount(totalPages,pagenum);
    }
});

// View switcher button handler
switchViewBtn.addEventListener('click', () => changeView());

// Fetch books when the page loads
window.addEventListener('load', () => {
    pagenum = 1;
    fetchBooksData(pagenum);
});
