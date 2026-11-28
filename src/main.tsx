import './index.css';

const root = document.getElementById('root');
const hasPrerenderedPage = Boolean(root?.querySelector('.prerendered-article, .prerendered-category'));

if (root && !hasPrerenderedPage) {
  // Keep the existing hash-router fallback for paths that do not have a static page.
  const routeParts = window.location.pathname.split('/').filter(Boolean).map(part => {
    try {
      return decodeURIComponent(part);
    } catch {
      return part;
    }
  });

  if (routeParts.length >= 2 && !window.location.hash) {
    window.location.hash = '#/' + routeParts.slice(0, 2).map(encodeURIComponent).join('/');
  }

  Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./App.tsx')
  ]).then(([React, ReactDOM, AppModule]) => {
    ReactDOM.createRoot(root).render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(AppModule.default)
      )
    );
  }).catch(error => {
    console.error('No se pudo iniciar Comunicadores Libres:', error);
    const fallback = root.querySelector('.prerendered-home-fallback');
    if (fallback) {
      const notice = document.createElement('p');
      notice.setAttribute('role', 'alert');
      notice.textContent = 'La versión interactiva no se pudo iniciar. Podés seguir leyendo las publicaciones con los enlaces de esta página.';
      fallback.appendChild(notice);
    } else {
      root.setAttribute('role', 'alert');
      root.textContent = 'No se pudo cargar la aplicación. Actualizá la página o volvé al inicio.';
    }
  });
}
