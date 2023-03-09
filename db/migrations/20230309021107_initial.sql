-- migrate:up
create table users (
  id integer,
  discord_id integer,
  osu_id integer
);

-- migrate:down
drop table users;
