const inputEl = document.querySelector('.main-input');
const inputWrapper = document.querySelector('.search-input');
const autocompleteBox = document.querySelector('.autocom-box');
const mainItemListEl = document.querySelector('.main-list');

let newArr = []

// const debounce = function (callback) {
//   clearTimeout(timeOutId);
//   timeOutId = setTimeout(() => callback(), 300)
// }

function debounce(func, delay, immediate) {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;

    const later = function () {
      timeout = null;

      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, delay);
    if (callNow) func.apply(context, args)
  }
}

async function loadRepos() {
  const inputValue = inputEl.value;
  if (inputValue) {
    await fetch(`https://api.nomoreparties.co/github-search?q=${inputValue}+in%3Aname%2Cdescription&type=Repositories`)
      .then((response) => response.json())
      .then((data) => {
        newArr = data;
        renderEls(newArr.items)
      })
      .catch(err => {
      })
  } else if (!inputValue) {
    inputWrapper.classList.remove('active');
  }
}

inputEl.addEventListener('input', debounce(loadRepos, 400));

function renderEls(list) {
  inputWrapper.classList.add('active');
  for (let repo of list) {
    autocompleteBox.insertAdjacentHTML("afterbegin", `<li data-id="${repo.id}">${repo.name}</li>`);
  }
}

autocompleteBox.addEventListener('click', (event) => {
  

  if (event.target.tagName !== "LI") {
    return;
  } else {
    // let liEls = mainItemListEl.querySelectorAll('.list-item');
    inputEl.value = '';
    inputWrapper.classList.remove('active');
    // liEls.forEach(el => {
    //   if (el.dataset.id == event.target.dataset.id) {
    //     console.log(event.target.dataset.id);
    //     console.log(el.dataset.id);
    //     return;
    //   }
    // });
    newArr.items.forEach(item => {
      console.log(item.id);
      console.log(event.target.dataset.id);
      if (item.id == event.target.dataset.id) {
        renderItem(item);
      }
    })
  }
});

function renderItem(item) {

  let markUp = `<li class="list-item" data-id="${item.id}"> 
  <p><span>Name: ${item.name}</span></p> 
  <p><span>Owner: ${item.owner.login}</span></p> 
  <p><span>Stars: ${item.stargazers_count}</span></p>
  <img src="close_icon.svg" alt="X" class="close-icon">
  </li>`;

  mainItemListEl.insertAdjacentHTML('beforeend', markUp);
}

mainItemListEl.addEventListener('click', (event) => {
  if (!event.target.classList.contains('close-icon')) {
    return;
  } else {
    event.target.parentNode.remove();
  }
})