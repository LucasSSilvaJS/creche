import './solicitacoes.css'

import Titulo from '../../components/Titulo'
import NavBar from '../../components/NavBar'
import Invite from '../../components/Invite';
import Loading from '../../components/Loading';

import { toast } from 'react-toastify';

import { useContext, useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';

function Solicitacoes() {
    const { user } = useContext(AuthContext)

    const [solicitacoes, setSolicitacoes] = useState([])

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    
    useEffect(() => {
        setLoading(true)

        const docRefGrupos = collection(db, 'grupos')
        const q = query(docRefGrupos, where('solicitacoes', 'array-contains', user.id))

        const unsubscribeGrupos = onSnapshot(q, (snapshotGrupos) => {
            const userIds = []
            const gruposComUsuario = []

            snapshotGrupos.docs.forEach(grupo => {
                userIds.push(grupo.data().userId)
                gruposComUsuario.push({
                    idGrupo: grupo.id,
                    grupo: grupo.data().grupo
                })
            })

            if (userIds.length > 0) {
                const docRefUsuarios = collection(db, 'usuarios')
                const q2 = query(docRefUsuarios, where('id', 'in', userIds))

                const unsubscribeUsuarios = onSnapshot(q2, (snapshotUsuarios) => {
                    snapshotUsuarios.docs.forEach(usuario => {
                        gruposComUsuario.forEach(grupo => {
                            if (grupo.userId === usuario.id) {
                                grupo.nome = usuario.data().nome
                                grupo.imageUrl = usuario.data().imageUrl
                            }
                        })
                    })
                    setSolicitacoes(gruposComUsuario)
                    setLoading(false)
                }, (error) => {
                    console.error('Erro ao obter dados dos participantes', error)
                    setLoading(false)
                })

                // Cleanup subscription on unmount
                return () => {
                    unsubscribeUsuarios()
                }
            } else {
                setSolicitacoes([])
                setLoading(false)
                toast.error('Nenhuma solicitação encontrada')
            }
        }, (error) => {
            toast.error('Erro ao encontrar solicitações')
            setLoading(false)
        })

        return () => {
            unsubscribeGrupos()
        }
    }, [user])

    async function accepted(idGrupo){
        const docRefGrupo = doc(db, 'grupos', idGrupo)
        await updateDoc(docRefGrupo, {
            solicitacoes: arrayRemove(user.id),
            participantes: arrayUnion(user.id)
        })
        .then(() => {
            toast.success('Convite aceitado com sucesso!')
            navigate('/pagina-inicial')
        })
        .catch(error => {
            toast.error("Não foi possível aceitar o convite!")
        })
    }

    async function denied(idGrupo){
        const docRefGrupo = doc(db, 'grupos', idGrupo)
        await updateDoc(docRefGrupo, {
            solicitacoes: arrayRemove(user.id)
        })
        .then(() => {
            toast.success('Convite rejeitado com sucesso!')
        })
        .catch(error => {
            toast.error("Não foi possível rejeitar o convite!")
        })
    }

    return ( 
        <div className="solicitacoes container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Solicitações</h1>
            </Titulo>

            {solicitacoes.map((solicitacao, index) => {
                return( 
                    <Invite 
                        key={index}
                        alt="convite" 
                        src={solicitacao.imageUrl}
                        group={solicitacao.grupo}
                        person={solicitacao.nome}
                        handleAccepted={() => accepted(solicitacao.idGrupo)}
                        handleDenied={() => denied(solicitacao.idGrupo)}
                    />
                )
            })}

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default Solicitacoes;