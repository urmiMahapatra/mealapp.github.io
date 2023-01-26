const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal-list');
const favMeals = document.getElementById('fav-meal-list');
const mealDetailsContent = document.querySelector('.meal-details-content');
const mealCloseBtn = document.getElementById('details-close-btn');
const homeBtn = document.getElementById('home-btn');
const favBtn = document.getElementById('fav-btn');
const mealWrapper = document.getElementById('meal-wrapper-parent');
const favWrapper = document.getElementById('fav-wrapper-parent');

// var favMealList = '{"meals": [ { "strMeal": "None", "strMealThumb": "None", "idMeal": "None" } ] }'
var favMealList = '{"meals": [] }'
const favMealMap = new Map();

// event listner
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click' , getMealReciepe);
homeBtn.addEventListener('click' , showHomePage);
favBtn.addEventListener('click' , showFavoritesPage);

mealCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

function showHomePage() {
    mealWrapper.style.display = "block";
    favWrapper.style.display = "none";
}

function showFavoritesPage() {
    getFavMealList();
    mealWrapper.style.display = "none";
    favWrapper.style.display = "block";
}


function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    console.log("PKS " + searchInputTxt);
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
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
                        <img src = "./heart-solid.svg" class = "fav-icon-img id="fav-img">
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
        console.log(html);

    });
}


// get meal reciepe of the meal

function getMealReciepe(e){
    e.preventDefault();
    if(e.target.classList.contains('detail-btn')){
        let mealItem = e.target.parentElement.parentElement;
        console.log(mealItem.dataset.id);
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


function AddToFavoriteList(meal) {
    meal=meal[0];
    var obj = JSON.parse(favMealList);
    let strMeal = `${meal.strMeal}`;
    let strMealId = `${meal.idMeal}`;

    var newObj = JSON.parse('{"strMeal": "' + strMeal + '", "strMealThumb": "' + `${meal.strMealThumb}` + '", "idMeal": "' +`${meal.idMeal}` + '"}');
    var x = favMealMap.get(strMealId);
    
    if(favMealMap.get(strMealId) != undefined) {

        var index = getMealIndex(obj, strMealId);
        favMealMap.delete(strMealId);
        delete obj.meals[index];
    } else {
        favMealMap.set(strMealId, "true");
        obj['meals'].push(newObj);
 

    }
    favMealList = prepareFavMealJsonArr(obj);
    // favMealList = JSON.stringify(obj);
    console.log("PKS strMeal 206 " + favMealList);
}

function prepareFavMealJsonArr(favJsonObj) {
    var obj = JSON.parse('{ "meals": [] }');
    for(var i = 0; i < favJsonObj.meals.length; i++) {
        if(favJsonObj.meals[i] != null) {
            console.log("PKS strMeal 601 " + favJsonObj.meals[i]);
            obj.meals.push(favJsonObj.meals[i]);
        }
    }
    var newObjStr = JSON.stringify(obj);
    return newObjStr;
}

function getMealIndex(favMeals, mealId) {
    var index = 0;
    if(favMeals.meals) {
        for(var i = 0; i < favMeals.meals.length; i++) {
            var meal = favMeals.meals[i];
            if(meal.idMeal == mealId) {
                index = i;
                break;
            }
        }
    }
    return index;
}

function getFavMealList() {
    // document.getElementById()
     let html = "";
     var favMeal = JSON.parse(favMealList);
        if(favMeal.meals){
            favMeal.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">     
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "detail-btn">Get Recipe Details</a>
                        </div>
                    </div>
                `;
            });
        }
        favMeals.innerHTML = html;

    }



        
