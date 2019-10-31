create table if not exists users (
  username varchar(60) primary key,
  userpassword varchar(60) not null
);
create table if not exists favorites (
  username varchar(60) references users(username) on delete cascade,
  recipe text references recipes(recipe_name) on delete cascade,
  primary key (username, recipe)
);