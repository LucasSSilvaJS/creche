import './input-text.css'

function InputText({value, handleInput, type}){
   return(
        <>
            <input type={type || 'text'} value={value} onChange={handleInput}/>
        </>
   ) 
}

export default InputText