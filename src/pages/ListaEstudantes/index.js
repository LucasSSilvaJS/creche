import './lista-estudantes.css'

// import avatar from '../../assets/avatar.png'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonAdd from '../../components/ButtonAdd'
import Card from '../../components/Card'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { arrayRemove, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

function ListaEstudantes(){
    const { id } = useParams()

    const [estudantes, setEstudantes] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        let unSub = null
        async function loadStudents(){
            setLoading(true)
            const docRef = collection(db, 'estudantes')
            const q = query(docRef, where('idGrupo', '==', id))

            unSub = await onSnapshot(q, (snapshot) => {
                const lista = []
    
                snapshot.docs.forEach(item => {
                    lista.push({
                        id: item.id,
                        nome: item.data().nome
                    })
                })
    
                setEstudantes(lista)
            })

            setLoading(false)

        }

        loadStudents()

        return () => {
            if(unSub) unSub()
        }
    }, [id])

    async function deletarEstudante(idEstudante){
        try{
            const docRefEstudante = doc(db, 'estudantes', idEstudante)

            await deleteDoc(docRefEstudante)

            const docRefGrupo = doc(db, 'grupos', id)

            await updateDoc(docRefGrupo, {
                estudantes: arrayRemove(idEstudante)
            })

            const docRefItens = collection(db, 'itens')

            const queryItens = query(docRefItens, where('idEstudante', '==', idEstudante))

            const itens = await getDocs(queryItens)

            itens.docs.forEach(async (item) => {
                const docRefItem = doc(db, 'itens', item.id)
                await deleteDoc(docRefItem)
            })

            toast.success('Estudante deletado com sucesso!')
        }catch(error){
            console.log('Erro ao deletar estudante', error)
            toast.error('Erro ao deletar estudante!')
        }
    }

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
                    handleDeleteCard={() => deletarEstudante(estudante.id)}
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