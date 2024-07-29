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

function Solicitacoes() {
    const { user } = useContext(AuthContext)

    const [solicitacoes, setSolicitacoes] = useState([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let unSubGrupos = null
        let unSubUsuarios = null

        async function loadSolicitacoes() {
            setLoading(true)
            try {
                const docRefGrupos = collection(db, 'grupos')
                const q = query(docRefGrupos, where('solicitacoes', 'array-contains', user.id))

                const userIds = []

                unSubGrupos = onSnapshot(q, (grupos) => {
                    const arrayGrupo = []
                    grupos.docs.forEach(grupo => {
                        arrayGrupo.push({
                            idGrupo: grupo.id,
                            grupo: grupo.data().grupo,
                            userId: grupo.data().userId
                        })
                        userIds.push(grupo.data().userId)
                    })

                    if (userIds.length > 0) {
                        fetchUsuarios(userIds, arrayGrupo)
                    } else {
                        setSolicitacoes([])
                        setLoading(false)
                    }
                }, (error) => {
                    console.error('Erro ao ouvir mudanças em grupos!', error)
                    setLoading(false)
                })

                async function fetchUsuarios(userIds, arrayGrupo) {
                    const docRefUsuarios = collection(db, 'usuarios')
                    const q2 = query(docRefUsuarios, where('id', 'in', userIds))

                    unSubUsuarios = onSnapshot(q2, (usuarios) => {
                        const arrayUsuario = []
                        usuarios.docs.forEach(usuario => {
                            arrayUsuario.push({
                                id: usuario.id,
                                nome: usuario.data().nome,
                                imageUrl: usuario.data().imageUrl
                            })
                        })

                        const solicitacoes = arrayGrupo.map(grupo => {
                            const usuario = arrayUsuario.find(user => user.id === grupo.userId)
                            return {
                                ...grupo,
                                ...usuario
                            }
                        })

                        setSolicitacoes(solicitacoes)
                        setLoading(false)
                    }, (error) => {
                        console.error('Erro ao ouvir mudanças em usuários!', error)
                        setLoading(false)
                    })
                }
            } catch (error) {
                console.error('Erro ao consultar as solicitações!', error)
                setLoading(false)
            }
        }

        loadSolicitacoes()

        return () => {
            if (unSubGrupos) unSubGrupos()
            if (unSubUsuarios) unSubUsuarios()
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