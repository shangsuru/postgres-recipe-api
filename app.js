const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const db = require("./db/queries");

const port = 3050;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/recipes", db.getRecipes);
app.get("/recipes/:title", db.getRecipeDetails)
app.post("/recipes", db.createRecipe);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
