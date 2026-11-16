# Smit & Harsiddh — wedding invitation site

Static site (no build step): `index.html`, `styles.css`, `main.js`, `config.js`, `assets/`, `fonts/`.

## Deploy on Vercel
Import this folder/repo in Vercel with framework preset "Other" and no build command, or run `npx vercel --prod` inside it.

## Turn on RSVP saving (Supabase)
1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Put the project URL and publishable (anon) key in `config.js`.
3. Redeploy. Responses appear in the `rsvps` table (Table Editor → rsvps).

Until step 2 is done the form works but tells guests RSVP is not open yet and saves nothing.
