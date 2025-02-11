import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MetaTags = () => {
  const location = useLocation();

  const updateMetaTags = (path) => {
    const routes = {
      '/': {
        title: 'ImageKit - Simple & Secure Image Upload and Sharing',
        description: 'Upload, store, and share your images securely. Fast uploads, encrypted storage, and easy sharing features.',
      },
      '/gallery': {
        title: 'Your Image Gallery - ImageKit',
        description: 'View and manage your uploaded images in one secure location.',
      },
      '/upload': {
        title: 'Upload Images - ImageKit',
        description: 'Quick and secure image upload with instant sharing capabilities.',
      },
      '/login': {
        title: 'Login - ImageKit',
        description: 'Sign in to access your secure image storage and sharing features.',
      },
    };

    const metadata = routes[path] || routes['/'];

    // Update meta tags
    document.title = metadata.title;
    document.querySelector('meta[name="description"]').setAttribute('content', metadata.description);
    document.querySelector('meta[property="og:title"]').setAttribute('content', metadata.title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', metadata.description);
    document.querySelector('meta[property="twitter:title"]').setAttribute('content', metadata.title);
    document.querySelector('meta[property="twitter:description"]').setAttribute('content', metadata.description);
  };

  useEffect(() => {
    updateMetaTags(location.pathname);
  }, [location]);

  return null;
};

export default MetaTags;
