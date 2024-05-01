import { useContext } from 'react';
import AuthContext from '~/helper/auth/context/AuthProvider';

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;
