"use client"
export const setInLocalStorage = (key: string, value: any)=>{
    return localStorage.setItem(key, JSON.stringify(value));
}