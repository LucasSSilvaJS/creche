import './adicionar-profissional.css'

import ButtonFull from '../../components/ButtonFull';
import InputField from '../../components/InputField';
import InputText from '../../components/InputText';
import Titulo from '../../components/Titulo';
import NavBar from '../../components/NavBar';
import Loading from '../../components/Loading';

import { useState } from 'react';

import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function AdicionarProfissional() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const { id } = useParams()

    const navigate = useNavigate()

    async function enviarSolicitacao(){
        try{
            setLoading(true)

            const docRefUsuarios = collection(db, 'usuarios')
            const q = query(docRefUsuarios, where('email', '==', email))

            const filterList = await getDocs(q)

            if (filterList.empty) {
                toast.warn('Usuário não encontrado!');
                setLoading(false);
                return;
            }

            const userSearch = filterList.docs[0] 

            const docRefGrupos = doc(db, 'grupos', id)
            const grupo = await getDoc(docRefGrupos)
            
            const admId = grupo.data().userId

            const idRequest = userSearch.id

            const solicitacoes = grupo.data().solicitacoes

            const existIdInRequests = solicitacoes.some(id => id === idRequest)

            if(existIdInRequests){
                toast.warn('Solicitação já enviada!')
                return
            }

            if(admId !== idRequest){
            
                await updateDoc(docRefGrupos, {
                    solicitacoes: arrayUnion(idRequest)
                })
    
                toast.success('Solicitação enviada!')
    
                navigate(`/grupo/menu/${id}/profissionais`)
            }else{
                toast.warn('Como administrador, você não pode solicitar você mesmo!')
            }


        }catch(error){
            console.error(error)
            toast.error('Erro ao realizar a solicitação!')
        }finally{
            setLoading(false)
        }
    }

    return ( 
        <div className="container responsive-navbar adicionar-profissional">
            <Titulo marginTop="20px" marginBottom="20px">
                <h1>Adicionar<br/>Profissional</h1>
            </Titulo>

            <InputField textLabel="Email">
                <InputText value={email} handleInput={(e) => setEmail(e.target.value)} type="email"/>
            </InputField>

            <ButtonFull marginTop="20px" texto="Adicionar" handleAction={enviarSolicitacao}/>

            <NavBar/>

            {loading && <Loading/>}
        </div>
     );
}

export default AdicionarProfissional;