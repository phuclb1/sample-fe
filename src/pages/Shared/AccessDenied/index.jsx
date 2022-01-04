import { Link } from "react-router-dom";
import NextPageHeader from "../../../components/NxtPageHeader";
import './index.css';

const AccessDeniedPage = () => {
    return <div className="ne-page-body ne-page-not-found">
        <NextPageHeader
            title="Access Denied"
            icon="fas fa-exclamation-triangle"
            breadcrumb="403"
        />
        <div className="access-denied">
            <div className="access-denied-403">
                <div></div>
                <h1>403</h1>
            </div>
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.<br/>Please check your credentials and try again.</p>
            <Link className="btn btn-light text-muted ml-0 btn-sm mt-3" to='/'>
                <i className="fas fa-arrow-left mr-2"></i>
                <span>Dashboard</span>
            </Link>
        </div>
    </div>
}
export default AccessDeniedPage;