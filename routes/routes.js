module.exports = app => {
  app.get("/recipes", db.getRecipes);
  app.get("/recipes/:title", db.getRecipeDetails);
  app.get("recipes/category/:category", getRecipesInCategory);
  app.post("/recipes", db.createRecipe);
  app.post("/recipes/image", upload.single("upload"), db.addPicture);
};
