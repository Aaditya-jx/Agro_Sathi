import { useEffect } from 'react';
import { App } from '@capacitor/app';
import { useNavigate, useLocation } from 'react-router-dom';

export const BackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBackButton = () => {
      const currentPath = location.pathname;
      
      // Define routes that should exit the app when back is pressed
      const exitRoutes = ['/dashboard'];
      
      if (exitRoutes.includes(currentPath)) {
        // Exit the app if on main dashboard routes
        App.exitApp();
      } else {
        // Navigate back for other routes
        navigate(-1);
      }
      
      return true; // Prevent default back button behavior
    };

    // Add back button listener
    const backButtonListener = App.addListener('backButton', handleBackButton);

    // Cleanup listener when component unmounts
    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
};
