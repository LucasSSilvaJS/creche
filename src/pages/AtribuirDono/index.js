import './atribuir-dono.css'
import avatar from '../../assets/avatar.png'

import Titulo from '../../components/Titulo';
import ImgCircle from '../../components/ImgCircle';
import InputField from '../../components/InputField';
import Select from '../../components/Select';
import NavBar from '../../components/NavBar';
import ButtonFull from '../../components/ButtonFull';

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

function AtribuiDono() {
    const { id, idItem } = useParams()
    
    const [dono, setDono] = useState(0)
    const [estudantes, setEstudantes] = useState([])
    const [loading, setLoading] = useState(false)

    const nomesDosEstudantes = estudantes.map(estudante => estudante.nome)

    const navigate = useNavigate()

    useState(() => {
        async function loadDonos(){
            setLoading(true)
            const docRef = collection(db, 'estudantes')
            const q = query(docRef, where('idGrupo', '==', id))
            await getDocs(q)
            .then(snapshot => {
                const lista = []
                snapshot.docs.forEach((item, index)=> {
                    lista.push({
                        index,
                        idEstudante: item.id,
                        nome: item.data().nome
                    })
                })
                setEstudantes(lista)
            })
            .finally(() => {
                setLoading(false)
            })
        }

        loadDonos()
    }, [])

    async function atribuir(){
        try{
            setLoading(true)

            const docRefItemPerdido = doc(db, 'itensPerdidos', idItem)
            const dadosDoItemPerdido = await getDoc(docRefItemPerdido) 

            const filtrarEstudante = estudantes.filter(estudante => estudante.index === parseInt(dono))[0]
            const idEstudante = filtrarEstudante.idEstudante
            
            const docRefItens = collection(db, 'itens')
            const itemComDono = await addDoc(docRefItens, {
                idEstudante,
                ...dadosDoItemPerdido.data()
            })

            await deleteDoc(docRefItemPerdido)

            const docRefEstudante = doc(db, 'estudantes', idEstudante)
            await updateDoc(docRefEstudante, {
                itens: arrayUnion(itemComDono.id)
            })

            toast.success(`O item foi adicionado a lista de ${filtrarEstudante.nome}`)

            setDono(0)

            navigate(`/grupo/menu/${id}/estudantes/estudante/${idEstudante}/itens`)
        }catch(error){
            console.error('Ocorreu um erro ao atribuir o item perdido a um dono', error)
            toast.error('Ocorreu um erro ao atribuir o item perdido a um dono')
        }finally{
            setLoading(false)
        }
    }

    return ( 
        <div className="atribuir-dono container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Atribuir dono</h1>
            </Titulo>

            <ImgCircle src={avatar} alt="imagem do item perdido"/>

            <InputField textLabel="Dono do item perdido">
                <Select 
                    actualValue={dono} 
                    handleSelect={(e) => setDono(e.target.value)} 
                    values={nomesDosEstudantes}
                >
                </Select>
            </InputField>

            <ButtonFull marginTop="20px" texto="Atribuir" handleAction={atribuir}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default AtribuiDono;