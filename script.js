const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal-list');
const mealDetailsContent = document.querySelector('.meal-details-content');
const mealCloseBtn = document.getElementById('details-close-btn');

// event listner
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click' , getMealReciepe);
mealList.addEventListener('click' , addFavourite);
favBtn.addEventListener('click' , getFavMealList);

mealCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// var favMealList = '{"meals": [ { "strMeal": "None", "strMealThumb": "None", "idMeal": "None" } ] }'
var favMealList = '{"meals": [] }'

// get meal list that matches with the ingerdents
if(mealList == null) {
    console.log("mealList is null");
} else {
    console.log("mealList is not null");
}

if(searchBtn == null){
    console.log("search is null");
} else {
    console.log("search is not null");
}

function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log("PKS " + searchInputTxt);
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">     
                        </div>
                        <img src = "./heart-solid.svg" class = "fav-icon-img">
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "detail-btn">Get Recipe Details</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }
        mealList.innerHTML = html;
    });
}


// get meal reciepe of the meal

function getMealReciepe(e){
    e.preventDefault();
    console.log("PKS 101 " + e)
    if(e.target.classList.contains('detail-btn')){
       
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response =>response.json())
        .then(data => mealRecipeModal(data.meals));
            
        }
}

// create a modal

function mealRecipeModal(meal){
    console.log(meal);
    meal = meal[0];
    let html = `
    <h2 class="meal-title">${meal.strMeal}</h2>
    <div class="detail-meal-img">
        <img src ='${meal.strMealThumb}' alt="food">
    </div>
    <div class="Instruction">
        <h3>Instruction:</h3>
       <p>${meal.strInstructions}</p>  
    </div>
    <div class="meal-link">
        <a href="${meal.strYoutube}" target ="_blank">Watch Video</a>
    </div>
    `;

    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// favourite button call

function addFavourite (e) {
    e.preventDefault();

    if(e.target.classList.contains('fav-icon-img')) {
        let mealItem = e.target.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response =>response.json())
        .then(data => AddToFavoriteList(data.meals));

    }
}

function AddToFavoriteList(meal) {
    meal=meal[0];
    var obj = JSON.parse(favMealList);
    let strMeal = `${meal.strMeal}`;
    console.log("PKS strMeal " + strMeal);
    obj['meals'].push({"strMeal": strMeal, "strMealThumb":`${meal.strMealThumb}`, "idMeal": `${meal.idMeal}`});
    favMealList = JSON.stringify(obj);

}
function getFavMealList(){
     let html = "";
     var favMeal = JSON.parse(favMealList);
        if(favMeal.meals){
            favMeal.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">     
                        </div>
                        <img src = "./heart-solid.svg" class = "fav-icon-img">
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "detail-btn">Get Recipe Details</a>
                        </div>
                    </div>
                `;
            });
        }
        mealDetailsContent.innerHTML = html;
        mealDetailsContent.parentElement.classList.add('showRecipe');
    
    }



        
