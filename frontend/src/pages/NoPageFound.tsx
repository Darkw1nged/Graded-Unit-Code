import React from 'react';
import { Link } from "react-router-dom"
import '../style/no-page-found.css'

const previosPage = () => {
  window.history.back();
}

const Page = () => {
  return (
    <div className="no-page-found">
      <div className="container">
        <div className="content">
            <h1>page not found</h1>
            <hr />
            <p>Sorry, the page you are looking for could not be found.</p>
            
            <Link to="/">Home</Link>
            <a onClick={previosPage}>Back</a>
        </div>
      </div>
    </div>
  )
};

export default Page;