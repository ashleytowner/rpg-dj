create table if not exists sounds (
	id UUID primary key default gen_random_uuid(),
	name varchar(255) not null,
	path varchar(255) not null unique,
	created_at timestamp with time zone default CURRENT_TIMESTAMP,
	updated_at timestamp with time zone default CURRENT_TIMESTAMP
);

create or replace function update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = NOW();
    RETURN NEW;
end;
$$ language plpgsql;

drop trigger if exists scenes_updated_at_trigger on scenes;
create trigger scenes_updated_at_trigger
before update on scenes
for each row
execute function update_updated_at_column();
