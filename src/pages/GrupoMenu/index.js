import './grupo-menu.css'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonFull from '../../components/ButtonFull'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import Loading from '../../components/Loading'

function GrupoMenu(){
    const { id } = useParams()
    const navigate = useNavigate()

    const [card, setCard] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCard(){
            const docRef = doc(db, 'grupos', id)

            await getDoc(docRef)
            .then(snapshot => {
                const item = {
                    grupo: snapshot.data().grupo,
                    userName: snapshot.data().userName
                }
                setCard(item)
            })
            .finally(() => {
                setLoading(false)
            })
        }

        loadCard()
    }, [id])

    return(
        <div className="container grupo-menu responsive-navbar">
            <Titulo marginTop="20px" marginBottom="5px">
                <h1>{card.grupo || 'Carregando'}</h1>
            </Titulo>

            <p className="grupo-menu__subtitle">Grupo criado por <span>{card.userName || 'Carregando'}</span></p>

            <ButtonFull texto="Lista de estudantes" marginTop="20px" handleAction={() => navigate(`/grupo/menu/${id}/estudantes`)}/>

            <ButtonFull texto="Lista de profissionais" marginTop="20px" handleAction={() => navigate(`/grupo/menu/${id}/profissionais`)}/>

            <ButtonFull texto="Itens perdidos" marginTop="20px" handleAction={() => navigate(`/grupo/menu/${id}/perdidos`)}/>

            <ButtonFull texto="Calendário" marginTop="20px" handleAction={() => navigate(`/grupo/menu/${id}/calendario`)}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default GrupoMenu