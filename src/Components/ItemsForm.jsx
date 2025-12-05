import React, { useState, useCallback, useContext, useEffect, memo, useRef } from 'react';
import { InvoiceContext } from './InvoiceContext';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import PlusIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { NumericFormat } from 'react-number-format';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// Create a memoized row component with ALL props memoized
const MemoizedTableRow = memo(({ item, index, onUpdateItem, onRemoveItem, currency }) => {
    console.log(`Row ${index} rendering`);
    
    const descriptionRef = useRef(null);
    const [localDescription, setLocalDescription] = useState(item.description || '');
    const [localQuantity, setLocalQuantity] = useState(item.quantity || 0);
    const [localUnitPrice, setLocalUnitPrice] = useState(item.unitPrice || 0);
    
    // Update local state when item changes from parent
    useEffect(() => {
        setLocalDescription(item.description || '');
        setLocalQuantity(item.quantity || 0);
        setLocalUnitPrice(item.unitPrice || 0);
    }, [item.description, item.quantity, item.unitPrice]);
    
    // Blur handlers with debounce
    const handleDescriptionBlur = useCallback((e) => {
        if (e.target.value !== item.description) {
            onUpdateItem(index, 'description', e.target.value);
        }
    }, [index, item.description, onUpdateItem]);
    
    const handleQuantityBlur = useCallback((e) => {
        const value = parseFloat(e.target.value) || 0;
        if (value !== item.quantity) {
            onUpdateItem(index, 'quantity', value);
        }
    }, [index, item.quantity, onUpdateItem]);
    
    const handleUnitPriceBlur = useCallback((e) => {
        const value = parseFloat(e.target.value) || 0;
        if (value !== item.unitPrice) {
            onUpdateItem(index, 'unitPrice', value);
        }
    }, [index, item.unitPrice, onUpdateItem]);
    
    // Immediate update handlers (still causes re-render but less frequent)
    const handleDescriptionChange = useCallback((e) => {
        setLocalDescription(e.target.value);
        // Debounce the context update
        setTimeout(() => {
            onUpdateItem(index, 'description', e.target.value);
        }, 300);
    }, [index, onUpdateItem]);
    
    const handleQuantityChange = useCallback((e) => {
        const value = parseFloat(e.target.value) || 0;
        setLocalQuantity(value);
        setTimeout(() => {
            onUpdateItem(index, 'quantity', value);
        }, 300);
    }, [index, onUpdateItem]);
    
    const handleUnitPriceChange = useCallback((e) => {
        const value = parseFloat(e.target.value) || 0;
        setLocalUnitPrice(value);
        setTimeout(() => {
            onUpdateItem(index, 'unitPrice', value);
        }, 300);
    }, [index, onUpdateItem]);
    
    const handleRemove = useCallback(() => {
        onRemoveItem(index);
    }, [index, onRemoveItem]);

    return (
        <StyledTableRow>
            <StyledTableCell sx={{ width:'55%', padding:1 }} component="th" scope="row">
                <TextField 
                    inputRef={descriptionRef}
                    className='lineItemTextfield'
                    label="description" 
                    style={{minWidth : '260px', width: '100%', margin: 0}}
                    value={localDescription}
                    onChange={handleDescriptionChange}
                    onBlur={handleDescriptionBlur}
                    size='small' 
                    variant="standard" 
                    slotProps={{
                        input: {
                            style: {
                                padding: '0 0 0 6px'
                            }
                        } 
                    }}
                />
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ width:'10%', padding:1}}>
                <TextField 
                    style={{width: '100%', margin: 0,}}
                    label='quatity'
                    type="number" 
                    value={localQuantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    size='small' 
                    variant="standard" 
                    inputProps={{ 
                        min: 0,
                        step: 1,
                    }}
                    slotProps={{
                        input: {
                            style: {
                                padding: '0 0 0 6px'
                            }
                        } 
                    }}
                />
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ padding:1, width:'20%', }}>
                <TextField 
                    style={{width: '100%', margin: 0}}
                    label="Price/Rate"
                    type="number"
                    inputProps={{ 
                        min: 0.00,
                        step: 0.01
                    }}
                    value={localUnitPrice}
                    onChange={handleUnitPriceChange}
                    onBlur={handleUnitPriceBlur}
                    size='small' 
                    variant="standard" 
                    slotProps={{
                        input: {
                            style: {
                                padding: '0 0 0 6px'
                            }
                        } 
                    }}
                />
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ padding:1, width:'15%', }}>
                <NumericFormat 
                    style={{width: '100%', margin: 0}}
                    value={(localUnitPrice) * (localQuantity)}
                    prefix={currency.symbol} 
                    displayType="text"
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={true}
                />
            </StyledTableCell>
            <StyledTableCell align="right">
                <Button 
                    onClick={handleRemove}
                    size='small'
                    sx={{
                        minWidth: 'auto',
                        width: 'fit-content',
                        padding: '8px'
                    }}
                    startIcon={
                        <ClearIcon sx={{ 
                            color: '#7c7c7c', 
                            '&:hover': { color: 'red' } 
                        }} />
                    }
                />
            </StyledTableCell>
        </StyledTableRow>
    );
}, (prevProps, nextProps) => {
    // Custom comparison function - only re-render if specific props changed
    return (
        prevProps.item.description === nextProps.item.description &&
        prevProps.item.quantity === nextProps.item.quantity &&
        prevProps.item.unitPrice === nextProps.item.unitPrice &&
        prevProps.index === nextProps.index &&
        prevProps.currency.symbol === nextProps.currency.symbol
    );
});

MemoizedTableRow.displayName = 'MemoizedTableRow';

function ItemsForm() {
    console.log('ItemsForm rendering');

    const initialLineItem = {
        description: '', 
        quantity: 0, 
        unitPrice: 0.00,
        amount: 0.00,
    };
    
    const invoiceContext = useContext(InvoiceContext);
    const currency = invoiceContext.currency.getCurrency();
    const itemsContext = invoiceContext.items;
    
    // Get lineItems directly without triggering re-renders unnecessarily
    const [lineItems, setLineItems] = useState(() => itemsContext.getItems());
    
    // Update local state when context changes
    useEffect(() => {
        const newItems = itemsContext.getItems();
        setLineItems(newItems);
    }, [itemsContext]);

    const addItem = useCallback(() => {
        itemsContext.addItem(initialLineItem);
    }, [itemsContext]);

    // Use useCallback with all dependencies
    const updateItem = useCallback((index, field, value) => {
        console.log(`Updating item ${index}, ${field}: ${value}`);
        itemsContext.updateItem(index, field, value);
    }, [itemsContext]);

    const removeItem = useCallback((index) => {
        itemsContext.removeItem(index);
    }, [itemsContext]);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="customized table">
                    <TableHead> 
                        <TableRow>
                            <StyledTableCell>Item</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Unit Price</StyledTableCell>
                            <StyledTableCell align="center">Amount</StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.map((item, index) => (
                            <MemoizedTableRow 
                                key={`${index}`} // Simpler key
                                item={item}
                                index={index}
                                onUpdateItem={updateItem}
                                onRemoveItem={removeItem}
                                currency={currency}
                            />
                        ))}
                        <StyledTableRow>
                            <StyledTableCell colSpan={5} align="left">
                                <Button 
                                    onClick={addItem}
                                    variant="contained" 
                                    size="small"
                                    color='primary'
                                    sx={{
                                        borderRadius: 100,
                                    }}
                                >
                                    <PlusIcon sx={{ mr: 1 }} /> Line Item
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default React.memo(ItemsForm);