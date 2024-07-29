import './pagina-inicial.css'

import Card from '../../components/Card'
import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import ButtonAdd from '../../components/ButtonAdd'
import Loading from '../../components/Loading'

import { useNavigate } from 'react-router-dom'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import { collection, deleteDoc, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

function PaginaInicial(){
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)

    const [grupos, setGrupos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let unSub = null
        async function loadGroups(){
            try{
                const docRef = collection(db, 'grupos')
                const q = query(docRef, where('participantes', 'array-contains', user.id))
                
                unSub = onSnapshot(q, (snapshot) => {
                    const lista = []
                    snapshot.docs.forEach(item => {
                        lista.push({
                            idGrupo: item.id,
                            ...item.data()
                        })
                    })
                    setGrupos(lista)
                })

            }catch(error){
                console.error('Erro ao carregar os grupos', error)
            }finally{
                setLoading(false)
            }
        }

        loadGroups()

        return () => {
            if(unSub) unSub()
        }
    }, [user])

    async function deleteGrupo(idGrupo){
        try {
            const docRefGrupo = doc(db, 'grupos', idGrupo)
            await deleteDoc(docRefGrupo)

            const docRefItens = collection(db, 'itens')
            const queryItens = query(docRefItens, where('idGrupo', '==', idGrupo))

            const itens = await getDocs(queryItens)

            itens.docs.forEach(async (item) => {
                const docRefItem = doc(db, 'itens', item.id)
                await deleteDoc(docRefItem)
            })

            const docRefEstudantes = collection(db, 'estudantes')
            const queryEstudantes = query(docRefEstudantes, where('idGrupo', '==', idGrupo))

            const estudantes = await getDocs(queryEstudantes)

            estudantes.docs.forEach(async (estudante) => {
                const docRefEstudante = doc(db, 'estudantes', estudante.id)
                await deleteDoc(docRefEstudante)
            })

            const docRefItensPerdidos = collection(db, 'itensPerdidos')
            const queryItensPerdidos = query(docRefItensPerdidos, where('idGrupo', '==', idGrupo))

            const itensPerdidos = await getDocs(queryItensPerdidos)

            itensPerdidos.docs.forEach(async (itemPerdido) => {
                const docRefItemPerdido = doc(db, 'itensPerdidos', itemPerdido.id)
                await deleteDoc(docRefItemPerdido)
            })
            
            toast.success('Grupo deletado com sucesso')
        } catch (error) {
            console.log('Erro ao deletar o grupo', error)
            toast.error('Erro ao deletar o grupo')
        }
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