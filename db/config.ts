import { defineDb, defineTable, column } from 'astro:db'

const Participant = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    favoriteTeamId: column.number({
      references: () => NBATeam.columns.id,
      optional: true,
    }),
  },
})

const NBATeam = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    shortName: column.text(),
    color: column.text(),
  },
})

const NBAPlayer = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    teamId: column.number({ references: () => NBATeam.columns.id }),
    participantId: column.number({
      references: () => Participant.columns.id,
      optional: true,
    }),
  },
})

// https://astro.build/db/config
export default defineDb({
  tables: {
    Participant,
    NBATeam,
    NBAPlayer,
  },
})
