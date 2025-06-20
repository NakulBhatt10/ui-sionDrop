
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
    <div className="notfound-container">
        <h1>404</h1>
        <p>Oops! The page you’re looking for can’t be found.</p>
        <Link to="/home" className="btn btn-primary">
            Go Home
        </Link>
    </div>
);

export default NotFound;
