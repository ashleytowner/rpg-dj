create table if not exists sounds (
	id UUID primary key default gen_random_uuid(),
	name varchar(255) not null,
	path varchar(255) not null unique,
	created_at timestamp with time zone default CURRENT_TIMESTAMP,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP
);

create table if not exists playlists (
	id UUID primary key default gen_random_uuid(),
	name varchar(255) not null,
	created_at timestamp with time zone default CURRENT_TIMESTAMP,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP
);

create table if not exists playlist_sounds (
	playlist_id UUID not null references playlists(id),
	sound_id UUID not null references sounds(id),
	position integer not null,
	created_at timestamp with time zone default CURRENT_TIMESTAMP,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP,
	primary key (playlist_id, position)
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = NOW();
    RETURN NEW;
end;
$$ language plpgsql;

drop trigger if exists sounds_updated_at_trigger on sounds;
create trigger sounds_updated_at_trigger
before update on sounds
for each row
execute function update_updated_at_column();

drop trigger if exists playlists_updated_at_trigger on playlists;
create trigger playlists_updated_at_trigger
before update on playlists
for each row
execute function update_updated_at_column();

drop trigger if exists playlist_sounds_updated_at_trigger on playlist_sounds;
create trigger playlist_sounds_updated_at_trigger
before update on playlist_sounds
for each row
execute function update_updated_at_column();

