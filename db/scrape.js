const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const FILE = "data.sql";
const BREAKFAST = "https://www.allrecipes.com/recipes/78/breakfast-and-brunch/";
const DESSERTS = "https://www.allrecipes.com/recipes/79/desserts/";
const DINNER = "https://www.allrecipes.com/recipes/17562/dinner/";
const DRINKS = "https://www.allrecipes.com/recipes/77/drinks/";
const SNACKS = "https://www.allrecipes.com/recipes/76/appetizers-and-snacks/";

// scrapes categories of allrecipes.com and collects the data of the listed recipes
function getRecipeData(category, address) {
  // loop through pages
  for (let page = 1; page <= 5; page++) {
    request(getPageLink(address, page), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        let $ = cheerio.load(html);
        // follow each link to a single recipe
        $("h3.fixed-recipe-card__h3 a").each(function(index) {
          const linkToRecipe = $(this).attr("href");
          console.log(linkToRecipe);
          //extractDataFromRecipe(category, linkToRecipe);
        });
      }
      console.log(error)
    });
  }
}

function getPageLink(address, page) {
  return `${address}?page=${page}`;
}

function extractDataFromRecipe(category, address) {
  request(address, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      let $ = cheerio.load(html);

      const recipe_name = $("h1")
        .first()
        .text();
      const instructions = $(".step")
        .text()
        .replace(/\s\s+/g, "");
      const recipe_img = $("img.rec-photo").attr("src");
      const author = $(".submitter__name").text();
      const prep_time = $(
        "time[itemprop='totalTime'] span.prepTime__item--time"
      ).text();
      const ingredients = [];
      $("span[itemprop='recipeIngredient']").each(function(index) {
        ingredients.push($(this).text());
      });

      //console.log("Name: " + recipe_name);
      // console.log("Instructions: " + instructions);
      // console.log("Image: " + recipe_img);
      // console.log("Author: " + author);
      // console.log("Time: " + prep_time);
      // console.log("Category: " + category);
      // console.log("Ingredients: " + ingredients);
      // console.log();

      generateSql(
        recipe_name,
        instructions,
        recipe_img,
        author,
        prep_time,
        category,
        ingredients
      );
    }
  });
}

// takes the recipe data, converts it into valid sql insert statements and appends them to a file
function generateSql(
  recipe_name,
  instructions,
  recipe_img,
  author,
  prep_time,
  category,
  ingredients
) {
  fs.appendFileSync(
    FILE,
    `\ninsert into recipes (recipe_name, instructions, recipe_img, author, prep_time, category)
     values ('${recipe_name}', '${instructions}', '${recipe_img}', '${author}', '${prep_time}', '${category});`
  );

  ingredients.forEach(ingredient => {
    fs.appendFileSync(
      FILE,
      `\ninsert into ingredients values ('${recipe_name}', '${ingredient}');`
    );
  });
}

getRecipeData("breakfast", BREAKFAST);
getRecipeData("desserts", DESSERTS);
getRecipeData("dinner", DINNER);
getRecipeData("drinks", DRINKS);
getRecipeData("snacks", SNACKS);
