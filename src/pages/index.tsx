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
  })
  console.log(lat, lon)

  const { data, error } = useSwr(['/api/planes/?', lat, lon], getPlanes)

  if (!session) {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    )
  }
  if (error) return <div>Failed to load planes</div>
  if (!data) return <div>Loading...</div>
  if (geoError) return <div>Geolocation error</div>
  
  return (
        <div className='grid place-items-center px-5'>
        <table className='table-fixed text-left border w-1/2 rounded-md border-spacing-2 border-separate'>
          <thead>
            <tr className='border border-separate text-xl'>
              <th className='pl-3'>callsign</th>
              <th className='pr-3 text-right'>altitude</th>
              <th className='pr-3 text-right'>velocity</th>
              <th className='pr-3 text-right'>vertical rate</th>
              <th className='pl-3 text-right'>on ground?</th>
            </tr>
          </thead>
          <tbody>
            {data.map((plane) => (
              <tr key = { plane[0] } className='text-lg'> 
                <td className='pl-3 underline'>
                  <a href={'https://flightaware.com/live/flight/' + plane[1]} target="_blank" rel="noopener noreferrer">{ plane[1] }
                  </a>
                </td>
                <td className='pr-3 text-right'>{ `${Math.round(plane[13])} m` } </td>
                <td className='pr-3 text-right'>{ `${Math.round(plane[9])} m/s` } </td> 
                <td className='pr-3 text-right'>{`${Math.round(plane[11])} m/s` }</td> 
                <td className='pr-3 text-right'>{ '' + plane[8] } </td> 
              </tr>
            ))}
        </tbody>
        </table>
        <button onClick={() => signOut()}>Sign out</button>
        </div>
      )
}
  
export default Home;
