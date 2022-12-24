import { type NextPage } from "next";
import React, { useState, useEffect } from 'react';
import useSwr from 'swr'
import { useSession, signIn, signOut } from "next-auth/react"

export const getPlanes = async (url: string, lat: string, lon: string): Promise<[]> => {

  const Params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString()
  })

  const data  = await fetch(url + Params)
      .then((res) => res.json())
  return data

};

const Home: NextPage = () => {

  const { data: session } = useSession()
  const [geoError, setError] = useState('');
  const [lat, setLat] = useState<number | any>();
  const [lon, setLong] = useState<number | any>();
  
  useEffect(() => {
    const geolocationAPI = navigator.geolocation;
    if (!geolocationAPI) {
      setError('Geolocation API is not available in your browser!')
    } else {
      geolocationAPI.getCurrentPosition((position) => {
        const { coords } = position;
        setLat(coords.latitude);
        setLong(coords.longitude);
      }, (error) => {
        console.log(error)
        setError('Something went wrong getting your position!')
      })
    }
  }, [])

  const { data, error } = useSwr(['/api/planes/?', lat, lon], getPlanes)

  if (!session) {
    return (
      <>
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }

  if (!data) return <div>Loading...</div>
  if (error) return <div>Failed to load planes</div>
  if (geoError) return <div>Geolocation error</div>

  return (
        <div className='grid place-items-center px-5'>
        <table className='table-fixed text-right border rounded-md border-spacing-5'>
          <thead>
            <tr className='border border-separate text-xl h-12'>
              <th className='pl-3 w-32 text-left'>callsign</th>
              <th className='pr-3 w-32'>distance</th>
              <th className='pr-3 w-32'>altitude</th>
              <th className='pr-3 w-32'>velocity</th>
              <th className='pr-3 w-32'>vertical rate</th>
              <th className='pr-3 w-32'>ground?</th>
              <th className='pr-3 w-32'>time position</th>
            </tr>
          </thead>
          <tbody>
            {data.map((plane) => (
              <tr key = { plane[0] } className='text-lg odd:bg-slate-700 h-10'> 
                <td className='pl-3 underline text-left'>
                  <a href={'https://flightaware.com/live/flight/' + plane[1]} target="_blank" rel="noopener noreferrer">{ plane[1] }
                  </a>
                </td>
                <td className='pr-3'>{ `${Math.round(plane['dist'])} m` } </td>
                <td className='pr-3'>{ `${Math.round(plane[13])} m` } </td>
                <td className='pr-3'>{ `${Math.round(plane[9])} m/s` } </td> 
                <td className='pr-3'>{`${Math.round(plane[11])} m/s` }</td> 
                <td className='pr-3'>{ '' + plane[8] } </td> 
                <td className='pr-3'>{`${Math.round(Date.now() / 1000 - plane[3])} s` }</td> 
              </tr>
            ))}
        </tbody>
        </table>
        <br/>
        <div>{`Lat: ${lat.toPrecision(5)}, Lon: ${lon.toPrecision(5)}`}</div> 
        <br/>
        <button onClick={() => signOut()}>Sign out</button>
        </div>
      )
}
  
export default Home;
