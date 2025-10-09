"use client";
import React, { useEffect } from 'react'

const SettingStorage = () => {
    useEffect(() => {
        // Get all cookies as string
        const cookies = document.cookie
        // Find the one named "user"
        const userCookie = cookies
            .split('; ')
            .find(row => row.startsWith('User='))
            ?.split('=')[1]

        if (userCookie) {
            try {
                const user = JSON.parse(decodeURIComponent(userCookie))
                localStorage.setItem('user', JSON.stringify(user))
                console.log('User saved to localStorage:', user)
            } catch (err) {
                console.error('Error parsing user cookie:', err)
            }
            document.cookie = 'User=; Max-Age=0; path=/;'
        } else {
            console.log('User cookie not found')
        }

    }, [])
    return (
        <div></div>
    )
}

export default SettingStorage