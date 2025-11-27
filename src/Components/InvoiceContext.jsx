import React, { createContext, useState, useCallback, useMemo } from "react";

export const InvoiceContext = createContext(null);

function InvoiceContextProvider({ children }) {
    const defaultInvoiceData ={
        currency: { code: 'ZAR', locale: 'en-RSA', name: 'South African Rand', symbol: 'R' }, 
        invoiceDetails: {
            invoiceNumber: '',
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date().toISOString().split('T')[0], 
            company: {
                name: '',
                address: '',
            },
            client: {
                name: '',
                address: '',
            }
        },
        items: [
            {
                description: '', 
                quantity: 0, 
                unitPrice: 0.00,
                amount: 0.00,
            },
        ],
        note: {
            terms: '',
            additionalNote:'',
        },
        tax: {
            taxRate: 0,
            taxAmount:0,
        },
        discount:{
            discountRate:0,
            discount:0,
            },
        totalAmount: 0,
    }

    const [invoiceData, setInvoiceData] = useState(defaultInvoiceData);

    // Memoize computed values
    const computedValues = useMemo(() => {
        const subtotal = invoiceData.items.reduce((sum, item) => 
            sum + (item.quantity * item.unitPrice), 0);
        
        const discountAmount = subtotal * (invoiceData.discount.discountRate / 100);
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * (invoiceData.tax.taxRate / 100);
        const total = taxableAmount + taxAmount;

        return {
            subtotal,
            discountAmount,
            taxAmount,
            total
        };
    }, [invoiceData.items, invoiceData.discount.discountRate, invoiceData.tax.taxRate]);

    // Optimized setters with batched updates
    const updateInvoiceData = useCallback((updates) => {
        setInvoiceData(prev => ({ ...prev, ...updates }));
    }, []);

    const currency = useMemo(() => ({
        getCurrency: () => (invoiceData.currency),
        setCurrency: (currency) => updateInvoiceData({ currency })
    }), [invoiceData.currency, updateInvoiceData]);

    const items = useMemo(() => ({
        getItems: () => invoiceData.items,
        addItem: (lineItem) => {
            setInvoiceData(prev => ({
                ...prev,
                items: [...prev.items, lineItem]
            }));
        },
        updateItem: (index, field, value) => {
            setInvoiceData(prev => ({
                ...prev,
                items: prev.items.map((item, i) => 
                    i === index ? { ...item, [field]: value } : item
                )
            }));
        },
        removeItem: (index) => {
            setInvoiceData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        },
        clearItems: () => {
            setInvoiceData(prev => ({
                ...prev,
                items: [{
                    description: '', 
                    quantity: 0, 
                    unitPrice: 0.00,
                    amount: 0.00,
                }]
            }));
        }
    }), [invoiceData.items]);

    const tax = useMemo(() => ({
        getTaxRate: () => invoiceData.tax.taxRate,
        getTaxAmount: () => computedValues.taxAmount, // Use computed value
        setTaxRate: (taxRate) => {
            setInvoiceData(prev => ({
                ...prev,
                tax: { ...prev.tax, taxRate }
            }));
        }
    }), [invoiceData.tax.taxRate, computedValues.taxAmount]);

    const discount = useMemo(() => ({
        getDiscountRate: () => invoiceData.discount.discountRate,
        getDiscountAmount: () => computedValues.discountAmount, // Use computed value
        setDiscountRate: (discountRate) => {
            setInvoiceData(prev => ({
                ...prev,
                discount: { ...prev.discount, discountRate }
            }));
        }
    }), [invoiceData.discount.discountRate, computedValues.discountAmount]);

    const totalAmount = useMemo(() => ({
        getTotal: () => computedValues.total // Use computed value
    }), [computedValues.total]);

    const contextValue = useMemo(() => ({
        currency,
        invoiceDetails: {
            getDetails: ()=>(invoiceData.invoiceDetails),
            setDetails: (details) => updateInvoiceData({ invoiceDetails: details })
        },
        items,
        tax,
        discount,
        totalAmount,
        notes: {
            getNotes: invoiceData.note,
            setNotes: (note) => updateInvoiceData({ note })
        },
        computedValues, // Provide computed values
        reset: () => setInvoiceData(defaultInvoiceData)
    }), [
        currency,
        invoiceData.invoiceDetails,
        invoiceData.note,
        items,
        tax,
        discount,
        totalAmount,
        computedValues,
        updateInvoiceData
    ]);

    return (
        <InvoiceContext.Provider value={contextValue}>
            {children}
        </InvoiceContext.Provider>
    );
}

export default InvoiceContextProvider;