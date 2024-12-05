import React from 'react';

const Link = ({ href, children, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault();
    // Aquí puedes agregar lógica de enrutamiento si es necesario
    window.history.pushState({}, '', href);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;