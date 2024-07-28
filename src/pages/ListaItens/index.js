import './lista-itens.css'

import Titulo from "../../components/Titulo"
import CardImg from '../../components/CardImg'
import NavBar from '../../components/NavBar'
import ButtonAdd from '../../components/ButtonAdd'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { db } from '../../services/firebaseConnection'
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore'

import { format } from 'date-fns'
import { toast } from 'react-toastify'

function ListaItens() {

    const {id, idEstudante} = useParams()

    const [itens, setItens] = useState([])
    const [estudante, setEstudante] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)

        const docRef = collection(db, 'itens')
        const q = query(docRef, where('idEstudante', '==', idEstudante))

        const unsubscribeItens = onSnapshot(q, (snapshot) => {
            const lista = []
            snapshot.docs.forEach((item) => {
                lista.push({
                    id: item.id,
                    ...item.data()
                })
            })
            setItens(lista)
            setLoading(false)
        }, (error) => {
            toast.error('Não foi possível carregar os itens!')
            setLoading(false)
        })

        const docEstudanteRef = doc(db, 'estudantes', idEstudante)
        
        const unsubscribeEstudante = onSnapshot(docEstudanteRef, (snapshot) => {
            if (snapshot.exists()) {
                setEstudante({ nome: snapshot.data().nome })
            } else {
                toast.error('Não foi possível carregar os dados do estudante!')
            }
        }, (error) => {
            toast.error('Não foi possível carregar os dados do estudante!')
        })

        return () => {
            unsubscribeItens()
            unsubscribeEstudante()
        }

    }, [idEstudante])

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
                        handleDelete={() => toast.success('Item deletado')}
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