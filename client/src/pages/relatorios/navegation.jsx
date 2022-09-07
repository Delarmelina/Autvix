import React from 'react'

import "./style.css"
import * as Icon from 'react-icons/fa'

import { NavCard } from "../../components/components/navCard"

export const Navegation = () => {

  return (
    <ul className="body-cards">
        <NavCard name="RH" link="/relatorios/RH"/>
        <NavCard name="RDV" link="/relatorios/RDV"/>
        <NavCard name="SGQ" link="/relatorios/SGQ"/>
        <NavCard name="Carros" link="/relatorios/Carros"/>
        <NavCard name="Denuncias" link="/relatorios/Denuncias"/>
        <NavCard name="Elogios" link="/relatorios/Elogios"/>
        <NavCard name="Report Bugs" link="/relatorios/ReportBugs"/>
    </ul>
  )
}