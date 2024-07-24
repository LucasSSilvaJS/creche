import './lista-estudantes.css'

// import avatar from '../../assets/avatar.png'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonAdd from '../../components/ButtonAdd'
import CardImg from '../../components/CardImg'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

function ListaEstudantes(){
    const { id } = useParams()

    const [estudantes, setEstudantes] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function loadStudents(){
            setLoading(true)
            const docRef = collection(db, 'estudantes')
            const q = query(docRef, where('idGrupo', '==', id))

            await getDocs(q)
            .then((snapshot) => {
                const lista = []

                snapshot.docs.forEach(item => {
                    lista.push({
                        id: item.id,
                        nome: item.data().nome,
                        url: item.data().url
                    })
                })

                setEstudantes(lista)
            })
            .finally(() => {
                setLoading(false)
            })
        }

        loadStudents()
    }, [id])

    return(
        <div className="lista-estudantes container responsive-navbar">
            <Titulo marginTop="20px" marginBottom="20px">
                <h1>Lista de<br/>Estudantes</h1>
            </Titulo>

            { estudantes.map((estudante, index) => {
                return(
                    <CardImg 
                    key={index}
                    urlImg={estudante.url} 
                    handleDelete={() => alert('deletando')} 
                    handleEdit={() => {navigate(`/grupo/menu/${id}/estudantes/estudante/${estudante.id}`)}}
                    handleNavigate={() => {navigate(`/grupo/menu/${id}/estudantes/estudante/${estudante.id}/itens`)}}
                    >
                        <h2>{estudante.nome}</h2>
                    </CardImg>
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