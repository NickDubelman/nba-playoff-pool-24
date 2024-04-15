<script>
  import * as d3 from 'd3'

  import participants from '../participants'
  import eliminatedTeams from '../eliminatedTeams'
  import { haventPlayedYet } from '../utils'

  export let gameStats

  const allTeams = [...new Set(gameStats.map((stat) => stat.team))].sort()
  let breakdownTeam = allTeams.length > 0 ? allTeams[0] : ''

  $: statsForTeam = gameStats.filter(
    (gameStat) => gameStat.team === breakdownTeam,
  )
  $: playersForTeam = [...new Set(statsForTeam.map((stat) => stat.player))]

  $: playerStats = playersForTeam
    .map((player) => {
      let points = 0
      let gamesPlayed = 0

      const playerStats = statsForTeam.filter((stat) => stat.player === player)
      if (playerStats.length > 0) {
        points = d3.sum(playerStats.map((stat) => stat.points))
        gamesPlayed = playerStats.filter(
          (stat) => stat.minutes && stat.minutes !== '0:00',
        ).length
      } else {
        // See if the player hasn't played yet
        const player = haventPlayedYet.find((p) => p.name === player)
        if (player) {
          gamesPlayed = 0
        }
      }

      // Lookup the participant
      const participant =
        participants.find((p) => p.players.includes(player))?.name || null

      return { player, points, gamesPlayed, participant }
    })
    .sort((a, b) => (a.points > b.points ? -1 : 1))

  $: teamIsEliminated = eliminatedTeams.includes(breakdownTeam)

  const greenInterpolator = d3.interpolateHsl('white', '#38c434CC')

  $: pointsColor = d3
    .scaleSequential()
    .domain([0, d3.max((playerStats || []).map((p) => p.points))])
    .interpolator(greenInterpolator)

  $: gamesPlayedColor = d3
    .scaleSequential()
    .domain([0, d3.max((playerStats || []).map((p) => p.gamesPlayed))])
    .interpolator(greenInterpolator)

  $: ppgColor = d3
    .scaleSequential()
    .domain([
      0,
      d3.max((playerStats || []).map((p) => p.points / p.gamesPlayed)),
    ])
    .interpolator(greenInterpolator)
</script>

<h2>Team Breakdown</h2>

<div style="margin-bottom: 8px">
  <span style="margin-right: 4px">Select a team</span>

  <select bind:value={breakdownTeam}>
    {#each allTeams as team}
      <option value={team}>{team}</option>
    {/each}
  </select>
</div>

{#if playerStats.length === 0}
  <span style="color: red">Nobody from {breakdownTeam} to show data for</span>
{:else}
  {#if teamIsEliminated}
    <div style="color: red">{breakdownTeam} has been eliminated</div>
  {/if}

  <table>
    <tr>
      <th>Player</th>
      <th>Picked by</th>
      <th>Total Points</th>
      <th>Games</th>
      <th>PPG</th>
    </tr>

    {#each playerStats as { player, participant, points, gamesPlayed }}
      <tr>
        <td>{player}</td>
        <td>{participant || '--'}</td>
        <td style="background: {pointsColor(points)}">{points}</td>
        <td style="background: {gamesPlayedColor(gamesPlayed)}"
          >{gamesPlayed}</td
        >
        <td style="background: {ppgColor(points / gamesPlayed || 0)}">
          {points > 0 ? Math.round((points / gamesPlayed) * 100) / 100 : 0}
        </td>
      </tr>
    {/each}
  </table>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 432px;
  }

  tr:not(:last-child) {
    border-bottom: solid 1px #eee;
  }

  tr th {
    text-align: left;
  }

  @media (max-width: 768px) {
    select {
      font-size: 1.32em;
    }
  }
</style>