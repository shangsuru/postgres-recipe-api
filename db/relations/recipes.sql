create table if not exists recipes (
  recipe_name text primary key,
  rating integer default 0,
  instructions text,
  recipe_img text,
  author varchar(60) references users(username) on delete cascade,
  prep_time integer,
  category text
);

create table if not exists ingredients (
  recipe_name text references recipes(recipe_name) on delete cascade,
  ingredient text,
  primary key (recipe_name, ingredient)
);