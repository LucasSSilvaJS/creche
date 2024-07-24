import './cadastro.css'
import logo from '../../assets/logo.svg'

import Titulo from '../../components/Titulo'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import ButtonBorder from '../../components/ButtonBorder'
import ButtonFull from '../../components/ButtonFull'
import UploadImage from '../../components/UploadImage'
import Select from '../../components/Select'
import Loading from '../../components/Loading'

import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import { toast } from 'react-toastify'

function Cadastro(){

    const { register, loadingRegister } = useContext(AuthContext)

    const cargos = ['ADI', 'Professor', 'Estagiário']

    const [avatarImg, setAvatarImg] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState('')

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [cargo, setCargo] = useState(0)
    const [senha, setSenha] = useState('')

    const navigate = useNavigate()

    function handleFile(e){
        const file = e.target.files[0]
        setAvatarImg(file)
        setAvatarUrl(URL.createObjectURL(file))
    }

    function resetarCampos(){
        setAvatarImg(null)
        setAvatarUrl('')
        setNome('')
        setEmail('')
        setCargo(0)
        setSenha('')
    }

    async function handleRegister(){
        if(nome && email && senha && avatarUrl){
            const account = await register(email, senha, nome, cargos[cargo], avatarImg)
            if(account){
                toast.success('Usuário registrado com sucesso')
                resetarCampos()
            }
            else{
                toast.error('Não é possível registrar essa conta!')
            }
        }else{
            toast.error('Preencha todos os campos!')
        }
    }

    return(
        <div className="container cadastro">

            {loadingRegister && <Loading/>}
            
            <Titulo 
                marginBottom="15px" 
                marginTop="83px"
            >
                <h1>Creche<br/>Sem Perdas</h1>
            </Titulo>

            <img src={logo} alt="logo" />

            <InputField textLabel="Foto de Usuário">
                <UploadImage handleFile={e => handleFile(e)} url={avatarUrl}/>
            </InputField>

            <InputField textLabel="Nome Completo">
                <InputText value={nome} handleInput={e => setNome(e.target.value)}/>
            </InputField>

            <InputField textLabel="Email">
                <InputText type="email" value={email} handleInput={e => setEmail(e.target.value)}/>
            </InputField>

            <InputField textLabel="Cargo">
                <Select values={cargos} actualValue={cargo} handleSelect={e => setCargo(parseInt(e.target.value))}/>
            </InputField>

            <InputField textLabel="Senha">
                <InputText type="password" value={senha} handleInput={e => setSenha(e.target.value)}/>
            </InputField>

            <ButtonFull texto="Cadastrar" marginTop="60px" handleAction={() => handleRegister()}/>

            <ButtonBorder texto="Sair" marginTop="15px" marginBottom="30px" handleNavigate={() => navigate('/')}/>
        </div>
    )
}

export default Cadastro