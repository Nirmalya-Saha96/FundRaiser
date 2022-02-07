import React from 'react';


const SearchBox=({ searchChange })=>{
    return(
            <div className='pa2'>
                <input
                style={{padding: '10px', margin: '10px', backgroundColor: 'lightYellow'}}
                className='p-1 m-1 ba nirmalya-table'
                 type="search"
                 placeholder='search by name'
                 onChange={searchChange}/>
            </div>
        );
}

export default SearchBox;
