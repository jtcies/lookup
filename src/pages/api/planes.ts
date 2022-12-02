import { NextApiRequest, NextApiResponse } from "next";
import { type QueryParams } from "../../interfaces";
import geoDistance from "../../utils/calcGeoDistance"

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
        const ret = data.map(x => Object.assign({}, x, {'dist': geoDistance(lat, x[6], lon, x[5])}))
        return ret
    })
    .then((data) => {
        data.sort((a, b) => (a['dist'] ?? 0) - (b['dist'] ?? 0))
        return data
    })

    console.log( resData )
    return res.status(200).json( resData );
  }