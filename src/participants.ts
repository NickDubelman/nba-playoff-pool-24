import { db, eq, NBAPlayer, NBATeam, Participant } from 'astro:db'

interface ParticipantWithPlayers {
  name: string
  favoriteTeam?: string
  players: string[]
}

// Hardcoded list of participants (for seeding participants and player selections)
const participants: ParticipantWithPlayers[] = [
  {
    name: 'Tomlinson',
    players: ['Jayson Tatum'],
  },
  {
    name: 'Daniel',
    favoriteTeam: 'DEN',
    players: ['Nikola Jokic'],
  },
  {
    name: 'Senac/Whitaker',
    players: ['Shai Gilgeous-Alexander'],
  },
  {
    name: 'Moore',
    players: ['Jalen Brunson'],
  },
  {
    name: 'Malatesta',
    players: ['Jaylen Brown'],
  },
  {
    name: 'Nick',
    favoriteTeam: 'LAL',
    players: ['Luka Doncic', 'Paul George'],
  },
  {
    name: 'Winston',
    players: ['Giannis Antetokounmpo', 'Jalen Williams'],
  },
  {
    name: 'David',
    favoriteTeam: 'DEN',
    players: ['Jamal Murray', 'Derrick White'],
  },
  {
    name: 'Robbie',
    players: ['Kristaps Porzingis', 'Michael Porter Jr.'],
  },
  {
    name: 'Mikey',
    players: ['Kyrie Irving', 'Kawhi Leonard'],
  },
  {
    name: 'Victors',
    players: ['Donovan Mitchell', 'Joel Embiid'],
  },
  {
    name: 'Ethan',
    players: ['Damian Lillard', 'Anthony Edwards'],
  },
]

// Function to get participants as per the db (dynamic)
export async function getParticipants(): Promise<ParticipantWithPlayers[]> {
  const rows = await db
    .select()
    .from(Participant)
    .innerJoin(NBAPlayer, eq(NBAPlayer.participantId, Participant.id))
    .leftJoin(NBATeam, eq(NBATeam.id, Participant.favoriteTeamId))

  // Create a map from participant id to participant (as we accumulate the players)
  const participantMap = rows.reduce<Record<number, ParticipantWithPlayers>>(
    (acc, row) => {
      const participant: ParticipantWithPlayers = acc[row.Participant.id] || {
        name: row.Participant.name,
        favoriteTeam: row.NBATeam?.shortName || undefined,
        players: [],
      }

      participant.players.push(row.NBAPlayer.name)

      acc[row.Participant.id] = participant

      return acc
    },
    {},
  )

  // Turn the rows into a list of participants
  return Object.values(participantMap).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export default participants
