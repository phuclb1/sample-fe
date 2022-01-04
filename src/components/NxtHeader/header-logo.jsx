import React from "react";
import { Link } from "react-router-dom";
const NxtHeaderLogo = () => {
    return <Link className="ne-logo mr-auto" to={'/'}>
        <img className="ne-logo-image lightmode" height="150" src="/images/simplex-logo.png" alt="Simplex AI Services" />
        <img className="ne-logo-image darkmode" height="150" src="/images/simplex-logo.png" alt="Simplex AI Services" />
    </Link>
}
export default NxtHeaderLogo