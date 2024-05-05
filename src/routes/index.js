import Home from '~/pages/Home';
import Login from '~/pages/Login';
import { HeaderOnly } from '~/components/Layouts';
import config from '~/config';
import Register from '~/pages/Register';
import Profile from '~/pages/Profile';
import CreateJob from '~/pages/CreateJob';
import { roles } from '~/helper/auth/role/role.enum';
import VerifyUser from '~/pages/VerifyUser';
import ResetPassword from '~/pages/ResetPassword';
import ForbiddenPage from '~/pages/ForbiddenPage';
import Dashboard from '~/pages/Dashboard';
import SearchResult from '~/pages/SearchResult';
import NoHeader from '~/components/Layouts/NoHeader';
import ChangingPasssword from '~/pages/ChangingPassword';
const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.login,
        component: Login,
        layout: HeaderOnly,
    },

    {
        path: config.routes.register,
        component: Register,
        layout: HeaderOnly,
    },
    {
        path: config.routes.verifyUser,
        component: VerifyUser,
        layout: HeaderOnly,
    },
    {
        path: config.routes.resetPassword,
        component: ResetPassword,
        layout: HeaderOnly,
    },
    {
        path: config.routes.unauthorized,
        component: ForbiddenPage,
        layout: NoHeader,
    },
    {
        path: config.routes.searchResult,
        component: SearchResult,
        layout: HeaderOnly,
    },
];
const privateRoutes = [
    {
        path: config.routes.profile,
        component: Profile,
        layout: HeaderOnly,
        allowedRoles: [roles.user, roles.admin],
    },
    {
        path: config.routes.createJob,
        component: CreateJob,
        layout: HeaderOnly,
        allowedRoles: [roles.user, roles.admin],
    },
    {
        path: config.routes.dashboard,
        component: Dashboard,
        layout: HeaderOnly,
        allowedRoles: [roles.user, roles.admin],
    },
    {
        path: config.routes.changingPassword,
        component: ChangingPasssword,
        layout: HeaderOnly,
        allowedRoles: [roles.user, roles.admin],
    },
];

export { publicRoutes, privateRoutes };
