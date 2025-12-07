-- GiftWise List Sharing / Collaborative Lists
-- Allows multiple users to share and edit the same gift lists

-- ===========================================
-- List Members table (collaborators)
-- ===========================================
create table list_members (
  id uuid default uuid_generate_v4() primary key,
  list_id uuid references gift_lists(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text check (role in ('owner', 'editor', 'viewer')) default 'editor',
  invited_by uuid references auth.users(id),
  invited_at timestamptz default now(),
  accepted_at timestamptz,
  unique(list_id, user_id)
);

-- Index for fast lookups
create index list_members_list_id_idx on list_members(list_id);
create index list_members_user_id_idx on list_members(user_id);

-- ===========================================
-- List Invites table (pending invitations)
-- ===========================================
create table list_invites (
  id uuid default uuid_generate_v4() primary key,
  list_id uuid references gift_lists(id) on delete cascade not null,
  invite_token text unique not null,
  email text not null,
  role text check (role in ('editor', 'viewer')) default 'editor',
  invited_by uuid references auth.users(id) not null,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '7 days'),
  accepted_at timestamptz,
  accepted_by uuid references auth.users(id)
);

-- Index for token lookups
create index list_invites_token_idx on list_invites(invite_token);
create index list_invites_email_idx on list_invites(email);

-- Enable RLS on new tables
alter table list_members enable row level security;
alter table list_invites enable row level security;

-- ===========================================
-- Helper function: Check if user has access to a list
-- ===========================================
create or replace function has_list_access(check_list_id uuid, check_user_id uuid)
returns boolean as $$
begin
  return exists (
    -- Owner check
    select 1 from gift_lists where id = check_list_id and user_id = check_user_id
  ) or exists (
    -- Member check
    select 1 from list_members where list_id = check_list_id and user_id = check_user_id and accepted_at is not null
  );
end;
$$ language plpgsql security definer;

-- ===========================================
-- Helper function: Check if user can edit a list
-- ===========================================
create or replace function can_edit_list(check_list_id uuid, check_user_id uuid)
returns boolean as $$
begin
  return exists (
    -- Owner can always edit
    select 1 from gift_lists where id = check_list_id and user_id = check_user_id
  ) or exists (
    -- Editor member can edit
    select 1 from list_members
    where list_id = check_list_id
    and user_id = check_user_id
    and role in ('owner', 'editor')
    and accepted_at is not null
  );
end;
$$ language plpgsql security definer;

-- ===========================================
-- Update gift_lists RLS policies
-- ===========================================
-- Drop old policies
drop policy if exists "Users can view own gift lists" on gift_lists;
drop policy if exists "Users can update own gift lists" on gift_lists;
drop policy if exists "Users can delete own gift lists" on gift_lists;

-- New policies including collaborators
create policy "Users can view accessible gift lists"
  on gift_lists for select
  using (
    auth.uid() = user_id
    or exists (
      select 1 from list_members
      where list_id = gift_lists.id
      and user_id = auth.uid()
      and accepted_at is not null
    )
  );

create policy "Users can update accessible gift lists"
  on gift_lists for update
  using (can_edit_list(id, auth.uid()));

create policy "Users can delete own gift lists"
  on gift_lists for delete
  using (auth.uid() = user_id);

-- ===========================================
-- Update gift_items RLS policies
-- ===========================================
drop policy if exists "Users can view own gift items" on gift_items;
drop policy if exists "Users can create gift items in own lists" on gift_items;
drop policy if exists "Users can update own gift items" on gift_items;
drop policy if exists "Users can delete own gift items" on gift_items;

create policy "Users can view accessible gift items"
  on gift_items for select
  using (has_list_access(list_id, auth.uid()));

create policy "Users can create gift items in accessible lists"
  on gift_items for insert
  with check (can_edit_list(list_id, auth.uid()));

create policy "Users can update accessible gift items"
  on gift_items for update
  using (can_edit_list(list_id, auth.uid()));

create policy "Users can delete accessible gift items"
  on gift_items for delete
  using (can_edit_list(list_id, auth.uid()));

-- ===========================================
-- Update retailer_links RLS policies
-- ===========================================
drop policy if exists "Users can view own retailer links" on retailer_links;
drop policy if exists "Users can create retailer links for own items" on retailer_links;
drop policy if exists "Users can update own retailer links" on retailer_links;
drop policy if exists "Users can delete own retailer links" on retailer_links;

create policy "Users can view accessible retailer links"
  on retailer_links for select
  using (
    item_id in (
      select gi.id from gift_items gi
      where has_list_access(gi.list_id, auth.uid())
    )
  );

create policy "Users can create retailer links for accessible items"
  on retailer_links for insert
  with check (
    item_id in (
      select gi.id from gift_items gi
      where can_edit_list(gi.list_id, auth.uid())
    )
  );

create policy "Users can update accessible retailer links"
  on retailer_links for update
  using (
    item_id in (
      select gi.id from gift_items gi
      where can_edit_list(gi.list_id, auth.uid())
    )
  );

create policy "Users can delete accessible retailer links"
  on retailer_links for delete
  using (
    item_id in (
      select gi.id from gift_items gi
      where can_edit_list(gi.list_id, auth.uid())
    )
  );

-- ===========================================
-- list_members RLS policies
-- ===========================================
create policy "Users can view members of accessible lists"
  on list_members for select
  using (has_list_access(list_id, auth.uid()));

create policy "List owners can add members"
  on list_members for insert
  with check (
    list_id in (select id from gift_lists where user_id = auth.uid())
  );

create policy "List owners can update members"
  on list_members for update
  using (
    list_id in (select id from gift_lists where user_id = auth.uid())
  );

create policy "List owners can remove members"
  on list_members for delete
  using (
    list_id in (select id from gift_lists where user_id = auth.uid())
    or user_id = auth.uid() -- Users can remove themselves
  );

-- ===========================================
-- list_invites RLS policies
-- ===========================================
create policy "Users can view invites they created or received"
  on list_invites for select
  using (
    invited_by = auth.uid()
    or email = (select email from auth.users where id = auth.uid())
  );

create policy "List owners can create invites"
  on list_invites for insert
  with check (
    list_id in (select id from gift_lists where user_id = auth.uid())
  );

create policy "List owners can update invites"
  on list_invites for update
  using (
    invited_by = auth.uid()
    or email = (select email from auth.users where id = auth.uid())
  );

create policy "List owners can delete invites"
  on list_invites for delete
  using (invited_by = auth.uid());

-- ===========================================
-- Auto-add owner as member when list created
-- ===========================================
create or replace function add_owner_as_member()
returns trigger as $$
begin
  insert into list_members (list_id, user_id, role, accepted_at)
  values (new.id, new.user_id, 'owner', now());
  return new;
end;
$$ language plpgsql security definer;

create trigger gift_lists_add_owner
  after insert on gift_lists
  for each row execute function add_owner_as_member();
