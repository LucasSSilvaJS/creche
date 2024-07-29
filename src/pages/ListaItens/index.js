import './lista-itens.css'

import Titulo from "../../components/Titulo"
import CardImg from '../../components/CardImg'
import NavBar from '../../components/NavBar'
import ButtonAdd from '../../components/ButtonAdd'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { db } from '../../services/firebaseConnection'
import { arrayRemove, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'

import { format } from 'date-fns'
import { toast } from 'react-toastify'

function ListaItens() {

    const {id, idEstudante} = useParams()

    const [itens, setItens] = useState([])
    const [estudante, setEstudante] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        let unSubItens = null
        let unSubEstudante = null
        async function buscarItens(){
            setLoading(true)

            try{
                const docRef = collection(db, 'itens')
                const q = query(docRef, where('idEstudante', '==', idEstudante))

                unSubItens = onSnapshot(q, (snapshot) => {
                    const lista = []
                    snapshot.docs.forEach((item) => {
                        lista.push({
                            id: item.id,
                            ...item.data()
                        })
                    })
    
                    setItens(lista)
                })

            }catch(error){
                toast.error('Não foi possível carregar os itens!')
            }finally{
                setLoading(false)
            }
        }

        async function buscarEstudante(){

            try{
                const docRef = doc(db, 'estudantes', idEstudante)

                unSubEstudante = onSnapshot(docRef, (snapshot) => {
                    const data = {
                        nome: snapshot.data().nome
                    }
                    setEstudante(data)
                })

            }catch(error){
                toast.error('Não foi possível carregar os dados do estudante!')
            }
        }

        buscarEstudante()
        buscarItens()

        return () => {
            if (unSubEstudante) unSubEstudante()
            if (unSubItens) unSubItens()
        }
    }, [idEstudante])

    async function deletarItem(idItem){
        try{
            const docRefItem = doc(db, 'itens', idItem)

            await deleteDoc(docRefItem)

            const docRefEstudante = doc(db, 'estudantes', idEstudante)

            await updateDoc(docRefEstudante, {
                itens: arrayRemove(idItem)
            })

            toast.success('Item removido com sucesso!')
        }catch(error){
            console.log('Erro ao deletar item', error)
            toast.error('Erro ao deletar item')
        }
    }

    return (
        <div className="responsive-navbar container lista-itens">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Itens de {estudante.nome}</h1>
            </Titulo>
            
            {itens.map((item, index) => {
                return(
                    <CardImg
                        key={index} 
                        urlImg={item.url}
                        handleEdit={() => navigate(`/grupo/menu/${id}/estudantes/estudante/${idEstudante}/itens/item/${item.id}`)}
                        handleDelete={() => deletarItem(item.id)}
                    >
                        <h2>{item.nome}</h2>
                        <h3>
                            Adicionada em:
                            <br/>
                            <span>{format(item.created.toDate(), 'dd/MM/yyyy')}</span>
                        </h3>
                    </CardImg>
                )
            })}

            <ButtonAdd handleCreate={() => navigate(`/grupo/menu/${id}/estudantes/estudante/${idEstudante}/itens/item/`)}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default ListaItens