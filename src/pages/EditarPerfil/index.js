import './editar-perfil.css'

import Titulo from '../../components/Titulo';
import InputField from '../../components/InputField';
import InputText from '../../components/InputText';
import UploadImage from '../../components/UploadImage';
import Select from '../../components/Select';
import ButtonFull from '../../components/ButtonFull';
import NavBar from '../../components/NavBar';
import Loading from '../../components/Loading';

import { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import { db, storage } from '../../services/firebaseConnection';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

function EditarPerfil() {
    const { user, setUser, setLoginInLocalStorage } = useContext(AuthContext)

    const cargos = useMemo(() => ['ADI', 'Professor', 'Estagiário'], [])
    
    const [avatarImg, setAvatarImg] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState('')
    
    const [nome, setNome] = useState('')
    const [cargo, setCargo] = useState(0)

    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        function carregarDados(){
            setNome(user.nome)
            setAvatarUrl(user.imageUrl)
            setCargo(cargos.indexOf(user.cargo))
        }

        carregarDados()
    }, [cargos, user])

    async function getUrl(avatarImg, id){
        try{
            const uploadRef = ref(storage, `avatar/${id}/${avatarImg.name}`)

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

    async function atualizarPerfil(){
        setLoading(true)

        const docRef = doc(db, 'usuarios', user.id)

        let imageUrl = user.imageUrl

        if(avatarImg){
            imageUrl = await getUrl(avatarImg, user.id)
        }

        const novosDados = {
            ...user,
            nome,
            cargo: cargos[cargo],
            imageUrl
        }

        await updateDoc(docRef, novosDados)
        .then(() => {
            setUser(novosDados)
            setLoginInLocalStorage(novosDados)
            toast.success('Usuario atualizado com sucesso!')
            navigate('/perfil')
        })
        .catch( (error) => {
            console.error('Erro ao fazer a atualização dos dados do usuários', error)
            toast.error('Não foi possível atualizar os dados!')
        })
        .finally(() => {
            setLoading(false)
        })
    }

    return ( 
        <div className="editar-perfil container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Editar Perfil</h1>
            </Titulo>

            <InputField textLabel="Nome completo">
                <InputText value={nome} handleInput={(e) => setNome(e.target.value)}/>
            </InputField>

            <InputField textLabel="Foto">
                <UploadImage url={avatarUrl} handleFile={(e) => handleFile(e)}/>
            </InputField>

            <InputField textLabel="Cargo">
                <Select values={cargos} actualValue={cargo} handleSelect={e => setCargo(e.target.value)}/>
            </InputField>

            <ButtonFull marginTop="20px" texto="Alterar" handleAction={atualizarPerfil}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
    )
}

export default EditarPerfil;