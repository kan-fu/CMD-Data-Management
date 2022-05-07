import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import { Marker } from 'react-leaflet/Marker'
import { Popup } from 'react-leaflet/Popup'

const Map = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const lat = searchParams.get('lat') || 31.2
  const lon = searchParams.get('lon') || 121.4
  const name = searchParams.get('name') || 'Center of Viewpoint'
  return (
    <div>
      <h1 className='text-lg font-bold mb-2'>{name}</h1>
      <MapContainer className='h-96' center={[lat, lon]} zoom={14} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Marker position={[lat, lon]}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default Map
