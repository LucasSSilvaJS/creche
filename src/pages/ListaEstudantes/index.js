import './lista-estudantes.css'

// import avatar from '../../assets/avatar.png'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonAdd from '../../components/ButtonAdd'
import Card from '../../components/Card'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

function ListaEstudantes(){
    const { id } = useParams()

    const [estudantes, setEstudantes] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        const docRef = collection(db, 'estudantes')
        const q = query(docRef, where('idGrupo', '==', id))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = []

            snapshot.docs.forEach(item => {
                lista.push({
                    id: item.id,
                    nome: item.data().nome
                })
            })

            setEstudantes(lista)
            setLoading(false)
        }, (error) => {
            console.error("Erro ao carregar os estudantes: ", error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [id])

    return(
        <div className="lista-estudantes container responsive-navbar">
            <Titulo marginTop="20px" marginBottom="20px">
                <h1>Lista de<br/>Estudantes</h1>
            </Titulo>

            { estudantes.map((estudante, index) => {
                return(
                    <Card 
                    key={index}
                    title={estudante.nome}
                    handleDeleteCard={() => alert('deletando')}
                    handleEditCard={() => {navigate(`/grupo/menu/${id}/estudantes/estudante/${estudante.id}`)}}
                    handleMenu={() => {navigate(`/grupo/menu/${id}/estudantes/estudante/${estudante.id}/itens`)}}
                    >
                    </Card>
                )
            })
            }

            <ButtonAdd handleCreate={() => {navigate(`/grupo/menu/${id}/estudantes/estudante`)}}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default ListaEstudantes