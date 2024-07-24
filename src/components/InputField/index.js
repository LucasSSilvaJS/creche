import './input-field.css'

function InputField({children, textLabel}){
    return(
        <div className="input-field">
            <label>{textLabel}</label>
            {children}
        </div>
    )
}

export default InputField