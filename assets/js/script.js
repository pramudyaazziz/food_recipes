const APP_ID = "5614cc65";
const APP_KEY = "31cc63448f85042ac32af69c0f334038";
const input = document.querySelector(".input-keyword");
const search = document.querySelector(".search-button");

triggerInput();

search.addEventListener("click", async function () {
  try {
    const URL = `https://api.edamam.com/api/recipes/v2?type=public&q=${input.value}&app_id=${APP_ID}&app_key=${APP_KEY}`;
    const foods = await getFoods(URL);
    showContent(foods);
    triggerPopover();
  } catch (err) {
    showError(err);
  }
});

document.addEventListener("click", async function (e) {
  if (e.target.dataset.self) {
    try {
      const detail = await getFoods(e.target.dataset.self);
      showDetailContent(detail);
    } catch (err) {
      console.log(err);
    }
  }
});

function showError(err) {
  let item = `<h3>${err}</h3>`;
  const content = document.querySelector(".foods-content");
  content.innerHTML = item;
}

function showContent(foods) {
  let item = "";
  foods.forEach((foods) => (item += showFoods(foods)));
  const content = document.querySelector(".foods-content");
  content.innerHTML = item;
}

function showDetailContent(detail) {
  const item = showDetail(detail);
  const content = document.querySelector(".modal-body");
  content.innerHTML = item;
}

function getFoods(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((response) => {
      const check = response.hasOwnProperty("count"); //Check the json has a key 'count'
      if (check) {
        if (response.count === 0) {
          throw new Error(`Data tidak tersedia`);
        }
        return response.hits;
      }
      return response.recipe;
    });
}

//Popover trigger bootstrap
function triggerPopover() {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
  );
}

// trigger button search with 'Enter' in input form
function triggerInput() {
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      search.click();
    }
  });
}

function showFoods(foods) {
  const f = foods.recipe;
  const count = f.ingredientLines.length; //Count ingredient in array
  const cuisine = capitalizeWords(f.cuisineType); // Make first letter Capital
  const meal = capitalizeWords(f.mealType); // Make first letter Capital
  const self = foods._links.self.href; //get self link for data-attribute
  return `<div class="col-sm-6">
            <div class="card mb-3 shadow-sm">
              <div class="row g-0">
                <div class="col-md-4 image p-3">
                  <img
                    src="${f.image}"
                    class="img-fluid rounded-start" alt="img">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <h3 class="card-title title">${f.label}</h3>
                        <small class="text-muted">${f.source}</small>
                      </div>
                      <div class="col-3 d-flex">
                        <i data-bs-toggle="popover" data-bs-trigger="hover" data-bs-html="true" data-bs-title="(${count}) Ingredients" class="ingredients fa-solid fa-circle-info my-auto mx-auto fs-5"></i>
                      </div>
                    </div>
                    <hr>
                    <div class="row mt-3">
                      <div class="col-6">
                        <small><strong>Type of cuisine : </strong></small><br>
                        <small><strong>Type of food : </strong></small><br>
                      </div>
                      <div class="col text-end">
                        <small>${cuisine}</small><br>
                        <small>${meal}</small><br>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="d-grid col-6 mx-auto">
                        <a href="#" class="btn btn-primary" data-self="${self}" type="button" data-bs-toggle="modal" data-bs-target="#informationDetail">More Information</a>
                      </div>
                      <div class="d-grid col-6 mx-auto">
                        <a href="${f.url}" target="_blank" class="btn btn-primary" type="button">Get Recipe</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
}

function showDetail(f) {
  const totalIngredient = f.ingredientLines.length;
  const listIngredient = makeUL(f.ingredientLines).innerHTML;
  return `<div class="row justify-content-center mt-4 p-3">
            <div class="col-3">
              <div class="image">
                <img
                  src="${f.image}"
                  alt="image">
              </div>
              <h4 class="fw-bold text-center mt-4">${f.label}</h4>
              <div class="text-center">
                <a href="${f.url}" target="_blank" class="text-muted">${
    f.source
  }</a>
              </div>
            </div>
          </div>
          <hr>
          <div class="row p-3">
            <div class="col-sm-6">
              <div class="row">
                <div class="col">
                  <h6><strong>(${totalIngredient}) Ingredients</strong></h6>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col">${listIngredient}</div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="row">
                <div class="col">
                  <h6><strong>Healt Labels</strong></h6>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <p>${f.healthLabels.join(", ")}</p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h6><strong>Diet Label</strong></h6>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <p>${f.dietLabels}</p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <h6><strong>Type of</strong></h6>
                  <hr>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <small>Cuisine :</small><br>
                  <small>Food :</small><br>
                  <small>Dish :</small><br>
                </div>
                <div class="col text-end">
                  <small>${capitalizeWords(f.cuisineType)}</small><br>
                  <small>${capitalizeWords(f.mealType)}</small><br>
                  <small>${capitalizeWords(f.dishType)}</small><br>
                </div>
              </div>
            </div>
          </div>`;
}

//Function for make ul
function makeUL(array) {
  let list = document.createElement("ul");

  for (let i = 0; i < array.length; i++) {
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(array[i]));
    list.appendChild(item);
  }
  return list;
}

//Function for make first letter capital (uppercase)
function capitalizeWords(arr) {
  return arr.map((element) => {
    return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  });
}
