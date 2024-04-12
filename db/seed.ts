import { NBAPlayer, NBATeam, Participant, db } from 'astro:db'

// https://astro.build/db/seed
export default async function seed() {
  // Insert some participants
  await db.insert(Participant).values([
    { name: 'Nick', favoriteTeam: 'Lakers' },
    { name: 'David', favoriteTeam: 'Nuggets' },
    { name: 'Daniel', favoriteTeam: 'Nuggets' },
  ])

  // Create some NBA teams
  await db.insert(NBATeam).values([
    { name: 'Lakers', shortName: 'LAL', color: 'purple' },
    { name: 'Nuggets', shortName: 'DEN', color: 'blue' },
  ])

  // Create some NBA players
  await db.insert(NBAPlayer).values([
    { name: 'Lebron James', team: 1, participant: 1 },
    { name: 'Anthony Davis', team: 1 },
    { name: 'Nikola Jokic', team: 2, participant: 2 },
    { name: 'Jamal Murray', team: 2, participant: 3 },
    { name: 'Michael Porter Jr.', team: 2 },
  ])
}
