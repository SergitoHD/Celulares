"use client"
export const getFromLocalStorage = (key: string)=>{
    return JSON.parse(localStorage.getItem(key) as string);
}