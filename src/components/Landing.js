import React from 'react'
import { Link } from "react-router-dom";

const Landing = () => {
  const userType = localStorage.getItem('accountType');
  const linkPath = userType === 'user' ? '/user-search' : '/shop-list';

  return (
    <div style={{ textAlign: 'center', padding: '50px', background: '#005792' , borderRadius: '30px', width: '80%', margin: '0 auto', marginTop: '50px' }}>
      <div style={{ textAlign: 'center', padding: '50px', background: '#005792' , borderRadius: '30px', width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <h1 style={{ color: 'white', marginBottom: '16px' }}>Go Green, Live Clean</h1>
        <p style={{ color: 'white', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Every small step toward a more sustainable lifestyle makes a big difference. 
          Join us in protecting our planet for future generations. 
        </p>
        <Link to={localStorage.getItem('token') ? linkPath : '/signup'}>
          <button
            className='btn btn-success my-5'
            style={{ padding: '10px 30px', fontSize: '1.2rem' }}
          >
            Explore
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Landing
