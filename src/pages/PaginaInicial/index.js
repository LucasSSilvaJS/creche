import './pagina-inicial.css'

import Card from '../../components/Card'
import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonAdd from '../../components/ButtonAdd'
import Loading from '../../components/Loading'

import { useNavigate } from 'react-router-dom'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

function PaginaInicial(){
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)

    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const docRef = collection(db, 'grupos')
        const q = query(docRef, where('participantes', 'array-contains', user.id))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = []
            snapshot.docs.forEach(item => {
                lista.push({
                    idGrupo: item.id,
                    ...item.data()
                })
            })
            setGrupos(lista)
            setLoading(false)
        }, (error) => {
            console.error('Erro ao carregar os grupos', error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    function deleteGrupo(){
        alert('teste')
    }

    return(
        <div className="container pagina-inicial responsive-navbar">
            <Titulo marginBottom="25px" marginTop="25px">
                <h1>Grupos</h1>
            </Titulo>

            {loading && <Loading/>}

            {grupos.map((item, index) => {
                return(
                    <Card
                        key={index} 
                        title={item.grupo} 
                        subtitle={item.escola}
                        handleEditCard={() => navigate(`/grupo/${item.idGrupo}`)}
                        handleDeleteCard={() => deleteGrupo(item.idGrupo)}
                        handleMenu={() => navigate(`/grupo/menu/${item.idGrupo}`)}
                    />
                )
            })}

            <ButtonAdd handleCreate={() => navigate('/grupo')}/>

            <NavBar/>
        </div>
    )
}

export default PaginaInicial