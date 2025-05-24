import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupInterceptors } from '../api/http';

const InterceptorProvider = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setupInterceptors(navigate);
    }, [navigate]);

    return null;
}

export default InterceptorProvider;