import './itens-perdidos.css'

import Titulo from '../../components/Titulo'
import NavBar from '../../components/NavBar';
import CardImg from '../../components/CardImg';
import ButtonAdd from '../../components/ButtonAdd';
import Loading from '../../components/Loading';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';

function ItensPerdidos() {
    const { id } = useParams()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [itensPerdidos, setItensPerdidos] = useState([])

    useEffect(() => {
        let unSub = null

        async function getLostItens(){
            try{
                setLoading(true)
                const docRef = collection(db, 'itensPerdidos')
                unSub = await onSnapshot(docRef, (snapshot) => {
                    const lista = []
                    snapshot.docs.forEach(item => {
                        lista.push({
                            idItemPerdido: item.id,
                            ...item.data()
                        })
                    })
                    setItensPerdidos(lista)
                })

            }catch(error){
                toast.warn('Erro aos carregar os itens perdidos!')
            }finally{
                setLoading(false)
            }
        }

        getLostItens()

        return () => {
            if(unSub) unSub()
        }
    }, [])

    async function removerItemPerdido(idItemPerdido){
        try{
            const docRef = doc(db, 'itensPerdidos', idItemPerdido)
            await deleteDoc(docRef)

            toast.success('Item perdido removido com sucesso!')
        }catch(error){
            console.error('Erro ao remover item perdido', error)
            toast.error('Erro ao remover item perdido!')
        }
    }

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
                    handleDelete={() => removerItemPerdido(item.idItemPerdido)}
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