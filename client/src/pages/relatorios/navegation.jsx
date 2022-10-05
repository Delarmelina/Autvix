import React from 'react'

import "./style.css"

import { NavCard } from "../../components/components/navCard"

export const Navegation = () => {

  return (
    <ul className="body-cards">
      <NavCard name="RH" link="/relatorios/RH"
        color="info" />
      <NavCard name="Torta" link="/relatorios/Torta"
        color="info" />
      <NavCard name="SGQ" link="/relatorios/SGQ"
        color="secondary" />
      <NavCard name="Carros" link="/relatorios/Carros"
        color="secondary" />
      <NavCard name="Denuncias" link="/relatorios/Denuncias"
        color="secondary" />
      <NavCard name="Elogios" link="/relatorios/Elogios"
        color="secondary" />
      <NavCard name="Report Bugs" link="/relatorios/ReportBugs"
        color="secondary" />
      <NavCard name="RDV" link="/relatorios/RDV"
        color="secondary" />
    </ul>
  )
}