import React from 'react'
import { useParams } from 'react-router-dom'

import { GetCode } from '../../../../services/methods/SQLRequisit.js'
import { Container100 } from '../../../../components/components/container100'

import "../../style.css"

export const RHDetails = (props) => {

  const { id_ativ } = useParams()
  const [Preench, setPreench] = React.useState()

  React.useEffect(() => {
    async function obterDados() {
      const request = await GetCode(`select u.nome, p.matricula, u.email, data, trabalhou, u2.nome as aut, just, obs, id_ativ from Preench_Rh p join usuarios u on p.matricula = u.matricula join usuarios u2 on u2.matricula = p.autorizacao where id_ativ = ${id_ativ}`)

      const reqativ = await GetCode(`select id_cc, os, ativ, atend, hora_inicio, hora_final, descricao, arq, desvio from Atividades a join Preench_RH p on a.id_ativ = p.id_ativ join Tipo_atend t1 on t1.tipo_atend = a.tipo_atend join Tipo_ativ t2 on t2.tipo_ativ = a.tipo_ativ where a.id_ativ = ${id_ativ}`)
      let date = request[0].data.slice(0, 10).split('-')

      setPreench(
        <>
          <Container100>
            <div className="col-md-12 bg-dark">
              
              <a className='p-0' href={`/relatorios/RH/`}><button className='btn button btn-info m-1'>Voltar</button></a>
            </div>
          </Container100>
          <Container100>
            <div className="col-md-6 bg-secondary text-center text-white">
              <div className="row my-4">
                <h4>{request[0].nome} - {request[0].matricula}</h4>
                <h4>Data de Preenchimento: {date[2]}/{date[1]}/{date[0]}</h4>
                <h4>Trabalhou nesta data? {request[0].trabalhou == 1 ? "Sim" : request[0].trabalhou == 2 ? "Atestado Médico" : "Folga"}</h4>
              </div>
            </div>

            <div className="col-md-6 bg-secondary text-white">
              <div className="row my-4">
                {request[0].trabalhou === 3 ? <h4>Autorização da folga: {request[0].aut}</h4> : <></>}
                {request[0].trabalhou === 1 ? <></> : <h4>Justificativa: {request[0].just}</h4>}
                <h4 h4 > Observações: {request[0].obs}</h4 >
              </div>
            </div>


            <h2 className='border border-dark border-1 bg-info text-center text-black m-0'>Atividades</h2>

            {
              reqativ.map((data, index) => {

                let hi = data.hora_inicio.substr(data.hora_inicio.indexOf("T") + 1, 5).split(":")
                let hf = data.hora_final.substr(data.hora_final.indexOf("T") + 1, 5).split(":")

                return <div key={index} className='border border-dark border-1 mt-1'  style={{ backgroundColor: '#CCC' }}>
                  <Container100> 
                    <div className="col-md-4">
                      <div className="row my-1">
                        <h4><strong>{data.id_cc} {data.os > 0 ? `- OS${data.os}` : ""}</strong></h4>
                        <h4>Horário: {hi[0]}:{hi[1]} as {hf[0]}:{hf[1]}</h4>
                        <h4>Atendimento {data.atend}</h4>
                        <h4>Atividade: {data.ativ}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row my-1">
                        <h4><strong>Descrição: </strong>{data.descricao}</h4>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="row my-1 text-center">
                        <h4>{data.desvio == 0 ? "Não possui Desvios" : "Atividade com Desvio"}</h4>
                        <h4>{data.arq}</h4>
                      </div>
                    </div>
                  </Container100>
                </div>
              })
            }
          </Container100>
        </>)
    }

    obterDados()
  }, [])

  return (
    <div>
      <h1>{Preench}</h1>
    </div>
  )
}