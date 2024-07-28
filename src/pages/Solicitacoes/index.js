import './solicitacoes.css'

import Titulo from '../../components/Titulo'
import NavBar from '../../components/NavBar'
import Invite from '../../components/Invite';
import Loading from '../../components/Loading';

import { toast } from 'react-toastify';

import { useContext, useEffect, useState } from 'react';
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';

function Solicitacoes() {
    const { user } = useContext(AuthContext)

    const [solicitacoes, setSolicitacoes] = useState([])

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    
    useEffect(() => {
        async function loadNotification(){
            try{
                setLoading(true)

                const docRefGrupos = collection(db, 'grupos')
                const q = query(docRefGrupos, where('solicitacoes', 'array-contains', user.id))

                const grupos = await getDocs(q)
                
                const userIds = []
                const gruposComUsuario = []

                grupos.docs.forEach(grupo => {
                    userIds.push(grupo.data().userId)
                    gruposComUsuario.push({
                        idGrupo: grupo.id,
                        grupo: grupo.data().grupo
                    })
                })

                if(userIds.length > 0){
                    const docRefUsuarios = collection(db, 'usuarios')
                    const q2 = query(docRefUsuarios, where('id', 'in', userIds))
        
                    const usuarios = await getDocs(q2)
        
                    usuarios.docs.forEach(usuario => {
                        gruposComUsuario.forEach(grupo => {
                            grupo.nome = usuario.data().nome
                            grupo.imageUrl = usuario.data().imageUrl
                        })
                    })
        
                    setSolicitacoes(gruposComUsuario)
                }else{
                    toast.error('Nenhuma solicitação encontrada')
                }
            }catch(error){
                toast.error('Erro ao encontrar solicitações')
            }finally{
                setLoading(false)
            }
        }

        loadNotification()
    }, [user])

    async function accepted(idGrupo){
        const docRefGrupo = doc(db, 'grupos', idGrupo)
        await updateDoc(docRefGrupo, {
            solicitacoes: arrayRemove(user.id),
            participantes: arrayUnion(user.id)
        })
        .then(() => {
            toast.success('Convite aceitado com sucesso!')
            navigate('/grupos')
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