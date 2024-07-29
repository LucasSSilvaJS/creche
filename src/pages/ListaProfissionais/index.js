import './lista-profissionais.css'

import Titulo from "../../components/Titulo";
import CardImg from "../../components/CardImg";
import ButtonAdd from "../../components/ButtonAdd";
import NavBar from "../../components/NavBar";
import Loading from "../../components/Loading";

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { arrayRemove, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

function ListaProfissionais() {

    const [participantes, setParticipantes] = useState([])

    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        let unSubProfissionais = null
        let unSubParticipantes = null

        async function loadProfissionais(){
            const docRefGrupos = doc(db, 'grupos', id)

            unSubProfissionais = onSnapshot(docRefGrupos, (snapshot) => {
                const listaDeIds = snapshot.data().participantes
                
                if(listaDeIds.length > 0){
                    getParticipantes(listaDeIds)
                }
            })

        }

        async function getParticipantes(ids){
            try{
                setLoading(true)

                const docRef = collection(db, 'usuarios')
                const q = query(docRef, where('id', 'in', ids))
        
                unSubParticipantes = onSnapshot(q, (snapshot) => {
                    const lista = []
                    snapshot.docs.forEach(item => {
                        lista.push({
                            ...item.data()
                        })
                    })
                    setParticipantes(lista)
                })
            }catch(error){
                console.error('Ocorreu um erro ao obter os dados dos participantes', error)
            }finally{
                setLoading(false)
            }
        }

        loadProfissionais()

        return () => {
            if(unSubParticipantes) unSubParticipantes()
            if(unSubProfissionais) unSubProfissionais()
        }
    }, [id])

    async function deleteProfissional(participanteId){
        try{
            const docRef = doc(db, 'grupos', id)

            const grupo = await getDoc(docRef)

            if(participanteId === grupo.data().userId){
                toast.error('Você não pode excluir o dono do grupo')
                return
            }

            await updateDoc(docRef, {
                participantes: arrayRemove(participanteId)
            })

            toast.success('Participante deletado!')
        }catch{
            toast.error('Erro ao deletar participante!')
        }
    }

    return ( 
        <div className="lista-profissionais container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Lista de<br/>profissionais</h1>
            </Titulo>

            {
                participantes.map((participante, index) => {
                    return(
                        <CardImg
                            key={index}
                            urlImg={participante.imageUrl}
                            adm={true}
                            ableEdit={false}
                            handleDelete={() => deleteProfissional(participante.id)}
                        >
                            <h2>{participante.nome}</h2>
                            <h3>{participante.cargo}</h3>
                        </CardImg>
                    )
                })
            }

            <ButtonAdd handleCreate={() => navigate(`/grupo/menu/${id}/profissionais/profissional`)}/>

            {loading && <Loading/>}
            <NavBar/>
        </div>
     );
}

export default ListaProfissionais;