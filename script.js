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
mealList.addEventListener('click', getMealReciepe);
homeBtn.addEventListener('click', showHomePage);
favBtn.addEventListener('click', showFavoritesPage);

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


function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">     
                        </div>
                        <i class='fa-solid fa-heart' id ="favImg" style = "color: blue" onclick="colorblue(this, '${meal.idMeal}', '${meal.strMeal}', '${meal.strMealThumb}') "></i>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "detail-btn">Get Recipe Details</a>
                        </div>
                    </div>
                `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "Sorry, we didn't find any meal!";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;

        });
}


// get meal reciepe of the meal

function getMealReciepe(e) {
    e.preventDefault();
    if (e.target.classList.contains('detail-btn')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));

    }
}

// create a modal

function mealRecipeModal(meal) {
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


function AddToFavoriteList(mealId, mealStr, mealThumb) {
    // meal = meal[0];
    var retStatus = 0;
    var obj = JSON.parse(favMealList);


    var newObj = JSON.parse('{"strMeal": "' + mealStr + '", "strMealThumb": "' + mealThumb + '", "idMeal": "' + mealId + '"}');
    var x = favMealMap.get(mealId);

    if (favMealMap.get(mealId) != undefined) {
        var index = getMealIndex(obj, mealId);
        favMealMap.delete(mealId);
        delete obj.meals[index];
        retStatus = 0;
    } else {
        favMealMap.set(mealId, "true");
        obj['meals'].push(newObj);
        retStatus = 1;
    }
    favMealList = prepareFavMealJsonArr(obj);
    return retStatus;
}

function colorblue(element, mealId, mealStr, mealThumb) {
    let mealItem = element.parentElement;

    // element.style.color = "red";
    var ret = AddToFavoriteList(mealId, mealStr, mealThumb);
    if(ret == 1) {
        element.style.color = "red";
    } else {
        element.style.color = "blue";
    }
    
}


function prepareFavMealJsonArr(favJsonObj) {
    var obj = JSON.parse('{ "meals": [] }');
    for (var i = 0; i < favJsonObj.meals.length; i++) {
        if (favJsonObj.meals[i] != null) {
            obj.meals.push(favJsonObj.meals[i]);
        }
    }
    var newObjStr = JSON.stringify(obj);
    return newObjStr;
}

function getMealIndex(favMeals, mealId) {
    var index = 0;
    if (favMeals.meals) {
        for (var i = 0; i < favMeals.meals.length; i++) {
            var meal = favMeals.meals[i];
            if (meal.idMeal == mealId) {
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
    if (favMeal.meals) {
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




