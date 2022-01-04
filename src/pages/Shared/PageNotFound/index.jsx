import { Link } from "react-router-dom";
import NextPageHeader from "../../../components/NxtPageHeader";
import './index.css';

const PageNotFound = () => {
    return <div className="ne-page-body ne-page-not-found">
        <NextPageHeader
            title="Page Not Found"
            icon="fas fa-exclamation-triangle"
            breadcrumb="404"
        />
        <div className="notfound">
            <div className="notfound-404">
                <div></div>
                <h1>404</h1>
            </div>
            <h2>Page not found</h2>
            <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
            <Link className="btn btn-light text-muted ml-0 btn-sm mt-3" to="/">
                <i className="fas fa-arrow-left mr-2"></i>
                <span>Dashboard</span>
            </Link>
        </div>
    </div>
}
export default PageNotFound;