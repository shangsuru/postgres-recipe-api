const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const FILE = "data.sql";

function generateSql(
  title,
  instructions,
  recipe_img,
  author,
  prep_time,
  ingredients // [{ingredient: ..., amount: ... }]
) {
  fs.appendFileSync(
    FILE,
    `\ninsert into recipes (title, instructions,recipe_img, author, prep_time)
     values ('${title}', '${instructions}', '${recipe_img}', '${author}', '${prep_time}');`
  );

  ingredients.forEach(elem => {
    fs.appendFileSync(
      FILE,
      `\ninsert into ingredients values ('${title}', '${elem.ingredient}', '${elem.amount}');`
    );
  });
}

generateSql(
  "Hot Dog",
  "Get your dog and put it in the oven",
  "CENSORED",
  "anonymous",
  "60",
  [
    { ingredient: "dog", amount: "1" },
    { ingredient: "sauce", amount: "1 litre" }
  ]
);

//function getRecipeData()
