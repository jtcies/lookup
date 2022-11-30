import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Plane } from "../interfaces";
import React, { useState } from 'react';
import useSwr from 'swr'

export const getPlanes = async (url: string): Promise<[]> => {

  const data  = await fetch(url)
      .then((res) => res.json())
  return data

};

const Home: NextPage = () => {

  const { data, error } = useSwr('/api/planes', getPlanes)

  if (error) return <div>Failed to load users</div>
  if (!data) return <div>Loading...</div>

  // const [lat, setLat] = useState<number | any>();
  // const [lon, setLong] = useState<number | any>();
  
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
        </div>
      )
}
  
export default Home;
