create table if not exists recipes (
  title text primary key,
  rating integer default 0,
  instructions text,
  recipe_img text,
  author text,
  prep_time integer
);

create table if not exists ingredients (
  title text references recipes(title) on delete cascade,
  ingredient text,
  amount text,
  primary key (title, ingredient)
);