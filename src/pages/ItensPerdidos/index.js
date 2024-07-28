import './itens-perdidos.css'

import Titulo from '../../components/Titulo'
import NavBar from '../../components/NavBar';
import CardImg from '../../components/CardImg';
import ButtonAdd from '../../components/ButtonAdd';
import Loading from '../../components/Loading';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

function ItensPerdidos() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [itensPerdidos, setItensPerdidos] = useState([])

    useEffect(() => {
        async function getLostItens(){
            setLoading(true)
            const docRef = collection(db, 'itensPerdidos')
            await getDocs(docRef)
            .then((snapshot) => {
                const lista = []
                snapshot.docs.forEach(item => {
                    lista.push({
                        idItemPerdido: item.id,
                        ...item.data()
                    })
                })
                setItensPerdidos(lista)
            })
            .catch(error => {
                toast.warn('Erro aos carregar os itens perdidos!')
            })
            .finally(() => {
                setLoading(false)
            })
        }

        getLostItens()
    }, [])

    return ( 
        <div className="itens-perdidos container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Itens<br/>Perdidos</h1>
            </Titulo>

            {itensPerdidos.map((item, index) => {
                return(
                    <CardImg 
                    key={index}
                    urlImg={item.url} 
                    handleEdit={() => navigate(`/grupo/menu/${id}/perdidos/perdido/${item.idItemPerdido}`)} 
                    handleDelete={() => toast.success('Item deletado')}
                    handleNavigate={() => navigate(`/grupo/menu/${id}/perdidos/perdido/${item.idItemPerdido}/atribuir`)}
                >
                    <h2>{item.nome}</h2>
                </CardImg>
                )
            })}

            <ButtonAdd handleCreate={() => navigate(`/grupo/menu/${id}/perdidos/perdido`)}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default ItensPerdidos;