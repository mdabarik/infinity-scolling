import { createBrowserRouter } from 'react-router-dom';
import Main from '../layouts/Main';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import ImageGalary from '../pages/ImageGalary';


const routes = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/about',
                element: <h3>This is about page</h3>
            },
            {
                path: '/galary',
                element: <ImageGalary></ImageGalary>
            }
        ]
    }
])

export default routes;
