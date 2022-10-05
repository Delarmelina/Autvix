import React from 'react'

import "../../style.css"
import * as Icon from 'react-icons/fa'

import { GetCode, NewRowOnTable, GetTable } from '../../../../services/methods/SQLRequisit.js'
import { VerifyTag } from '../../../../services/methods/usermethods.js'
import { ModalButton } from '../../../../components/components/modalButton'
import { GenTable } from '../../../../components/components/genTable'
import { Container100 } from '../../../../components/components/container100'

import * as Excel from "exceljs";
import * as FileSaver from 'file-saver';

export const RH = () => {

    // Variáveis de renderização
    const [Ativ, setAtivs] = React.useState([])             // Renderização em tela da variavel "atividades"
    const [RHs, setRHs] = React.useState([])                // Lista dos RHs preenchidos
    const [listPag, setListPag] = React.useState([])        // Lista da paginação

    // Variáveis de lista com informações
    const [folgaPerm, setFolgaPerm] = React.useState([])    // Funcionário com permissão de autorizar folgas/desvios
    const [projetos, setProjetos] = React.useState([])      // Lista de projetos em andamento
    const [emails, setEmails] = React.useState([])      // Lista de projetos em andamento
    const [tiposAtend, setTiposAtend] = React.useState([])  // Lista para ser colocado os tipos de atendimentos
    const [tiposAtiv, setTiposAtiv] = React.useState([])    // Lista para ser colocado os tipos de atividades
    const [listaOS, setListaOS] = React.useState([])        // Lista de OS's para serem colocadas nas atividades

    // Variáveis de funcionamento da lógica
    const [qtAtiv, setQtAtiv] = React.useState(false)       // Varialvel auxiliar que é alterada para a tabela recarregar
    const [atividades, setAtividades] = React.useState([])  // Armazena em object as atividades sendo preenchidas
    const [refresh, setRefresh] = React.useState(false)     // Variavel para recarregar a tabela de RH
    const [qPag, setQpag] = React.useState(15)               // Quantidade de linhas por pagina disponíveis
    const [pagination, setPagination] = React.useState(0)   // Pagina atual da tabela de RH
    const [RHPerm, setRHPerm] = React.useState(false)       // Verifica autorização de usuario para a planilha RH
    const [filtros, setFiltros] = React.useState({          // Funcionamento dos Filtros
        email: "",
        datai: "",
        dataf: "",
        trabalhou: ""
    })
    const [preench, setPreench] = React.useState({          // Função que armazena o preenchimento do novo RH
        matricula: "",
        email: "",
        data: "",
        trabalhou: 0,
        autorizacao: 0,
        id_ativ: 0,
        just: "",
        obs: ""
    })

    // Função que renderiza as opções e dados que necessitam ser renderizados apenas no primeiro momento
    // Tal como: "Preenchimento das opções disponiveis na seleção, obtenção da matricula do usuario logado"
    React.useEffect(() => {

        VerifyTag(['RH']).then(data => {
            data > 0 ? setRHPerm(true) : setRHPerm(false)
        })

        GetCode("select u.matricula, nome from perm_users p join Usuarios u on u.matricula = p.matricula where id_tipo = 'AUT'")
            .then(data => {
                setFolgaPerm(data.map(user => {

                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })

        GetTable("projetos")
            .then(data => {
                setProjetos(data.map(projeto => {
                    return (
                        <option key={projeto.id_cc} value={projeto.id_cc}>{projeto.id_cc}</option>
                    )
                }))
            })

        GetCode("select * from usuarios where matricula > 0")
            .then(data => {
                setEmails(data.map(user => {
                    return (
                        <option key={user.matricula} value={user.matricula}>{user.nome}</option>
                    )
                }))
            })

        let userLog = localStorage.getItem('9S94R10');
        GetCode(`select matricula, email, nome from usuarios where matricula = ${userLog}`)
            .then((user) => {
                setPreench({ ...preench, email: user[0].email, matricula: user[0].matricula });
                setFiltros({ ...filtros, email: user[0].matricula })
            })

        GetTable("tipo_atend").then((data) => {
            setTiposAtend(data.map(tipos => {
                return (
                    <option key={tipos.tipo_atend} value={tipos.tipo_atend}>{tipos.tipo_atend}. {tipos.atend}</option>
                )
            }))
        })

        GetTable("tipo_ativ").then((data) => {
            setTiposAtiv(data.map(tipos => {
                return (
                    <option key={tipos.tipo_ativ} value={tipos.tipo_ativ}>{tipos.tipo_ativ}. {tipos.ativ}</option>
                )
            }))
        })

        let TempListaOs = Array.from({ length: 99 }, (_, i) => i + 1)
        setListaOS(TempListaOs.map(os => {
            return (
                <option key={os} value={os}>{os}</option>
            )
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Função que controla os campos do formulario de preenchimento para casa o funcionario tenha ou não trabalhado
    React.useEffect(() => {
        preench.trabalhou === '1' ? setPreench({ ...preench, autorizacao: 0, just: "" }) :
            preench.trabalhou === '2' ? setPreench({ ...preench, id_ativ: 0, just: "" }) :
                preench.trabalhou === '3' ? setPreench({ ...preench, id_ativ: 0, autorizacao: 0 }) : localStorage.getItem("token");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preench.trabalhou])

    // Função que renderiza a tabela de RH preenchidos
    React.useEffect(() => {

        let AuxCode = 0
        let SQLCode = "select u.email, p.data, trabalhou, obs, a.nome as aut, id_ativ, u.matricula from preench_rh p "
        SQLCode += "join usuarios u "
        SQLCode += "on u.matricula = p.matricula "
        SQLCode += "join usuarios a "
        SQLCode += "on p.autorizacao = a.matricula "

        if (filtros.trabalhou > 0) {
            SQLCode += `where trabalhou = ${filtros.trabalhou} `
            AuxCode = 1
        }

        if (filtros.email > 0 && AuxCode === 0) {
            SQLCode += `where u.matricula = '${filtros.email}' `
            AuxCode = 1
        } else if (filtros.email > 0 && AuxCode === 1) {
            SQLCode += `and u.matricula = '${filtros.email}' `
        }

        if (filtros.datai !== '' && AuxCode === 0) {
            SQLCode += `where p.data > '${filtros.datai}' `
            AuxCode = 1
        } else if (filtros.datai !== '' && AuxCode === 1) {
            SQLCode += `and p.data > '${filtros.datai}' `
        }

        if (filtros.dataf !== '' && AuxCode === 0) {
            SQLCode += `where p.data < '${filtros.dataf}' `
            AuxCode = 1
        } else if (filtros.dataf !== '' && AuxCode === 1) {
            SQLCode += `and p.data < '${filtros.dataf}' `
        }

        GetCode(SQLCode.replace('u.email, p.data, trabalhou, obs, a.nome as aut, id_ativ, u.matricula', 'count(*) as page'))
            .then(data => {
                let npages = Math.ceil(data[0].page / qPag)
                let arr = []

                for (var i = 0; i < npages; i++) { arr.push(i) }

                setListPag(arr.map(i => {
                    return <li key={i} className="page-item active" aria-current="page">
                        <a className="page-link" href="#top" onClick={e => setPagination(i)}>{i + 1}</a>
                    </li>
                }))

            })

        SQLCode += `ORDER BY data desc offset ${pagination * qPag} rows fetch next ${qPag} rows only`

        GetCode(SQLCode)
            .then(data => {
                setRHs(data.map(function (RH, index) {

                    let date = RH.data.slice(0, 10).split('-')

                    return (
                        <tr key={index}>
                            <td>{RH.email}</td>
                            <td>{date[2]}/{date[1]}/{date[0]}</td>
                            <td>{RH.trabalhou === 1 ? "Sim" : RH.trabalhou === 2 ? "Atestado" : "Folga"}</td>
                            <td>{RH.obs}</td>
                            <td>{RH.trabalhou === 3 ? RH.aut : ""}</td>
                            <td><a className='p-0' href={`/relatorios/RH/${RH.id_ativ}`}><button className='btn btn-info p-0' style={{ width: "60px" }}>+</button></a></td>
                        </tr>
                    )
                }))
            })

    }, [refresh, filtros, pagination, qPag])

    // Função que renderiza a tabela de atividades dentro do Modal de preencher novo relatório
    React.useEffect(() => {
        setAtivs(atividades.map((ativ, i) => {

            return (
                <tr className='listaAtividades' style={{ fontSize: '0.7em' }} key={i}>
                    <td style={{ minWidth: '125px' }}>
                        <select className='input-ativ' value={ativ.id_cc} onChange={e => {
                            let tempAtiv = atividades
                            tempAtiv[i].id_cc = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }}>
                            <option value={""} disabled>Projeto</option>
                            {projetos}
                        </select>
                    </td>

                    <td style={{ minWidth: "55px" }}>
                        <select className='input-ativ' value={ativ.os} onChange={e => {
                            let tempAtiv = atividades
                            tempAtiv[i].os = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }}>
                            <option value={0} disabled>NA</option>
                            {
                                listaOS
                            }
                        </select>
                    </td>

                    <td style={{}}>
                        <select className='input-ativ' value={ativ.tipo_atend} onChange={e => {
                            let tempAtiv = atividades
                            console.log(i, ativ.tipo_atend)
                            tempAtiv[i].tipo_atend = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }}>
                            <option value={""} disabled>Tipo Atend</option>
                            {tiposAtend}
                        </select>
                    </td>

                    <td style={{}}>
                        <select className='input-ativ' value={ativ.tipo_ativ} onChange={e => {
                            let tempAtiv = atividades
                            tempAtiv[i].tipo_ativ = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }}>
                            <option value={""} disabled>Tipo Ativ</option>
                            {tiposAtiv}
                        </select>
                    </td>

                    <td><input type="time" className="input-ativ text-center" value={ativ.hora_inicio} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].hora_inicio = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>

                    <td><input type="time" className="input-ativ text-center" value={ativ.hora_final} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].hora_final = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>

                    <td style={{ minWidth: '300px' }}><textarea type="text" className="input-ativ" value={ativ.descricao} onChange={e => {
                        let tempAtiv = atividades
                        tempAtiv[i].descricao = e.target.value
                        setAtividades(tempAtiv)
                        setQtAtiv(!qtAtiv)
                    }} /></td>

                    <td style={{ maxWidth: '50px' }}>
                        <input type="checkbox" className="checktype input-ativ" value={ativ.desvio} onChange={e => {
                            let tempAtiv = atividades
                            tempAtiv[i].desvio = e.target.value
                            setAtividades(tempAtiv)
                            setQtAtiv(!qtAtiv)
                        }} />
                    </td>

                    <td><button type="button" className='p-0 btn' onClick={() => removeAtividade(i)}><Icon.FaTrash style={{ color: 'red' }} /></button></td>
                </tr>
            )
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qtAtiv])

    // Função usada para controlar o botão que insere nova atividade no RH
    function addNovaAtividade() {
        const newAtiv = atividades.concat({
            id_ativ: 0,
            id_cc: "",
            os: 0,
            tipo_atend: 1,
            tipo_ativ: 1,
            hora_inicio: "",
            hora_final: "",
            descricao: "",
            arq: "",
            desvio: 0,
            mot_desv: "",
            loc_desv: "",
            tmp_desv: "",
            aut_desv: ""
        })
        console.log(atividades)
        setAtividades(newAtiv)
        setQtAtiv(!qtAtiv)
    }

    // Função usada para remover atividade da lista do novo preenchimento de RH
    function removeAtividade(ativ) {
        const newAtiv = atividades
        newAtiv.splice(ativ, 1)
        setAtividades(newAtiv)
        setQtAtiv(!qtAtiv)
    }

    // Função que faz o envio dos dados de preenchimento de novo RH para o banco de dados
    async function SendDatatoDB() {
        let UltAtiv = await GetCode('select MAX(id_ativ) as ativ from preench_rh')

        let preenchSend = preench
        delete preenchSend.email
        preenchSend.id_ativ = UltAtiv[0].ativ + 1

        await NewRowOnTable('preench_rh', preenchSend)

        let SendAtiv = atividades

        SendAtiv.map(async atividade => {
            atividade.id_ativ = preenchSend.id_ativ
            await NewRowOnTable('atividades', atividade)
        })
        setRefresh(!refresh)
    }

    async function gerarPDF() {

        let pathName = "Levantamento -"
        let SQLCode = "select id_cc, SUM(DATEDIFF(hour, hora_inicio, hora_final)) as diff from Preench_Rh p join Atividades a on p.id_ativ = a.id_ativ "

        if (filtros.dataf === "" && filtros.datai !== "") {
            SQLCode += `where data > '${filtros.datai}' `
            pathName += ` de ${filtros.datai}.xlsx`
        } else if (filtros.dataf !== "" && filtros.datai === "") {
            SQLCode += `where data < '${filtros.dataf}' `
            pathName += ` até ${filtros.dataf}.xlsx`
        } else if (filtros.dataf !== "" && filtros.datai !== "") {
            SQLCode += `where data > '${filtros.datai}' and data < '${filtros.dataf}' `
            pathName += ` de ${filtros.datai} até ${filtros.dataf}.xlsx`
        } else {
            pathName += ` geral.xlsx`
        }

        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet("Levantamento");

        worksheet.columns = [
            { header: 'Centro de Custo', key: 'id_cc', width: 20 },
            { header: 'Horas', key: 'diff', width: 10 }
        ];

        SQLCode += "group by id_cc"
        console.log(SQLCode)
        let res = await GetCode(SQLCode)

        res.map(data => {
            worksheet.addRow({ id_cc: data.id_cc, diff: data.diff });
            return null
        })

        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: "application/json" });
            FileSaver.saveAs(blob, pathName);
        });
    }

    return (
        <>
            <div className="d-flex flex justify-content-between bg-dark p-1">
                <div className='mx-2 d-flex'>
                    <nav aria-label="...">
                        <ul className="pagination">
                            {listPag}
                        </ul>
                    </nav>
                </div>
                <div>
                    <button type="button" className="btn btn-info mx-2" onClick={() => { gerarPDF() }}><strong><Icon.FaFileDownload /></strong></button>
                    <button type="button" className="btn btn-warning mx-2" onClick={() => { setRefresh(!refresh) }}><Icon.FaRedoAlt /></button>
                    <ModalButton ButtonColor='success' ModalName='PreenchRH' ButtonTitle='Responder' ModalTitle='Preencher Novo Relatório' func={SendDatatoDB} ConfirmTitle='Responder'>
                        <form>
                            <div className="input-group-sm mb-3 in-gp">
                                <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Email</label>
                                <input type="text" className="form-control" disabled placeholder="Email" value={preench.email} onChange={e => { setPreench({ ...preench, email: e.target.value }) }} />
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
                                            <table className="text-center tabela-ativ">
                                                <thead style={{ fontSize: "0.8em", backgroundColor: "#777", color: "white" }}>
                                                    <tr>
                                                        <th className='p-1'>Centro de Custo</th>
                                                        <th>OS</th>
                                                        <th>Atendimento</th>
                                                        <th>Atividade</th>
                                                        <th>Horário Inicio</th>
                                                        <th>Horário Término</th>
                                                        <th>Descrição</th>
                                                        <th>Desvio</th>
                                                        <th><Icon.FaTrash style={{ color: 'red' }} /></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Ativ}
                                                </tbody>
                                            </table>
                                            <button type="button" className="btn btn-secondary" onClick={() => addNovaAtividade()}>Add Atividade</button>
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
            </div>

            <Container100>
                <GenTable ColNumber='10' Color='light' HeaderColor='dark' ColumsName={['Email', 'Data', 'Trabalhou', 'Obs', 'Aut. Folga', 'Detalhes']}>
                    {RHs}
                </GenTable>

                {/* LÓGICA DOS FILTROS */}
                <div className="col-md-2 bg-info">
                    <div className="row">
                        <h1 style={{ fontSize: "1.3em" }} className="p-2 bg-secondary text-white text-center">Filtros</h1>

                        {RHPerm === true ?
                            <div className="input-group-sm mb-3 in-gp">
                                <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Funcionário</label>
                                <select className='in-sel form-select' value={filtros.email} onChange={e => { setFiltros({ ...filtros, email: e.target.value }) }}>
                                    <option value={""}>Todos</option>
                                    {emails}
                                </select>
                            </div> : <></>
                        }
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>De</label>
                            <input type="date" className="form-control" value={filtros.datai} onChange={e => setFiltros({ ...filtros, datai: e.target.value })} />
                        </div>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Até</label>
                            <input type="date" className="form-control" value={filtros.dataf} onChange={e => setFiltros({ ...filtros, dataf: e.target.value })} />
                        </div>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Trabalhou</label>
                            <select className="in-sel form-select" defaultValue="0" onChange={e => { setFiltros({ ...filtros, trabalhou: e.target.value }) }}>
                                <option value="0">Trabalhou?</option>
                                <option value="1">Sim</option>
                                <option value="2">Atestado Médico</option>
                                <option value="3">Folga</option>
                            </select>
                        </div>
                        <div className="input-group-sm mb-3 in-gp">
                            <label className="form-label" style={{ backgroundColor: "#ccc#", fontSize: "0.8em" }}>Quantidade por Página</label>
                            <select className="in-sel form-select" value={qPag} onChange={e => setQpag(e.target.value)}>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="25">25</option>
                                <option value="1000">1000</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Container100>
        </>
    )
}