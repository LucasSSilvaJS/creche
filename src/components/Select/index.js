import './select.css'

function Select({values, actualValue, handleSelect}) {

    return (
        <>
            <select value={actualValue} onChange={handleSelect}>
                {values.map((value, index) => {
                    return(
                        <option key={index} value={index}>{value}</option>
                    )
                })}
            </select>
        </>
    )
}

export default Select;