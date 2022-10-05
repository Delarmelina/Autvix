import React from 'react'

import "../../style.css"
import * as Icon from 'react-icons/fa'

import { GetCode, NewRowOnTable } from '../../../../services/methods/SQLRequisit.js'
import { ModalButton } from '../../../../components/components/modalButton'
import { GenTable } from '../../../../components/components/genTable'
import { Container100 } from '../../../../components/components/container100'

export const Torta = () => {

    const [tortas, setTortas] = React.useState([])
    const [Preench, setPreench] = React.useState({
        matricula: "",
        data: ""
    })
    const [nomes, setNomes] = React.useState([])      // Lista de projetos em andamento
    const [reload, setReload] = React.useState(false)

    React.useEffect(() => {
        let SQLCode = "select u.nome, COUNT(u.nome) as Tortas from devTorta t join Usuarios u on t.matricula = u.matricula group by u.nome"
        GetCode(SQLCode)
            .then(data => {
                setTortas(data.map(function (RH, index) {

                    return (
                        <tr key={index}>
                            <td>{RH.nome}</td>
                            <td>{RH.Tortas}</td>
                            <td><button className='btn btn-danger' onClick={() => PagarTorta(RH.nome)}>Pagar</button></td>
                        </tr>
                    )
                }))
            })

        GetCode("select * from usuarios where matricula > 0")
            .then(data => {
                setNomes(data.map(user => {
                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })
    }, [reload])

    async function SendDatatoDB(){
        await NewRowOnTable("DevTorta", Preench)
        setReload(!reload)
    }

    async function PagarTorta(nome) {
        // let matricula = await GetCode(`select matricula from Usuarios where nome = ${nome}`)
        // await GetCode(`delete from DevTorta where matricula = ${matricula}`)
        // setReload(!reload)
    }

    return (
        <>
            <div className="d-flex flex justify-content-between bg-dark p-1">
                <div className='mx-2 d-flex'>
                    {/* <span className='text-white'>Lista de Torta</span> */}
                </div>
                <div>
                    <button type="button" className="btn btn-warning mx-2" onClick={() => setReload(!reload)}><Icon.FaRedoAlt /></button>
                    <ModalButton ButtonColor='success' ModalName='NewPie' ButtonTitle='Adicionar' ModalTitle='Adicionar Torta' func={SendDatatoDB} ConfirmTitle='Adicionar'>
                        <form>
                            <div className="input-group-sm mb-3 in-gp">
                                <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Funcionário</label>
                                <select className='in-sel form-select' value={Preench.nome} onChange={e => { setPreench({ ...Preench, matricula: e.target.value }) }}>
                                    <option value={""}>Todos</option>
                                    {nomes}
                                </select>
                            </div>
                            <div className="input-group-sm mb-3 in-gp">
                                <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data</label>
                                <input type="date" className="form-control" placeholder="Data" value={Preench.data} onChange={e => { setPreench({ ...Preench, data: e.target.value }) }} />
                            </div>
                        </form>
                    </ModalButton>
                </div>
            </div>

            <Container100>
                <GenTable ColNumber='3' Color='light' HeaderColor='dark' ColumsName={['Nome', 'Tortas', 'Pagar']}>
                    {tortas}
                </GenTable>
            </Container100>
        </>
    )
}