import React from "react";
import Loader from 'react-loader-spinner'

const Preloader = () => {
    return (
        <div className={"loader"}>
            <Loader
                type="TailSpin"
                color="#34B9E0"
                height={100}
                width={100}
                timeout={0}
            />
        </div>
    )
}

export default Preloader