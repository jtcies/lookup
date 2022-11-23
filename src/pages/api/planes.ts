import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
      const resData = await fetch(
        "https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226"
      )
      .then((response) => response.json())

      return res.status(200).json({ data: resData.states });
  }