import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals';
import firebaseConfig from './firebaseConfig';
import 'react-toastify/dist/ReactToastify.css';
import { createBrowserRouter,RouterProvider} from "react-router-dom";
import Registration from './pages/registration';
import Login from './pages/login';
import Home from './pages/home';
import Forgetpass from './pages/forgetpassword';
import Message from './pages/message/Message';
import Profile from './pages/profile';
import Friends from './pages/friends';
import Group from './pages/group';
import Notification from './pages/notification';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/forgetpassword",
    element: <Forgetpass/>,
  },
  {
    path: "/registration",
    element: <Registration/>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/message",
    element: <Message />,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/friends",
    element: <Friends/>,
  },
  {
    path: "/group",
    element: <Group/>,
  },
  {
    path: "/notification",
    element: <Notification/>,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
