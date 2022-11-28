import { NextApiRequest, NextApiResponse } from "next";
import { Plane, QueryParams } from "../../interfaces";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Plane[]>) {
    const query: QueryParams = req.query
    // const lat: number = Number(query.lat ?? Math.random().toString())
    // const lon: number = Number(query.lat ?? Math.random().toString())
    const lat: number = Number(query.lat ?? process.env.DEFAULT_LAT)
    const lon: number = Number(query.lon ?? process.env.DEFAULT_LON)
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
    .then((data: Plane[]) => {
    data.sort((a: Plane, b: Plane) => b.geo_altitude - a.geo_altitude)
    return data
    })

    return res.status(200).json( resData );
  }