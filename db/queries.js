const { user, host, database, password, port } = require("./config");

const Pool = require("pg").Pool;
const pool = new Pool({
  user,
  host,
  database,
  password,
  port
});

const getRecipes = (request, response) => {
  const query = request.query.q;
  pool.query(
    "select title, rating, recipe_img, prep_time from recipes where title like $1",
    ["%" + query + "%"],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      response.status(200).json(results.rows);
    }
  );
};

const getRecipeDetails = (request, response) => {
  const title = request.params.title;
  pool.query(
    "select * from recipes where title=$1",
    [title],
    (error, results) => {
      if (error) {
        console.log(error);
      }
      response.status(200).json(results.rows);
    }
  );
};

const createRecipe = (request, response) => {
  const { title, instructions, author, prep_time, ingredients } = request.body;
  pool.query(
    "insert into recipes (title, instructions, author, prep_time) values ($1, $2, $3, $4, $5)",
    [title, instructions, author, prep_time],
    (error, results) => {
      if (error) {
        console.log(error);
      }

      for (let i = 0; i < ingredients.length; i++) {
        pool.query(
          "insert into ingredients (title, ingredient, amount) values ($1, $2, $3)",
          [title, ingredients[i].ingredient, ingredients[i].amount],
          (error, results) => {
            if (error) {
              console.log(error);
            }
          }
        );
      }

      response.status(201).send(`Recipe added`);
    }
  );
};

const addPicture = (request, response) => {
  const imageName = request.file.filename;
  const recipeTitle = request.query.recipe;
  pool.query(
    "update recipes set recipe_img = $1 where title = $2",
    [imageName, recipeTitle],
    (error, results) => {
      if (error) {
        console.log(error);
      }

      response.status(201).send("picture added");
    }
  );
};

module.exports = { getRecipes, createRecipe, getRecipeDetails, addPicture };
