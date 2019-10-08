const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const FILE = "data.sql";

// takes the recipe data, converts it into valid sql insert statements and appends them to a file
function generateSql(
  recipe_name,
  instructions,
  recipe_img,
  author,
  prep_time,
  ingredients
) {
  fs.appendFileSync(
    FILE,
    `\ninsert into recipes (recipe_name, instructions, recipe_img, author, prep_time)
     values ('${recipe_name}', '${instructions}', '${recipe_img}', '${author}', '${prep_time}');`
  );

  ingredients.forEach(ingredient => {
    fs.appendFileSync(
      FILE,
      `\ninsert into ingredients values ('${recipe_name}', '${ingredient}');`
    );
  });
}

// scrapes a recipe site and collects the data of the listed recipes
function getRecipeData() {
  // loop through pages // TODO
  for (let page = 1; page <= 5; page++) {
    request(getPageLink(page), (error, response, html) => {
      if (!error && response.statusCode === 200) {
        let $ = cheerio.load(html);
        // follow each link to a single recipe
        console.log($("a.ng-isolate-scope").attr("href"));
        // .each(index => {
        //   const linkToRecipe = $(this).attr("href");
        //   console.log(linkToRecipe);
        //});
        //extractDataFromRecipe(linkToRecipe);
      }
    });
  }
}

function getPageLink(page) {
  return `https://www.allrecipes.com/?page=${page}`;
}

function extractDataFromRecipe(address) {
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

      console.log("Name: " + recipe_name);
      console.log("Instructions: " + instructions);
      console.log("Image: " + recipe_img);
      console.log("Author: " + author);
      console.log("Time: " + prep_time);
      console.log("Ingredients: " + ingredients);

      // generateSql(
      //   recipe_name,
      //   instructions,
      //   recipe_img,
      //   author,
      //   prep_time,
      //   ingredients
      // );
    }
  });
}

extractDataFromRecipe(
  "https://www.allrecipes.com/recipe/17066/janets-rich-banana-bread/?internalSource=previously%20viewed&referringContentType=Homepage&clickId=cardslot%2090"
);
