import React, { useEffect, useState } from 'react'
import { BACKEND_URL } from '../constants'
import { Link } from 'react-router-dom'
const Table = ({ fields, setFields }) => {
  const handleDelete = (url) => {
    fetch(url, { method: 'DELETE' }).then(() => {
      setFields(fields.filter((field) => field.url !== url))
    })
  }

  return (
    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400 '>
      <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
        <tr>
          <th scope='col' className='px-6 py-3'>
            Name
          </th>
          <th scope='col' className='px-6 py-3'>
            Coordinate
          </th>
          <th scope='col' className='px-6 py-3'>
            Surveys
          </th>
          <th scope='col' className='px-6 py-3'>
            Action
          </th>
        </tr>
      </thead>
      <tbody className=''>
        {fields.map(({ lat, lon, name, url, surveys, id }) => (
          <tr key={id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
            <td className='px-6 py-4 text-blue-400 hover:text-blue-600'>
              <Link to={`/field/${id}`}>{name}</Link>
            </td>
            <td className='px-6 py-4'>
              <Link to={`/map?lat=${lat}&lon=${lon}&name=${name}`}>{lat && `${lat.toFixed(3)}, ${lon.toFixed(3)}`}</Link>
            </td>
            <td className='px-6 py-4 text-center'>{surveys.length}</td>
            <td className='px-6 py-4'>
              <div className='flex justify-around'>
                <button
                  disabled={surveys.length !== 0}
                  className='disabled:opacity-30'
                  type='button'
                  onClick={() => handleDelete(url)}
                >
                  <i className='fa-solid fa-trash-can'></i>
                </button>
                <Link to={`/field/${id}`}>
                  <i className='fa-solid fa-arrow-up-right-from-square'></i>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
const Fields = () => {
  const [fields, setFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')
  useEffect(() => {
    fetch(`${BACKEND_URL}/catalog/field/`)
      .then((res) => res.json())
      .then((data) => {
        setFields(data)
      })
  }, [])

  const handleClick = () => {
    fetch(`${BACKEND_URL}/catalog/field/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ name: newFieldName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setFields([...fields, data])
        setNewFieldName('')
      })
      .catch((err) => console.log(err))
  }

  return (
    <div className='sm:rounded-lg '>
      <form className='p-4 '>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 my-2 py-2 px-4 rounded 
          focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
          type='button'
          disabled={newFieldName === ''}
          onClick={handleClick}
        >
          Add new field
        </button>
        <input
          className='shadow  text-gray-700 border border-gray-400 
          focus:outline-none focus:border-gray-800  rounded py-2 px-4 mb-3 w-1/2'
          type='text'
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
        ></input>
      </form>
      <div className='overflow-auto max-h-96'>
        <Table fields={fields} setFields={setFields} />
      </div>
    </div>
  )
}

export default Fields
