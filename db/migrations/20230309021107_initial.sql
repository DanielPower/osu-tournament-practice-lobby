-- migrate:up
create table users (
  id serial primary key,
  discord_id text,
  osu_id text
);

-- migrate:down
drop table users;
