import { useLocation } from 'react-router-dom';
import CustomHeader from './CustomHeader';

const Layout = ({ children }) => {
  const location = useLocation();

  // List of paths where CustomHeader should NOT appear
  const noHeaderPaths = [
    '/teachers',
    '/profileform',
    '/education',
    '/admin',
    '/experience',
    '/subjects',
    '/details',
    '/postjob',
    '/studentdashboard',
    '/professionals',
    /^\/teachers\/\d+$/, // Matches /teachers/:teacherId
    /^\/profile\/\d+$/,  // Matches /profile/:userId
    '/profile-info',
    '/client-messages',
    /^\/client-chat\/\d+$/,
  ];

  // Check if current path matches any in noHeaderPaths
  const shouldShowHeader = !noHeaderPaths.some(path => 
    typeof path === 'string' 
      ? path === location.pathname 
      : path.test(location.pathname)
  );

  return (
    <>
      {shouldShowHeader && <CustomHeader />}
      {children}
    </>
  );
};

export default Layout;