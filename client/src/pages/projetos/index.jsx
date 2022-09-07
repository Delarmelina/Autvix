import React from 'react'

import "./style.css"

import { GetCode } from '../../services/methods/SQLRequisit.js'

export const Projetos = () => {

  const [projetos, setProjetos] = React.useState([])

  React.useEffect(() => {
    GetCode('select * from projetos p inner join Cliente c on p.id_cliente = c.id_cliente')
    .then(data => {
      setProjetos(data.map(projeto => {

        return (
          <tr key={projeto.id_cc}>
            <td>{projeto.id_cc}</td>
            <td>{projeto.ano}</td>
            <td>{projeto.cliente}</td>
            <td>{projeto.descricao}</td>
          </tr>
        )
      }))
    })
  }, [])

  return (
    <div className=''>
      {/* Tabela de projetos */}
      <table className='table table-striped table-light table-hover text-center'>
        <thead className='table-dark'>
          <tr>
            <th>Centro de Custo</th>
            <th>Ano</th>
            <th>Cliente</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {/* Linhas da tabela */}
          {projetos}
        </tbody>
      </table>
    </div>
  )
}