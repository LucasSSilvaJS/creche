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
            try {
                const docRefGrupos = doc(db, 'grupos', id)
                const getGrupo = await getDoc(docRefGrupos)
                const grupo = getGrupo.data().grupo
                
                const userId = getGrupo.data().userId
    
                const docRefUsuarios = doc(db, 'usuarios', userId)
                const getUsuario = await getDoc(docRefUsuarios)
                const userName = getUsuario.data().nome
                
                const item = {grupo, userName}
                setCard(item)
                
            }finally{
                setLoading(false)
            }
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

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default GrupoMenu