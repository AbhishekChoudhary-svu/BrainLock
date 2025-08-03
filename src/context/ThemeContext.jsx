"use client"

import MyContext from "./ThemeProvider"

const ThemeProvider = ({children})=>{

  let  values = {
        name:"Abhishek",

    };

    return (
        <MyContext.Provider value = {values}>
            {children}
        </MyContext.Provider>
    )
}

export default ThemeProvider;