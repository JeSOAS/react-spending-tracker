import React, { useState } from 'react'
import spendingCategories from '../spending_data.json';
import '../styles.css'

export default function Journal() {

    const [date, setDate] = useState('')
    const [category, setCategory] = useState("")
    const [customCategory, setCustomCategory] = useState("")
    const [amountVal, setAmountVal] = useState('')
    const [recordsList, setRecordsList] = useState([])
    const [cats, updateCats] = useState(spendingCategories);

    function addCustomCat() {
        const newName = customCategory.trim();

        if(newName && !cats.some(c => c.category.toLowerCase() === newName.toLowerCase())) {
            const freshCategory = {
                spending_id: Date.now(),
                category: newName,
                description: newName
            }
            updateCats([...cats, freshCategory])
            setCategory(newName)
            setCustomCategory('')
        } else {
            alert('Please enter a unique category name');
        }
    }

    const handleFormSubmit = (ev) => {
        ev.preventDefault();

        if (!date || !category || !amountVal) {
            alert("Please fill out all fields")
            return;
        }

        if (isNaN(amountVal) || Number(amountVal) <= 0){
            alert("Please enter a valid positive amount");
            return
        }

        const entry = {
            id: Date.now(),
            date: date,
            category: category,
            amount: Number(amountVal),
        }

        setRecordsList([...recordsList, entry]);
        setDate("")
        setCategory('')
        setAmountVal("")
    }

    return (
        <div className="dashboard-container" style={{display:'flex',flexWrap:"wrap", justifyContent: "center",alignItems:"center",gap:"16px",marginBottom:30}}>
            <h1 className='dashboard-title'>Journal - Add Spending Record</h1>

            <form onSubmit={handleFormSubmit} style={{display: 'flex', flexDirection:'column', gap:'1.5rem'}}>
                
                <label style={{color: '#c9d1d9'}}>
                    Date:
                    <input 
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '.5rem',
                            marginTop: '0.5rem',
                            borderRadius: 4,
                            border: '1px solid #444',
                            backgroundColor: '#161b22',
                            color: '#c9d1d9'
                        }}
                    />
                </label>

                <label style={{color: '#c9d1d9'}}>
                    Category:
                    <select
                        value={category}
                        onChange={(ev) => setCategory(ev.target.value)}
                        style={{
                            width: '100%',
                            padding: '.5rem',
                            marginTop: '.5rem',
                            borderRadius: 4,
                            border: '1px solid #444',
                            backgroundColor: '#161b22',
                            color: '#c9d1d9'
                        }}
                        required
                    >
                        <option value="" disabled>-- Select Category --</option>
                        {cats.map(c => (
                            <option key={c.spending_id} value={c.category}>
                                {c.category}
                            </option>
                        ))}
                    </select>
                </label>

                <div style={{display:"flex", gap:8, alignItems:'center'}}>
                    <input
                        type="text"
                        placeholder="Add new category"
                        value={customCategory}
                        onChange={e=>setCustomCategory(e.target.value)}
                        style={{ flex:1, padding:'0.5rem', borderRadius:4, border:'1px solid #444', backgroundColor:'#161b22', color:'#c9d1d9' }}
                    />
                    <button
                        type="button"
                        onClick={addCustomCat}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#238636',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >Add</button>
                </div>

                <label style={{color:'#c9d1d9'}}>
                    Amount:
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={amountVal}
                        onChange={(e)=>setAmountVal(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            marginTop: '.5rem',
                            borderRadius: 4,
                            border: '1px solid #444',
                            backgroundColor: '#161b22',
                            color: '#c9d1d9'
                        }}
                    />
                </label>

                <button
                    type='submit'
                    style={{
                        padding: '.75rem',
                        fontSize: '1.1rem',
                        backgroundColor: '#238636',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer'
                    }}
                >
                    Add Record
                </button>
            </form>

            {recordsList.length > 0 &&
                <div style={{marginTop: 40}}>
                    <h2 style={{color: '#58a6ff', textAlign:'center', marginBottom: 20}}>Entered Records</h2>
                    <table style={{width:'100%', borderCollapse:'collapse', color:'#c9d1d9'}}>
                        <thead>
                            <tr>
                                <th style={{borderBottom:'1px solid #444', padding:8}}>Date</th>
                                <th style={{borderBottom:'1px solid #444', padding:8}}>Category</th>
                                <th style={{borderBottom:'1px solid #444', padding:8}}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recordsList.map(r => (
                                <tr key={r.id} style={{borderBottom:'1px solid #444'}}>
                                    <td style={{padding:8}}>{r.date}</td>
                                    <td style={{padding:8}}>{r.category}</td>
                                    <td style={{padding:8}}>${r.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}
