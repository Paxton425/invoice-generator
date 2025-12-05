import React, { useState, useRef, useContext } from 'react';
import { InvoiceContext } from './InvoiceContext';

function ImageSelector({ onImageSelect, initialImage = null }) {

    
    const logoImageContext = useContext(InvoiceContext).logoImageUrl;
    //console.log('logo Image Context: ', useContext(logoImageContext));
    
    const imagePreviewUrl = logoImageContext.getImageUrl();
    const setImagePreviewUrl = (url = initialImage)=>{
        logoImageContext.setImageUrl(url);
    }
    const fileInputRef = useRef(null);

    const handleImageChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            console.log('selected image url:', previewUrl)
            setImagePreviewUrl(previewUrl);
             
            if (onImageSelect) {
                onImageSelect(file, previewUrl);
            }
        } else {
            handleRemoveImage();
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageChange(file);
        }
    };

    const handleRemoveImage = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImagePreviewUrl(null);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        
        if (onImageSelect) {
            onImageSelect(null, null);
        }
    };

    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div 
            className="invoice-logo"
            onClick={handleContainerClick}
            style={{ cursor: 'pointer' }}>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            
            {imagePreviewUrl ? (
                <div className='w-100 flex items-center bt-blue-44'>
                    <img
                        src={imagePreviewUrl}
                        alt="Company logo"
                        style={{ 
                            maxWidth: '160px', 
                            maxHeight: '128px', 
                            objectFit: 'contain' 
                        }}
                    />
                    <button
                        className="remove-image-button"
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // This prevents the click from reaching the container
                            handleRemoveImage();
                        }}
                    >
                        ×
                    </button>
                </div>
            ) : (
                <>
                    <p className='text-[#7c7c7c] text-2xl ml-4 mt-4'>+Add Logo</p>
                </>
            )}
        </div>
    );
}

export default ImageSelector;