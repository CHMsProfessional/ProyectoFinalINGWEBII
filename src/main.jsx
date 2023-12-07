import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ClientLogin from './pages/ClientLoginAndRegister/ClientLogin';
import ClientRegister from "./pages/ClientLoginAndRegister/ClientRegister.jsx";
import PremiseList from "./pages/Premises/PremiseList.jsx";
import PremiseDetails from "./pages/Premises/PremiseDetails.jsx";
import ReservationsList from "./pages/Reservations/ReservationsList.jsx";
import PremiseForm from "./pages/Premises/PremiseForm.jsx";
import PremiseOwnerList from "./pages/Premises/PremiseOwnerList.jsx";
import ReservationsOwnerList from "./pages/Reservations/ReservationsOwnerList.jsx";
import Welcome from './pages/Welcome';
import ProfilePicture from "./pages/Premises/ProfilePicture.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome/>,
  },
  {
    path: '/clients/login',
    element: <ClientLogin/>
  },
  {
    path: '/clients/register',
    element: <ClientRegister/>
  },
  {
    path: '/premises/list',
    element: <PremiseList/>
  },
  {
    path: '/premises/:id',
    element: <PremiseDetails/>
  },
  {
    path: '/reservations/:id',
    element: <ReservationsList/>
  },
  {
    path: '/premises/owner/:id',
    element: <PremiseOwnerList/>
  },
  {
    path: '/premises/owner/create',
    element: <PremiseForm/>
  },
  {
    path: '/premises/owner/create/:id',
    element: <PremiseForm/>
  },
  {
    path: '/premises/:id/profile-picture',
    element: <ProfilePicture/>
  },
  {
    path: '/premises/owner/evaluate/:id', // listar para un cliente
    element: <ReservationsOwnerList/>
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
