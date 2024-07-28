import './adicionar-grupo.css'

import Titulo from '../../components/Titulo'
import NavBar from '../../components/NavBar'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'

function AdicionarGrupo(){
    const { user } = useContext(AuthContext)

    const { id } = useParams()

    const [grupo, setGrupo] = useState('')
    const [escola, setEscola] = useState('')

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if(id){
            async function preLoadEdit(){
                setLoading(true)
                const docRef = doc(db, 'grupos', id)
                const docSnapshot = await getDoc(docRef)
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data()
                    setEscola(data.escola || '')
                    setGrupo(data.grupo || '')
                } else {
                    toast.error('Grupo não encontrado!')
                }
            }
            preLoadEdit()
            setLoading(false)            
        }
    }, [id])

    async function handleCreateGroup(){
        if(grupo && escola){
            setLoading(true)
            const docRef = collection(db, 'grupos')
            await addDoc(docRef, {
                userId: user.id,
                created: new Date(),
                grupo,
                escola,
                participantes: [
                    user.id
                ],
                estudantes: [],
                solicitacoes: []
            })
            .then((value) => {
                toast.success('Grupo criado com sucesso!')
                setGrupo('')
                setEscola('')
                navigate('/pagina-inicial')
            })
            .catch((error) => {
                toast.error('Ops! Ocorreu um erro. Tente mais tarde!')
            })
            .finally(() => {
                setLoading(false)
            })
        }else{
            toast.error('Preencha todos os dados!')
        }
    }

    async function handleEditGroup(id){
        if(escola && grupo){
            setLoading(true)
            const docRef = doc(db, 'grupos', id)
            await updateDoc(docRef, {
                escola,
                grupo
            })
            .then(() => {
                toast.success('Grupo atualizado com sucesso!')
                setEscola('')
                setGrupo('')
                navigate('/pagina-inicial')
            })
            .catch((error) => {
                toast.error('Ops! Ocorreu um erro. Tente mais tarde!')
            })
            .finally(() => {
                setLoading(false)
            })
        }else{
            toast.error('Preencha todos os dados!')
        }
    }

    return(
        <div className="container adicionar-grupo responsive-navbar">
            <Titulo marginBottom="25px" marginTop="25px">
                <h1>Grupos</h1>
            </Titulo>

            <InputField textLabel="Nome do grupo">
                <InputText value={grupo} handleInput={(e) => {setGrupo(e.target.value)}}/>
            </InputField>

            <InputField textLabel="Nome da Escola">
                <InputText value={escola} handleInput={(e) => {setEscola(e.target.value)}}/>
            </InputField>

            {id ? (
                <ButtonFull texto="Editar" marginTop="15px" handleAction={() => handleEditGroup(id)}/>
            ) : (
                <ButtonFull texto="Criar" marginTop="15px" handleAction={() => handleCreateGroup()}/>
            )}

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default AdicionarGrupo