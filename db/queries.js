require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const Pool = require("pg").Pool;
const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

const getRecipes = (request, response) => {
  const query = request.query.q;
  pool.query(
    "select recipe_name, rating, recipe_img, prep_time from recipes where recipe_name like $1",
    ["%" + query + "%"],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getRecipeDetails = (request, response) => {
  const title = request.params.title;
  pool.query(
    "select * from recipes where recipe_name = $1",
    [title],
    (error, results) => {
      if (error) {
        throw error;
      }
      let recipe = results.rows[0];
      pool.query(
        "select ingredient from ingredients where recipe_name = $1",
        [title],
        (error, results) => {
          if (error) {
            throw error;
          }
          let ingredientsList = [];
          results.rows.forEach(e => ingredientsList.push(e.ingredient));
          recipe["ingredients"] = ingredientsList;
          response.status(200).json(recipe);
        }
      );
    }
  );
};

const getRecipesInCategory = (request, response) => {
  const category = request.params.category;
  const offset = request.query.page - 1;
  pool.query(
    "select recipe_name, rating, recipe_img, prep_time from recipes where category = $1 order by rating desc limit 15 offset $2",
    [category, offset],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createRecipe = (request, response) => {
  const {
    recipe_name,
    instructions,
    author,
    prep_time,
    ingredients
  } = request.body;
  pool.query(
    "insert into recipes (recipe_name, instructions, author, prep_time) values ($1, $2, $3, $4, $5)",
    [recipe_name, instructions, author, prep_time],
    (error, results) => {
      if (error) {
        throw error;
      }

      for (let i = 0; i < ingredients.length; i++) {
        pool.query(
          "insert into ingredients (recipe_name, ingredient, amount) values ($1, $2, $3)",
          [recipe_name, ingredient[i]],
          (error, results) => {
            if (error) {
              throw error;
            }
          }
        );
      }

      response.status(201).send(`recipe added`);
    }
  );
};

const addPicture = (request, response) => {
  const imageName = request.file.filename;
  const recipeTitle = request.query.recipe;
  pool.query(
    "update recipes set recipe_img = $1 where recipe_name = $2",
    [imageName, recipeTitle],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.status(201).send("picture added");
    }
  );
};

module.exports = {
  getRecipes,
  getRecipeDetails,
  getRecipesInCategory,
  createRecipe,
  addPicture
};
