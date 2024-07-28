import './lista-profissionais.css'

import Titulo from "../../components/Titulo";
import CardImg from "../../components/CardImg";
import ButtonAdd from "../../components/ButtonAdd";
import NavBar from "../../components/NavBar";
import Loading from "../../components/Loading";

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

function ListaProfissionais() {

    const [participantes, setParticipantes] = useState([])

    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        async function loadProfissionais(){
            const docRefGrupos = doc(db, 'grupos', id)

            const snapshot = await getDoc(docRefGrupos)
            const listaDeIds = snapshot.data().participantes

            if(listaDeIds.length > 0){
                getParticipantes(listaDeIds)
            }
        }

        async function getParticipantes(ids){
            try{
                setLoading(true)

                const docRef = collection(db, 'usuarios')
                const q = query(docRef, where('id', 'in', ids))
        
                const snapshot = await getDocs(q)
                const lista = []
                snapshot.docs.forEach(item => {
                    lista.push({
                        ...item.data()
                    })
                })
                
                setParticipantes(lista)
            }catch(error){
                console.error('Ocorreu um erro ao obter os dados dos participantes', error)
            }finally{
                setLoading(false)
            }
        }

        loadProfissionais()
    }, [id])


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
                            adm={false}
                            ableEdit={false}
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