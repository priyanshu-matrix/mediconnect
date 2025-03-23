import React from 'react'
import { Link } from "react-router-dom";

const Landing = () => {
  const userType = localStorage.getItem('accountType');
  const linkPath = userType === 'user' ? '/user-search' : '/shop-list';

  return (
    <div style={{ color: 'black' }}>
      <div style={{ textAlign: 'center', padding: '50px', background: '#005792' , borderRadius: '30px', width: '80%', margin: '0 auto', marginTop: '50px' }}>
        <h1 style={{ color: 'white', marginBottom: '16px' }}>MediConnect: Simplify Your Medicine Management</h1>
        <p style={{ color: 'white', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
        Join MediConnect today and easily manage your medicine stock! Whether personal or business, our platform helps you stay organized with real-time updates. Sign up now for a smarter, hassle-free inventory experience!
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
