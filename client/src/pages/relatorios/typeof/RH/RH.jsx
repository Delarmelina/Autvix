import React from 'react'

import "../../style.css"

import { GetCode, NewRowOnTable } from '../../../../services/methods/SQLRequisit.js'
import { ModalButton } from '../../../../components/components/modalButton'
import { GenTable } from '../../../../components/components/genTable'
import { Container100 } from '../../../../components/components/container100'

export const RH = () => {

    const [folgaPerm, setFolgaPerm] = React.useState([])
    const [RHs, setRHs] = React.useState([])
    const [preench, setPreench] = React.useState({
        matricula: "",
        email: "",
        data: "",
        trabalhou: 0,
        autorizacao: 0,
        id_ativ: 0,
        just: "",
        obs: ""
    })
    const [atividades, setAtividades] = React.useState([{
        id_ativ: 0,
        id_cc: "",
        os: 0,
        tipo_aten: 0,
        tipo_ativ: 0,
        hora_inicio: "",
        hora_final: "",
        descricao: "",
        arq: "",
        desvio: 0,
        mot_desv: "",
        loc_desv: "",
        tmp_desv: "",
        aut_desv: ""
    }])

    React.useEffect(() => {
        preench.trabalhou === '1' ? setPreench({ ...preench, autorizacao: 0, just: "" }) :
            preench.trabalhou === '2' ? setPreench({ ...preench, id_ativ: 0, just: "" }) :
                preench.trabalhou === '3' ? setPreench({ ...preench, id_ativ: 0, autorizacao: 0 }) :
                    console.log("");
    }, [preench.trabalhou])

    React.useEffect(() => {
        GetCode("select u.matricula, nome from perm_users p join Usuarios u on u.matricula = p.matricula where id_tipo = 'AUT'")
            .then(data => {
                setFolgaPerm(data.map(user => {

                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })
    }, [])

    React.useEffect(() => {
        let userLog = localStorage.getItem('9S94R10');
        GetCode(`select matricula, email from usuarios where matricula = ${userLog}`)
            .then((user) => {
                setPreench({ ...preench, email: user[0].email, matricula: user[0].matricula });
            })
    }, [])

    React.useEffect(() => {

        let SQLCode = "select u.email, p.data, trabalhou, obs, a.nome as aut, id_ativ from preench_rh p "
        SQLCode += "join usuarios u "
        SQLCode += "on u.matricula = p.matricula "
        SQLCode += "join usuarios a "
        SQLCode += "on p.autorizacao = a.matricula"

        GetCode(SQLCode)
            .then(data => {
                setRHs(data.map((RH, index) => {

                    let date = RH.data.slice(0, 10).split('-')

                    return (
                        <tr key={index}>
                            <td>{RH.email}</td>
                            <td>{date[2]}/{date[1]}/{date[0]}</td>
                            <td>{RH.trabalhou == 1 ? "Sim" : RH.trabalhou == 2 ? "Atestado" : "Folga"}</td>
                            <td>{RH.obs}</td>
                            <td>{RH.trabalhou === 3 ? RH.aut : ""}</td>
                            <td>{RH.id_ativ}</td>
                        </tr>
                    )
                }))
            })
    }, [])

    async function SendDatatoDB() {
        let UltAtiv = await GetCode('select MAX(id_ativ) as ativ from preench_rh')

        let preenchSend = preench
        delete preenchSend.email
        preenchSend.id_ativ = UltAtiv[0].ativ + 1

        await NewRowOnTable('preench_rh', preenchSend)
    }

    // React.useEffect(() => {
    //     const newList = atividades.concat({
    //         id_ativ: 0,
    //         id_cc: "",
    //         os: 0,
    //         tipo_aten: 0,
    //         tipo_ativ: 0,
    //         hora_inicio: "",
    //         hora_final: "",
    //         descricao: "",
    //         arq: "",
    //         desvio: 0,
    //         mot_desv: "",
    //         loc_desv: "",
    //         tmp_desv: "",
    //         aut_desv: ""
    //     })

    //     setAtividades(newList)

    //     console.log(atividades)
    // }, [preench.trabalhou])

    return (
        <>
            <div className="d-flex flex justify-content-end bg-dark p-1">
                <button type="button" className="btn btn-secondary mx-2" disabled>Meus RHs</button>
                <button type="button" className="btn btn-secondary mx-2" disabled>Todos RHs</button>
                <button type="button" className="btn btn-secondary mx-2" disabled>Resumo</button>
                <ModalButton ButtonColor='success' ModalName='PreenchRH' ButtonTitle='Responder' ModalTitle='Preencher Novo Relatório' func={SendDatatoDB} ConfirmTitle='Responder'>
                    <form>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Email</label>
                            <input type="text" className="form-control" placeholder="Email" value={preench.email} onChange={e => { setPreench({ ...preench, email: e.target.value }) }} />
                        </div>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Data de preenchimento</label>
                            <input type="date" className="form-control" placeholder="Data" value={preench.data} onChange={e => { setPreench({ ...preench, data: e.target.value }) }} />
                        </div>
                        <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Trabalhou nesta data?</label>
                        <select className="in-sel form-select" defaultValue="0" onChange={e => { setPreench({ ...preench, trabalhou: e.target.value }) }}>
                            <option value="0" disabled>Trabalhou nesta data?</option>
                            <option value="1">Sim</option>
                            <option value="2">Atestado Médico</option>
                            <option value="3">Folga</option>
                        </select>
                        {
                            preench.trabalhou === "1" ?
                                <div className="input-group-sm mb-3 in-gp">
                                    <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Atividades</label>

                                    <Container100>
                                        <table>
                                            <thead style={{ fontSize: "0.8em", backgroundColor: "#AAA" }}>
                                                <tr>
                                                    <th className='p-1'>Centro de Custo</th>
                                                    <th>Hora Inicial</th>
                                                    <th>Hora Final</th>
                                                    <th>Deletar</th>
                                                    <th>Editar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    atividades.map((ativ, key) => {
                                                        return (
                                                            <tr key={key}>
                                                                <td>{ativ.id_cc}</td>
                                                                <td>{ativ.hora_inicio}</td>
                                                                <td>{ativ.hora_final}</td>
                                                                <td>DEL</td>
                                                                <td>ED</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                        <button type="button" class="btn btn-primary">Add Atividade</button>
                                    </Container100>

                                </div>
                                : preench.trabalhou === "2" ?
                                    <div className="input-group-sm mb-3 in-gp">
                                        <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Atestado Médico</label>
                                        <input type="text" className="form-control" placeholder="Atestado" value={preench.just} onChange={e => { setPreench({ ...preench, just: e.target.value }) }} />
                                    </div>
                                    : preench.trabalhou === "3" ?
                                        <select className="in-sel form-select" defaultValue="0" onChange={e => { setPreench({ ...preench, autorizacao: e.target.value }) }}>
                                            <option value="0" disabled>Autorização da folga</option>
                                            {folgaPerm}
                                        </select>
                                        : <></>
                        }
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Observações</label>
                            <input type="text" className="form-control" placeholder="Observações" value={preench.obs} onChange={e => { setPreench({ ...preench, obs: e.target.value }) }} />
                        </div>
                    </form>
                </ModalButton>
            </div>

            <Container100>
                <GenTable ColNumber='10' Color='light' HeaderColor='dark' ColumsName={['Email', 'Data', 'Trabalhou', 'Obs', 'Aut. Folga', 'Atividades']}>
                    {RHs}
                </GenTable>

                <div className="col-md-2 bg-danger">
                    <div className="row">
                        <h1>Filtros e opções</h1>
                    </div>
                </div>
            </Container100>
        </>
    )
}