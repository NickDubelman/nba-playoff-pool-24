<script>
  import * as d3 from 'd3'

  export let gameStats

  let numPlayers = 8

  // Get the top scorers from the most recent day that has games recorded

  const startedGames = gameStats
    .map(({ game }) => game)
    .filter((game) => game.homeTeamScore > 0 || game.awayTeamScore > 0)
    .sort((a, b) => (a.date > b.date ? -1 : 1))

  if (startedGames.length === 0) {
    throw new Error('could not get any games')
  }

  const { date } = startedGames[0]
  const statsForGames = gameStats.filter(
    (stats) => stats.game.date.getTime() === date.getTime(),
  )

  $: topPerformances = statsForGames
    .sort((a, b) => {
      if (a.points !== b.points) {
        return a.points > b.points ? -1 : 1
      }

      return a.player.localeCompare(b.player)
    })
    .slice(0, numPlayers)

  $: {
    if (topPerformances.length === 0) {
      throw new Error('could not get top performers')
    }
  }

  $: lastPerformance = topPerformances[topPerformances.length - 1]
  $: maxPoints = d3.max(topPerformances.map((p) => p.points))
  $: pointsColor = d3
    .scaleSequential()
    .domain([Math.min(lastPerformance.points - 2, maxPoints / 2), maxPoints])
    .interpolator(d3.interpolateHsl('white', '#38c434CC'))

  function getGameStatus(time, status) {
    return status === 'Final' ? 'Final' : `${status} ${time}`
  }
</script>

<h2 class="text-2xl font-bold py-3">Today's Top Performers</h2>

<div class="num-players-selector">
  <input type="range" min="3" max="32" bind:value={numPlayers} />
  <span>showing top {numPlayers}</span>
</div>

<table>
  <tr>
    <th>Player</th>
    <th>Team</th>
    <th>Picked by</th>
    <th>Points</th>
    <th>Game Status</th>
  </tr>

  {#each topPerformances as { player, points, game, team, participant }}
    <tr>
      <td>{player}</td>
      <td>{team}</td>
      <td class:red={!participant}>
        {participant || 'Not picked'}
      </td>
      <td style="background: {pointsColor(points)}">{points}</td>
      <td>{getGameStatus(game.time, game.status)}</td>
    </tr>
  {/each}
</table>

<style>
  table {
    width: 100%;
    font-size: 0.86em;
    border-collapse: collapse;
  }

  td {
    border: 1px solid #ddd;
    border-collapse: collapse;
  }

  tr th {
    text-align: left;
  }

  tr td {
    padding: 8px 4px 8px 4px;
  }

  .red {
    color: red;
  }

  .num-players-selector {
    display: flex;
    margin-bottom: 8px;
  }

  .num-players-selector input {
    margin: 0;
    margin-right: 8px;
  }
</style>
