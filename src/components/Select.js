import React, {useEffect, useState} from "react"

const Select = props => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(props.value || "");

    useEffect(() => {
        let result = "";
        props.options.forEach(option => {
            if (option.value === props.value) {
                result = option.label
            }
        })
        setValue(result)
    }, [props])

    const onSelectOption = (option) => {
        setIsOpen(false);
        props.onChange(option.value);
    }

    return (
        <div className={"select"}>
            <input className={"select__value"} value={value} readOnly={true} onClick={() => setIsOpen(!isOpen)}/>
            <div className={"select__options"}>
                {
                    isOpen && props.options && props.options.map(option => {
                        return <div key={option.value} onClick={() => onSelectOption(option)} className={"option"}>
                            {option.label}
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Select