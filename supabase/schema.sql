-- RSVP table for the Smit & Harsiddh wedding site.
-- Guests can only add a response; nobody can read or change responses with the public key.
create table if not exists public.rsvps (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  name           text not null check (char_length(name) between 1 and 120),
  phone          text not null check (char_length(phone) between 7 and 24),
  attending_from text not null check (attending_from in ('India','Canada')),
  attending      boolean not null,
  guest_count    integer not null default 0 check (guest_count between 0 and 30),
  transportation text check (transportation in ('own_vehicle','bus')),
  bus_route      text check (bus_route in ('vadodara','ahmedabad')),
  check (attending or (guest_count = 0 and transportation is null and bus_route is null)),
  check (not attending or (guest_count >= 1 and transportation is not null)),
  check ((transportation = 'bus') = (bus_route is not null))
);

alter table public.rsvps enable row level security;

create policy "Guests can submit an RSVP"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);
