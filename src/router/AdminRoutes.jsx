
import { Navigate } from 'react-router-dom';

import Acquisition from "../../pages/admin/Acquisition"
import Appointment from "../../pages/admin/Appointment"
import Article from "../../pages/admin/Article"
import Artifact from "../../pages/admin/Artifact"
import Dashboard from "../../pages/admin/Dashboard"
import Log from "../../pages/admin/Log"
import User from "../../pages/admin/User"
import AdminLayout from '../../components/layout/AdminLayout';

const AdminRoutes = [

    { index: true, element: <Navigate to='dashboard' replace /> },
    { path: '*', element: <Dashboard/> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'acquisition', element: <Acquisition /> },
    { path: 'appointment', element: <Appointment /> },
    { path: 'article', element: <Article /> },
    { path: 'artifact', element: <Artifact /> },
    { path: 'log', element: <Log /> },
    { path: 'user', element: <User /> }

]

export default AdminRoutes
