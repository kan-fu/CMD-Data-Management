import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BACKEND_URL } from '../constants'

const Tabs = ({ color, survey }) => {
  // Two cases: either survey.image is not null, or survey.image[1-5] are not null
  const [openTab, setOpenTab] = React.useState(0)
  const images = survey.image
    ? [{ url: survey.image, tabName: 'Cond' }]
    : [
        { url: survey.image1, tabName: 'Cond1' },
        { url: survey.image2, tabName: 'Cond2' },
        { url: survey.image3, tabName: 'Cond3' },
        { url: survey.image4, tabName: 'InvCond1' },
        { url: survey.image5, tabName: 'InvCond2' },
      ]
  return (
    <>
      <div className='flex flex-wrap'>
        <div className='w-full'>
          <ul className='flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row' role='tablist'>
            {images.map(({ tabName }, index) => (
              <li key={index} className='-mb-px mr-2 last:mr-0 flex-auto text-center'>
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === index
                      ? 'text-white bg-' + color + '-600'
                      : 'text-' + color + '-600 bg-white')
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenTab(index)
                  }}
                  data-toggle='tab'
                  href={`#link-${index}`}
                  role='tablist'
                >
                  {tabName}
                </a>
              </li>
            ))}
          </ul>
          <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
            <div className='px-4 py-5 flex-auto'>
              <div className='tab-content tab-space'>
                {images.map(({ url: imageUrl }, index) => (
                  <div
                    className={openTab === index ? 'block' : 'hidden'}
                    key={index}
                    id={`link-${index}`}
                  >
                    <img className='object-cover w-[70%]' src={imageUrl} alt='contour plot' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const Survey = () => {
  let params = useParams()
  const surveyId = params.surveyId
  const [survey, setSurvey] = useState({})

  useEffect(() => {
    fetch(`${BACKEND_URL}/catalog/survey/${surveyId}/`)
      .then((res) => res.json())
      .then((data) => setSurvey(data))
  }, [])

  return (
    <div className='sm:rounded-lg '>
      <h1 className='text-2xl font-bold'>{survey.name}</h1>
      <Tabs color='gray' survey={survey} />
    </div>
  )
}

export default Survey
