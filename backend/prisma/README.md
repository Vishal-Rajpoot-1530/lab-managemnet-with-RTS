# Database (Prisma + MySQL)

`schema.prisma` is the only description of the database. The SQL files that used
to live in `database/` are gone; do not recreate tables by hand.

## First time on a new machine, or after pulling

1. Install MySQL 8 and run `npm install` in `backend/`.
2. Copy `.env.example` to `.env` and set your MySQL login:

   ```
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/lab_lims"
   ```

   If the password contains `@ : / # ?` characters, URL-encode them (`@` becomes `%40`).

3. Build the database:

   ```
   npm run db:reset
   ```

   This **deletes everything** in the database named in `DATABASE_URL` (including
   any old tables), creates all tables from `prisma/migrations`, and loads the
   starting data from `seed.ts`. It asks for confirmation first.

4. Start the backend (`npm run dev`).

## Day to day

| Task | Command |
| --- | --- |
| Pulled someone's schema change (keeps your data) | `npm run db:deploy` |
| Changed `schema.prisma` | `npm run db:migrate -- --name what_changed`, then commit `prisma/migrations/` |
| Reload the starting data (never overwrites existing rows) | `npm run db:seed` |
| Wipe and rebuild everything | `npm run db:reset` |
| Browse the data in a web page | `npm run db:studio` |

Always commit the `prisma/migrations/` folder. It is what lets everyone else get
your table changes without losing their data. Never commit `.env`.
