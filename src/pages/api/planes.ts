import { NextApiRequest, NextApiResponse } from "next";
import { type QueryParams } from "../../interfaces";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const query: QueryParams = req.query

    const lat = Number(query.lat ?? process.env.DEFAULT_LAT)
    const lon = Number(query.lon ?? process.env.DEFAULT_LON)
    const range = Number(query.range ?? process.env.DEFAULT_RANGE)

    const ymin = 'lamin=' + (lat - range).toString()
    const ymax = 'lamax=' + (lat + range).toString()
    const xmin = 'lomin=' + (lon - range).toString()
    const xmax = 'lomax=' + (lon + range).toString()

    const queryString = [ymin, ymax, xmin, xmax].join('&')

    const resData = await fetch(
        "https://opensky-network.org/api/states/all?" + queryString, {
        headers: {
            "Content-Type": "text/plain",
            'Authorization': 'Basic ' + btoa(process.env.OPENSKY_USER?.toString() + ':' + process.env.OPENSKY_PASSWORD?.toString()),
            }
        }
    )
    .then((response) => response.json())
    .then((data) => data.states)
    .then((data: []) => {
        data.sort((a, b) => (b[13] ?? 0) - (a[13] ?? 0))
        return data
    })
    console.log( resData )
    return res.status(200).json( resData );
  }