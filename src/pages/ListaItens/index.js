import './lista-itens.css'

import Titulo from "../../components/Titulo"
import ImgCircle from "../../components/ImgCircle"
import CardImg from '../../components/CardImg'
import NavBar from '../../components/NavBar'
import ButtonAdd from '../../components/ButtonAdd'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import Loading from '../../components/Loading'

function ListaItens() {

    const {id, idEstudante} = useParams()

    const [itens, setItens] = useState([])
    const [estudante, setEstudante] = useState({})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        async function buscarItens(){
            setLoading(true)

            buscarEstudante()

            const docRef = collection(db, 'itens')
            const q = query(docRef, where('idEstudante', '==', idEstudante))

            await getDocs(q)
            .then((snapshot) => {
                const lista = []
                snapshot.docs.forEach((item) => {
                    lista.push({
                        id: item.id,
                        ...item.data()
                    })
                })
                setItens(lista)
            })
            .catch(error => {
                toast.error('Não foi possível carregar os itens!')
            })
            .finally(() => {
                setLoading(false)
            })
        }

        async function buscarEstudante(){
            const docRef = doc(db, 'estudantes', idEstudante)

            await getDoc(docRef)
            .then((snapshot) => {
                const data = {
                    nome: snapshot.data().nome,
                    url: snapshot.data().url
                }
                setEstudante(data)
            })
            .catch(error => {
                toast.error('Não foi possível carregar os dados do estudante!')
            })
        }

        buscarItens()
    }, [idEstudante])

    return (
        <div className="responsive-navbar container lista-itens">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>{estudante.nome}</h1>
            </Titulo>
            
            <ImgCircle src={estudante.url} alt="foto do estudante" marginBottom="20px"/>

            {itens.map((item, index) => {
                return(
                    <CardImg
                        key={index} 
                        urlImg={item.url}
                        addLostItem={true}
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