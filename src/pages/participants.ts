import type { APIRoute } from 'astro'

import { db, eq, NBAPlayer, NBATeam, Participant } from 'astro:db'

export const POST: APIRoute = async ({ request }) => {
  for (const participant of participants) {
    // Lookup the favorite team
    const teams = await db
      .select()
      .from(NBATeam)
      .where(eq(NBATeam.shortName, participant.favoriteTeam))

    if (teams.length === 0) {
      const error = `Team with abbreviation ${participant.favoriteTeam} not found`
      return new Response(JSON.stringify({ success: false, error }))
    }

    // Insert participant
    const favoriteTeamId = teams[0].id
    const result = await db
      .insert(Participant)
      .values({ name: participant.name, favoriteTeamId })
      .onConflictDoUpdate({ target: Participant.name, set: { favoriteTeamId } })

    const participantId = result.lastInsertRowid
    if (!participantId) {
      const error = `Failed to insert participant ${participant.name}`
      return new Response(JSON.stringify({ success: false, error }))
    }

    // Update players to reference the participant
    for (const player of participant.players) {
      await db
        .update(NBAPlayer)
        .set({ participantId: Number(participantId) })
        .where(eq(NBAPlayer.name, player))
    }
  }

  return new Response(JSON.stringify({ success: true }))
}

const participants = [
  {
    name: 'Nick',
    favoriteTeam: 'LAL',
    players: ['LeBron James', 'Anthony Davis'],
  },
  {
    name: 'David',
    favoriteTeam: 'DEN',
    players: ['Nikola Jokic', 'Jamal Murray'],
  },
  {
    name: 'Daniel',
    favoriteTeam: 'DEN',
    players: ['Michael Porter Jr.', 'Aaron Gordon'],
  },
]
