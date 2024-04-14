import {
  db,
  eq,
  NBAPlayer,
  NBAPlayerGameStats,
  NBATeam,
  Participant,
} from 'astro:db'

export default async function getGameStats() {
  const stats = await db
    .select()
    .from(NBAPlayerGameStats)
    .innerJoin(NBAPlayer, eq(NBAPlayer.id, NBAPlayerGameStats.playerId))
    .innerJoin(NBATeam, eq(NBATeam.id, NBAPlayer.teamId))
    .leftJoin(Participant, eq(Participant.id, NBAPlayer.participantId))

  return stats.map((stat) => ({
    player: stat.NBAPlayer.name,
    team: stat.NBATeam.shortName,
    points: stat.NBAPlayerGameStats.points,
    minutes: stat.NBAPlayerGameStats.minutes,
    participant: stat.Participant?.name || null,
  }))
}
