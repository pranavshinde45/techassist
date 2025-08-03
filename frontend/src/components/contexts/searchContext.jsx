import React, { createContext, useState } from 'react';

export const searchContext=createContext();

export const SearchProvider=({children})=>{
    const [searchText,setSearchText]=useState("");

    const value={searchText,setSearchText}
    return(
        <searchContext.Provider value={value}>
        {children}
        </searchContext.Provider>
    )
}