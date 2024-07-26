import './adicionar-item-perdido.css'

import NavBar from '../../components/NavBar'
import Titulo from '../../components/Titulo'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import UploadImage from '../../components/UploadImage'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'

import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../services/firebaseConnection'

import { toast } from 'react-toastify'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

function AdicionarItemPerdido() {
    const { id, idItem } = useParams()

    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ avatarUrl, setAvatarUrl ] = useState('')
    
    const [ loading, setLoading ] = useState(false)

    const [ nome, setNome ] = useState('')

    const [itemAntigo, setItemAntigo] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        if(id && idItem){

            setLoading(true)
            
            async function getItem(){
                const docRef = doc(db, 'itensPerdidos', idItem)

                await getDoc(docRef)
                .then((snapshot) => {
                    setNome(snapshot.data().nome)
                    setAvatarUrl(snapshot.data().url)
                    setItemAntigo({
                        id: snapshot.id,
                        ...snapshot.data()
                    })
                })
                .catch(error => {
                    toast.error('Não foi possível encontrar esse item perdido!')
                })
                .finally(() => {
                    setLoading(false)
                })
            }

            getItem()
        }
    }, [id, idItem])

    async function getUrl(avatarImg, id){
        try{
            const uploadRef = ref(storage, `itemPerdidos/${id}/${avatarImg.name}`)

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

    async function createItemPerdido(){
        try{
            setLoading(true)

            const collectionRef = collection(db, 'itensPerdidos')

            const itemDoc = await addDoc(collectionRef, {
                nome,
                idGrupo: id,
                created: new Date()
            })
            
            const url = await getUrl(avatarImg, itemDoc.id)

            const docRef = doc(db, 'itensPerdidos', itemDoc.id)

            await updateDoc(docRef, {
                url
            })

            toast.success('Item perdido adicionado com sucesso!')

            setAvatarUrl('')
            setNome('')

            navigate(`/grupo/menu/${id}/perdidos`)

        }catch(error){
            toast.error('Erro ao adicionar um novo item perdido!')
            console.error('Erro ao adicionar um novo item perdido', error)
        }finally{
            setLoading(false)
        }
    }

    async function editItemPerdido(){
        try {
            setLoading(true)

            const docRefItens = doc(db, 'itensPerdidos', idItem)

            let url = itemAntigo.url

            if(avatarImg){
                url = await getUrl(avatarImg, idItem)
            }

            await updateDoc(docRefItens, {
                nome,
                url
            })

            toast.success('Dados do item perdido atualizados com sucesso!')

            setAvatarUrl('')
            setNome('')

            navigate(`/grupo/menu/${id}/perdidos`)
        } catch (error) {
            toast.error('Ocorreu um erro ao atualizar os dados do item perdido')
            console.error('Ocorreu um erro ao atualizar os dados do item perdido', error)
        } finally{
            setLoading(false)
        }
        
    }

    return ( 
        <div className="adicionar-item-perdido container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Item Perdido</h1>
            </Titulo>

            <InputField textLabel="Nome do item">
                <InputText value={nome} handleInput={(e) => setNome(e.target.value)}/>
            </InputField>

            <InputField textLabel="Foto do item">
                <UploadImage handleFile={handleFile} url={avatarUrl}/>
            </InputField>

            {idItem ? (
                <ButtonFull marginTop="20px" texto="Editar" handleAction={() => editItemPerdido()}/>
            ) : (
                <ButtonFull marginTop="20px" texto="Criar" handleAction={() => createItemPerdido()}/>
            )}

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default AdicionarItemPerdido;