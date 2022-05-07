import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BACKEND_URL } from '../constants'
import { Link } from 'react-router-dom'

const Table = ({ surveys, setSurveys }) => {
  const handleDelete = (url) => {
    fetch(url, { method: 'DELETE' }).then(() => {
      setSurveys(surveys.filter((survey) => survey.url !== url))
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
            Date
          </th>
          <th scope='col' className='px-6 py-3'>
            Type
          </th>
          <th scope='col' className='px-6 py-3'>
            Probe
          </th>
          <th scope='col' className='px-6 py-3'>
            Mode
          </th>
          <th scope='col' className='px-6 py-3'>
            Action
          </th>
        </tr>
      </thead>
      <tbody className=''>
        {surveys.map(({ name, date, measure_type, probe, mode, id, url }) => (
          <tr key={id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
            <td className='px-6 py-4 text-blue-400 hover:text-blue-600'>
              <Link to={`/survey/${id}`}>{name}</Link>
            </td>
            <td className='px-6 py-4'>{date}</td>
            <td className='px-6 py-4'>{measure_type}</td>
            <td className='px-6 py-4'>{probe}</td>
            <td className='px-6 py-4'>{mode}</td>
            <td className='px-6 py-4'>
              <button
                className='disabled:opacity-30'
                type='button'
                onClick={() => handleDelete(url)}
              >
                <i className='fa-solid fa-trash-can'></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Field = () => {
  let params = useParams()
  const fieldId = params.fieldId
  const [field, setField] = useState({})
  const [files, setFiles] = useState()
  const [date, setDate] = useState()
  const [editMode, setEditMode] = useState(false)
  const [renameText, setRenameText] = useState('')
  const [surveys, setSurveys] = useState([])

  useEffect(() => {
    const url = `${BACKEND_URL}/catalog/field/${fieldId}/`
    fetch(url)
      .then((res) => res.json())
      .then((data) => setField(data))
  }, [])

  useEffect(() => {
    if (field?.surveys?.length > 0) {
      const requests = field.surveys.map((surveyUrl) => fetch(surveyUrl))
      Promise.all(requests)
        .then((res) => Promise.all(res.map((r) => r.json())))
        .then((data) => setSurveys(data))
    }
  }, [field?.surveys])

  const handleRename = () => {
    const url = `${BACKEND_URL}/catalog/field/${fieldId}/`
    const body = { name: renameText }
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setField(data)
        setEditMode(false)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Provide file.dat and file.txt to the backend
    const url = `${BACKEND_URL}/catalog/survey/`
    const formData = new FormData()
    formData.append('field', field.url)
    formData.append('date', date)

    for (let file of files) {
      formData.append(`file_${file.name.slice(file.name.lastIndexOf('.') + 1)}`.toLowerCase(), file)
    }
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setSurveys([...surveys, data]))
  }

  if (!field) {
    return null
  }

  return (
    <div className='sm:rounded-lg '>
      <div className='flex justify-between items-center min-h-[4rem]'>
        {editMode ? (
          <>
            <input
              className='shadow  text-gray-700 border border-gray-400 
          focus:outline-none focus:border-gray-800 rounded py-2 px-4 w-1/3'
              type='text'
              value={renameText}
              onChange={(e) => setRenameText(e.target.value)}
            />
            <div className=''>
              <button type='button' onClick={handleRename}>
                <i className='fa-solid fa-check fa-lg px-2 text-green-500' />
              </button>
              <button type='button' onClick={() => setEditMode(false)}>
                <i className='fa-solid fa-xmark fa-lg text-red-500' />
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className='inline text-lg'>{field.name} </h1>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 my-2 py-2 px-4 rounded 
          focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
              type='button'
              onClick={() => {
                setEditMode(true)
                setRenameText(field.name)
              }}
            >
              Rename
            </button>
          </>
        )}
      </div>

      <form>
        <div className='flex justify-between items-center'>
          <input
            className='shadow  text-gray-700 border border-gray-400 
          focus:outline-none focus:border-gray-800  rounded py-2 px-4 w-1/3'
            type='file'
            multiple
            required
            accept='.dat,.txt'
            onChange={(e) => setFiles(e.target.files)}
          ></input>
          <input
            className='shadow  text-gray-700 border border-gray-400 
          focus:outline-none focus:border-gray-800  rounded py-2 px-4 w-1/3'
            type='date'
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold mr-4 my-2 py-2 px-4 rounded 
          focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed'
          type='button'
          disabled={!files || !date}
          onClick={handleSubmit}
        >
          Add new survey
        </button>
      </form>
      <div className='overflow-auto max-h-96'>
        <Table surveys={surveys} setSurveys={setSurveys} />
      </div>
    </div>
  )
}

export default Field
