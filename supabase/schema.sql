-- MegaSoft Enterprise Service & Asset Management System
-- Run this in the Supabase SQL Editor

create table department (
  department_id bigint generated always as identity primary key,
  department_name text not null unique
);

create table "user" (
  user_id bigint generated always as identity primary key,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('Employee', 'Technician', 'Admin')),
  department_id bigint not null references department (department_id),
  created_at timestamptz not null default now()
);

create table asset (
  asset_id bigint generated always as identity primary key,
  asset_name text not null,
  asset_type text not null,
  status text not null check (status in ('Active', 'Under Maintenance', 'Inactive')),
  purchase_date date,
  assigned_user_id bigint references "user" (user_id) on delete set null
);

create table service_request (
  request_id bigint generated always as identity primary key,
  title text not null,
  description text,
  priority text not null check (priority in ('Low', 'Medium', 'High', 'Critical')),
  status text not null check (status in ('Open', 'In Progress', 'Resolved', 'Closed')),
  created_at timestamptz not null default now(),
  created_by_user_id bigint not null references "user" (user_id),
  assigned_to_user_id bigint references "user" (user_id) on delete set null,
  asset_id bigint references asset (asset_id) on delete set null
);

create table maintenance_log (
  log_id bigint generated always as identity primary key,
  asset_id bigint not null references asset (asset_id) on delete cascade,
  technician_id bigint not null references "user" (user_id),
  maintenance_date date not null,
  notes text
);

-- Row Level Security (permissive for demo / interview app)
alter table department enable row level security;
alter table "user" enable row level security;
alter table asset enable row level security;
alter table service_request enable row level security;
alter table maintenance_log enable row level security;

create policy "Allow all on department" on department for all using (true) with check (true);
create policy "Allow all on user" on "user" for all using (true) with check (true);
create policy "Allow all on asset" on asset for all using (true) with check (true);
create policy "Allow all on service_request" on service_request for all using (true) with check (true);
create policy "Allow all on maintenance_log" on maintenance_log for all using (true) with check (true);

-- Seed data
insert into department (department_name) values
  ('IT'),
  ('Operations'),
  ('Human Resources');

insert into "user" (full_name, email, role, department_id) values
  ('Ahmed Hassan', 'ahmed.hassan@megasoft.com', 'Admin', 1),
  ('Sara Ali', 'sara.ali@megasoft.com', 'Technician', 1),
  ('Omar Khalid', 'omar.khalid@megasoft.com', 'Technician', 2),
  ('Layla Mohamed', 'layla.mohamed@megasoft.com', 'Employee', 3),
  ('Youssef Ibrahim', 'youssef.ibrahim@megasoft.com', 'Employee', 2);

insert into asset (asset_name, asset_type, status, purchase_date, assigned_user_id) values
  ('Dell Latitude 7420', 'Laptop', 'Active', '2024-03-15', 4),
  ('HP LaserJet Pro', 'Printer', 'Under Maintenance', '2023-08-20', 5),
  ('Cisco Switch 2960', 'Network', 'Active', '2022-11-10', null),
  ('Lenovo ThinkPad X1', 'Laptop', 'Inactive', '2021-05-01', null);

insert into service_request (title, description, priority, status, created_by_user_id, assigned_to_user_id, asset_id) values
  ('Laptop not booting', 'Device powers on but shows black screen.', 'Critical', 'Open', 4, null, 1),
  ('Printer paper jam', 'Printer stops after every few pages.', 'High', 'In Progress', 5, 2, 2),
  ('VPN access request', 'Need VPN access for remote work.', 'Medium', 'Open', 4, null, null);

insert into maintenance_log (asset_id, technician_id, maintenance_date, notes) values
  (2, 2, '2026-05-20', 'Cleaned rollers and replaced pickup roller.'),
  (1, 3, '2026-04-10', 'Updated BIOS and ran hardware diagnostics.');
