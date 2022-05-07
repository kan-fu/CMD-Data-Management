import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Fields from './components/Fields'
import Field from './components/Field'
import Survey from './components/Survey'
import Summary from './components/Summary'
import Map from './components/Map'
import '@fortawesome/fontawesome-free/css/all.min.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='/' element={<Summary />} />
        <Route path='fields' element={<Fields />} />
        <Route path='field/:fieldId' element={<Field />} />
        <Route path='survey/:surveyId' element={<Survey />} />
        <Route path='map' element={<Map />} />
        {/* <Route index element={<Home />} />
        <Route path='teams' element={<Teams />}>
          <Route path=':teamId' element={<Team />} />
          <Route path='new' element={<NewTeamForm />} />
          <Route index element={<LeagueStandings />} /> */}
        {/* </Route> */}
      </Route>
    </Routes>
  </BrowserRouter>
)
