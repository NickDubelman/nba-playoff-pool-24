# NBA Playoff Scoring Pool 2024

## Architecture

- UI: [Astro](https://astro.build/) + [Svelte](https://svelte.dev/)
- Database: [AstroDB](https://docs.astro.build/en/guides/astro-db/)
  - [LibSQL](https://turso.tech/libsql) (basically SQLite)
  - [Drizzle ORM](https://orm.drizzle.team/)
- Data: [BallDontLie API](https://www.balldontlie.io/)
- Deployment: [Netlify](https://www.netlify.com/)
  - Uses [scheduled functions](https://docs.netlify.com/functions/scheduled-functions/) to pull data from API and index into DB every 2 minutes

## TODO

- Port `DraftAnalysis` component from last year's repo
