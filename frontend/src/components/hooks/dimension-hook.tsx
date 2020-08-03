import { useState, useEffect } from 'react';

export const useDimension = () => {
    const [dimensions, setDimensions] = useState(() => { 
        if (window.innerWidth > 1000) {
            return {
                height: 400,
                width: 600
            }
        } else if (window.innerWidth > 800) {
            return {
                height: 300,
                width: 400
            }
        } else if (window.innerWidth > 600) {
            return {
                height: 300,
                width: 400
            }
        } else if (window.innerWidth > 400) {
            return {
                height: 280,
                width: 350
            }
        } else {
            return {
                height: 200,
                width: 300
            }
        }
    })

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 1000) {
                setDimensions({
                    height: 400,
                    width: 600
                })
            } else if (window.innerWidth > 800) {
                setDimensions({
                    height: 300,
                    width: 400
                })
            } else if (window.innerWidth > 600) {
                setDimensions({
                    height: 300,
                    width: 400
                })
            } else if (window.innerWidth > 400) {
                setDimensions({
                    height: 280,
                    width: 350
                })
            } else {
                setDimensions({
                    height: 200,
                    width: 300
                })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    });

    return dimensions;
}