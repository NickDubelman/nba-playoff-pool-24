import { NBAPlayer, NBATeam, Participant, db } from 'astro:db'

// https://astro.build/db/seed
export default async function seed() {
  // Create some NBA teams
  await db.insert(NBATeam).values([
    { name: 'Lakers', shortName: 'LAL', color: 'purple' },
    { name: 'Nuggets', shortName: 'DEN', color: 'blue' },
  ])

  // Insert some participants
  await db.insert(Participant).values([
    { name: 'Nick', favoriteTeamId: 1 },
    { name: 'David', favoriteTeamId: 2 },
    { name: 'Daniel', favoriteTeamId: 2 },
  ])

  // Create some NBA players
  await db.insert(NBAPlayer).values([
    { name: 'Lebron James', teamId: 1, participantId: 1 },
    { name: 'Anthony Davis', teamId: 1 },
    { name: 'Nikola Jokic', teamId: 2, participantId: 2 },
    { name: 'Jamal Murray', teamId: 2, participantId: 3 },
    { name: 'Michael Porter Jr.', teamId: 2 },
  ])
}
