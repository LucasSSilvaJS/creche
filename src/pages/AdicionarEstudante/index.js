import './adicionar-estudante.css'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { toast } from 'react-toastify'

function AdicionarEstudante() {
    const { idEstudante, id } = useParams()

    const [ loading, setLoading ] = useState(false)

    const [ nome, setNome ] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        if(idEstudante && id){

            setLoading(true)
            
            async function getStudent(){
                const docRef = doc(db, 'estudantes', idEstudante)

                await getDoc(docRef)
                .then((snapshot) => {
                    setNome(snapshot.data().nome)
                })
                .catch(error => {
                    toast.error('Não foi possível encontrar esse usuário!')
                })
                .finally(() => {
                    setLoading(false)
                })
            }

            getStudent()
        }
    }, [id, idEstudante])

    async function createStudent(){
        try{
            setLoading(true)

            const collectionRef = collection(db, 'estudantes')

            const estudanteDoc = await addDoc(collectionRef, {
                nome,
                idGrupo: id,
                itens: []
            })

            await updateDoc(doc(db, 'grupos', id), {
                estudantes: arrayUnion(estudanteDoc.id)
            })

            toast.success('Estudante adicionado com sucesso!')

            setNome('')

            navigate(`/grupo/menu/${id}/estudantes`)

        }catch(error){
            toast.error('Erro ao adicionar um novo estudante!')
            console.error('Erro ao adicionar um novo estudante', error)
        }finally{
            setLoading(false)
        }
    }

    async function editStudent(){
        try {
            setLoading(true)

            const docRefEstudantes = doc(db, 'estudantes', idEstudante)

            await updateDoc(docRefEstudantes, {
                nome
            })

            toast.success('Dados do estudante atualizados com sucesso!')

            setNome('')

            navigate(`/grupo/menu/${id}/estudantes`)
        } catch (error) {
            toast.error('Ocorreu um erro ao atualizar os dados do estudante')
            console.error('Ocorreu um erro ao atualizar os dados do estudante', error)
        } finally{
            setLoading(false)
        }
        
    }

    return ( 
        <div className="adicionar-estudante container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Estudante</h1>
            </Titulo>

            <InputField textLabel="Nome do estudante">
                <InputText value={nome} handleInput={(e) => setNome(e.target.value)}/>
            </InputField>

            {idEstudante ? (
                <ButtonFull marginTop="20px" texto="Editar" handleAction={() => editStudent()}/>
            ) : (
                <ButtonFull marginTop="20px" texto="Criar" handleAction={() => createStudent()}/>
            )}

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default AdicionarEstudante;