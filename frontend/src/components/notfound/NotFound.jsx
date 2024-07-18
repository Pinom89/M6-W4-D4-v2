import React from 'react'
import SuperMario from './SuperMario'
export default function NotFound() {
  return (
   
    <div className='container'>
        <div className='row'>
            <div className='col-md-12 mt-5'>
                <h1 className='text-center' style={{color:'red'}}>PAGE NOT FOUND</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        </div>
        <div><SuperMario/></div>

   </div>


  )
}
