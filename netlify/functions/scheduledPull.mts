export default async (req: Request) => {
  const url = process.env.URL

  // Make a request to the API /pullData endpoint

  // Include PULL_DATA_PASSWORD as a Authorization header
  const headers = { Authorization: process.env.PULL_DATA_PASSWORD || '' }

  const resp = await fetch(`${url}/pullData`, { headers })
  const data = await resp.json()
  console.log(data)
}
