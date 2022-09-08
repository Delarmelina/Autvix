import React from 'react'
import { Routes, Route } from "react-router-dom";

import "./style.css"
import * as Icon from 'react-icons/fa'

import { Navegation } from "./navegation"
import { MeusRHs } from './typeof/RH/MeusRHs';
import { RH } from './typeof/RH/RH';

export const Relatorios = () => {

  return (
    <Routes>
      <Route path="/" element={<Navegation />} />
      <Route path="/RH" element={<RH />} />
      <Route path="/RH/MeusRHs" element={<MeusRHs />} />
      <Route path="*" element={<div className='d-flex bg-secondary text-warning align-items-center justify-content-center' style={{ fontSize: "25px", height: "100%" }}>
        <Icon.FaExclamationCircle className='mx-4 text-warning' />
        <span>Page not found !!!</span>
      </div>} />
    </Routes>
  )
}