import React from "react";
import { useSelector } from "react-redux";
import './index.css';
const NxtFooter = () => {
  const userConfigs = useSelector(state => state.user.userConfigs);
  const currentYear = new Date().getFullYear();
    return <footer id="footer" className="ne-footer">
        <span className="text-uppercase d-none d-md-block">Simplex AI- Version {userConfigs?.__version__?.version || '1.0.0'}</span>
        <span>Copyright &copy;{currentYear} by SimpleX AI</span>
    </footer>
}
export default NxtFooter