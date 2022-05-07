import React, { useState, useEffect } from 'react'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'
import { BACKEND_URL } from '../constants'
// hack to make sure the marker icon is shown https://github.com/PaulLeCam/react-leaflet/issues/453
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

const Summary = () => {
  const [surveysNumber, setSurveysNumber] = useState(0)
  const [fields, setFields] = useState([])

  useEffect(() => {
    fetch(`${BACKEND_URL}/catalog/survey/`)
      .then((res) => res.json())
      .then((data) => setSurveysNumber(data.length))
  }, [])

  useEffect(() => {
    fetch(`${BACKEND_URL}/catalog/field/`)
      .then((res) => res.json())
      .then((data) => setFields(data))
  }, [])

  return (
    <div className='sm:rounded-lg'>
      <div className='flex flex-wrap mb-3'>
        <div className='w-28 rounded overflow-hidden shadow-lg border-2 p-2 mr-2'>
          <h2 className='text-lg font-bold'>Fields</h2>
          <p>{fields.length}</p>
        </div>
        <div className='w-28 rounded overflow-hidden shadow-lg border-2 p-2'>
          <h2 className='text-lg font-bold'>Surveys</h2>
          <p>{surveysNumber}</p>
        </div>
      </div>
      <MapContainer className='h-96' center={[31.2, 121.4]} zoom={9} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {fields.filter(field => field.lon).map((field) => (
          <Marker position={[field.lat, field.lon]}>
            <Popup>
              {field.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default Summary
