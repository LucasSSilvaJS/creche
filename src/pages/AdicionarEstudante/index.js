import './adicionar-estudante.css'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import UploadImage from '../../components/UploadImage'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'

import { toast } from 'react-toastify'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

function AdicionarEstudante() {
    const { idEstudante, id } = useParams()

    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ avatarUrl, setAvatarUrl ] = useState('')
    
    const [ loading, setLoading ] = useState(false)

    const [ nome, setNome ] = useState('')

    const [estudanteAntigo, setEstudanteAntigo] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        if(idEstudante && id){

            setLoading(true)
            
            async function getStudent(){
                const docRef = doc(db, 'estudantes', idEstudante)

                await getDoc(docRef)
                .then((snapshot) => {
                    setNome(snapshot.data().nome)
                    setAvatarUrl(snapshot.data().url)
                    setEstudanteAntigo({
                        id: snapshot.id,
                        ...snapshot.data()
                    })
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

    async function getUrl(avatarImg, id){
        try{
            const uploadRef = ref(storage, `estudantePerfil/${id}/${avatarImg.name}`)

            const img = await uploadBytes(uploadRef, avatarImg)
            const imgRef = img.ref

            const url = await getDownloadURL(imgRef)

            return url
            
        }catch(error){
            console.error('Erro ao obter url da imagem', error)
        }
    }

    function handleFile(e){
        const file = e.target.files[0]
        setAvatarImg(file)
        setAvatarUrl(URL.createObjectURL(file))
    }

    async function createStudent(){
        try{
            setLoading(true)

            const collectionRef = collection(db, 'estudantes')

            const estudanteDoc = await addDoc(collectionRef, {
                nome,
                idGrupo: id,
                itens: [],
                itensPerdidos: []
            })
            
            const url = await getUrl(avatarImg, estudanteDoc.id)

            const docRef = doc(db, 'estudantes', estudanteDoc.id)

            await updateDoc(docRef, {
                url
            })

            await updateDoc(doc(db, 'grupos', id), {
                estudantes: arrayUnion(estudanteDoc.id)
            })

            toast.success('Estudante adicionado com sucesso!')

            setAvatarUrl('')
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

            let url = estudanteAntigo.url

            if(avatarImg){
                url = await getUrl(avatarImg, idEstudante)
            }

            await updateDoc(docRefEstudantes, {
                nome,
                url
            })

            toast.success('Dados do estudante atualizados com sucesso!')

            setAvatarUrl('')
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

            <InputField textLabel="Foto do estudante">
                <UploadImage handleFile={handleFile} url={avatarUrl}/>
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