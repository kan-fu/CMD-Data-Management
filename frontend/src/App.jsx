import Sidebar from './components/Sidebar'
import { Outlet } from 'react-router-dom'
import Helmet from 'react-helmet'
// import Navbar from './components/Navbar';
function App() {
  return (
    <>
    {/* Leaflet requirement */}
      <Helmet>
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
          integrity='sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=='
          crossorigin=''
        />
        <script
          src='https://unpkg.com/leaflet@1.8.0/dist/leaflet.js'
          integrity='sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=='
          crossorigin=''
        ></script>
      </Helmet>
      <Sidebar />
      {/* <Navbar /> */}
      <div className='relative md:ml-64 bg-blueGray-100'>
        <div className='flex justify-center items-center h-screen bg-gray-600'>
          <div className='w-full max-w-3xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
