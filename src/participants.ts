import { db, eq, NBAPlayer, NBATeam, Participant } from 'astro:db'

interface ParticipantWithPlayers {
  name: string
  favoriteTeam?: string
  players: string[]
  draftOrder: number
}

// Hardcoded list of participants (for seeding participants and player selections)
const participants: ParticipantWithPlayers[] = [
  {
    name: 'Tomlinson',
    draftOrder: 1,
    players: [
      'Jayson Tatum',
      'Donte DiVincenzo',
      'Kevin Durant',
      'Al Horford',
      'Norman Powell',
      'Sam Hauser',
      'T.J. McConnell',
      'Miles McBride',
    ],
  },
  {
    name: 'Daniel',
    draftOrder: 2,
    favoriteTeam: 'DEN',
    players: [
      'Nikola Jokic',
      'Chet Holmgren',
      'Tobias Harris',
      'Payton Pritchard',
      'Josh Giddey',
      'Brandon Ingram',
      'CJ McCollum',
      'DeMar DeRozan',
    ],
  },
  {
    name: 'Senac/Whitaker',
    draftOrder: 3,
    players: [
      'Shai Gilgeous-Alexander',
      'Devin Booker',
      'Darius Garland',
      'Tyler Herro',
      'Brook Lopez',
      'Austin Reaves',
      'Klay Thompson',
      'Jusuf Nurkic',
    ],
  },
  {
    name: 'Moore',
    draftOrder: 4,
    players: [
      'Jalen Brunson',
      'Aaron Gordon',
      'Jrue Holiday',
      'Kentavious Caldwell-Pope',
      'Josh Hart',
      'Isaiah Hartenstein',
      'Mike Conley',
      'Nickeil Alexander-Walker',
    ],
  },

  {
    name: 'Malatesta',
    draftOrder: 5,
    players: [
      'Jaylen Brown',
      'Tyrese Maxey',
      'James Harden',
      'Franz Wagner',
      'Grayson Allen',
      "D'Angelo Russell",
      'Buddy Hield',
      'Wendell Carter Jr.',
    ],
  },

  {
    name: 'Nick',
    draftOrder: 6,
    favoriteTeam: 'LAL',
    players: [
      'Luka Doncic',
      'Paul George',
      'Karl-Anthony Towns',
      'Anthony Davis',
      'P.J. Washington',
      'Daniel Gafford',
      'Naz Reid',
      'Bojan Bogdanovic',
    ],
  },

  {
    name: 'Winston',
    draftOrder: 7,
    players: [
      'Giannis Antetokounmpo',
      'Jalen Williams',
      'Bradley Beal',
      'Paolo Banchero',
      'Bam Adebayo',
      'Stephen Curry',
      'Malik Beasley',
      'Aaron Wiggins',
    ],
  },

  {
    name: 'David',
    draftOrder: 8,
    favoriteTeam: 'DEN',
    players: [
      'Jamal Murray',
      'Derrick White',
      'Pascal Siakam',
      'Myles Turner',
      'Luguentz Dort',
      'Rudy Gobert',
      'Ivica Zubac',
      'Trey Murphy III',
    ],
  },

  {
    name: 'Robbie',
    draftOrder: 9,
    players: [
      'Kristaps Porzingis',
      'Michael Porter Jr.',
      'LeBron James',
      'Kelly Oubre Jr.',
      'Reggie Jackson',
      'Christian Braun',
      'Rui Hachimura',
      'Max Strus',
    ],
  },
  {
    name: 'Mikey',
    draftOrder: 10,
    players: [
      'Kyrie Irving',
      'Kawhi Leonard',
      'Tyrese Haliburton',
      'OG Anunoby',
      'Evan Mobley',
      'Zion Williamson',
      'Aaron Nesmith',
      "De'Aaron Fox",
    ],
  },
  {
    name: 'Victors',
    draftOrder: 11,
    players: [
      'Donovan Mitchell',
      'Joel Embiid',
      'Khris Middleton',
      'Jimmy Butler',
      'Jarrett Allen',
      'Terry Rozier',
      'Russell Westbrook',
      'Jaden McDaniels',
    ],
  },
  {
    name: 'Ethan',
    draftOrder: 12,
    players: [
      'Damian Lillard',
      'Anthony Edwards',
      'Bobby Portis',
      'Tim Hardaway Jr.',
      'Jalen Suggs',
      'Caris LeVert',
      'Cole Anthony',
      'Eric Gordon',
    ],
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
        draftOrder: row.Participant.draftOrder || 0,
        players: [],
      }

      participant.players.push(row.NBAPlayer.name)

      acc[row.Participant.id] = participant

      return acc
    },
    {},
  )

  // Sort each participant's players according to the hardcoded list above
  // This sort order reflects the order in which the players were drafted
  for (const { name, players } of Object.values(participantMap)) {
    players.sort(
      (a, b) =>
        participants.find((p) => p.name === name)?.players.indexOf(a)! -
        participants.find((p) => p.name === name)?.players.indexOf(b)!,
    )
  }

  // Turn the rows into a list of participants
  return Object.values(participantMap).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
}

export default participants
