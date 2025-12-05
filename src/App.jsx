import { useState, useContext } from 'react'
import './App.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import InvoiceContextProvider from './Components/InvoiceContext';
import InvoiceForm from './Components/InvoiceForm';
import ImageSelector from './Components/ImageSelector'


function App() {

  return (
    <>
      <section className="header pt-3">
        <h1 className='head text-3xl text-center lg:text-start'>INVOICE GENERATOR</h1>
      </section>
      <section className="body bg-white my-2 p-2 w-full min-w-0">
        <InvoiceContextProvider>
        <div className="invoice-card">
          <div className='flex flex-col lg:flex-row space-x-2 py-2 align-center'>
            <div className='logo-container'>
              <ImageSelector />
            </div>
            <h2 className='text-5xl pt-2'>INVOICE</h2>
          </div>
          <InvoiceForm />
        </div>
        </InvoiceContextProvider>
      </section >
      <section className="footer">
        <p>© 2024 Invoice Generator. All rights reserved.</p>
      </section>
    </>
  )
}

export default App
