import { useEffect, useRef, useState } from "react";

export default function Timer( { endTime, onTimeUp } ) {

    const [ time, setTime ] = useState( Math.max( Math.max( Math.floor( (endTime - Date.now())/1000), 0 ) ) );
    const intervalRef = useRef(null);

    useEffect( () => {

        function updateTime() {
            const timeInMs = endTime - Date.now();
            const timeInSeconds = Math.max( Math.floor(timeInMs/1000), 0 );
            console.log(timeInSeconds);
            if ( intervalRef.current && timeInSeconds === 0 ) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                onTimeUp();
            }
            setTime(() => timeInSeconds);

        }

        updateTime();

        intervalRef.current = setInterval( () => {
            updateTime();

        }, 1000 );

        return () => {
            if ( intervalRef.current ) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

    }, [ endTime, onTimeUp ] );

    return (
        <div>
            Time Left:- {time}
        </div>
    )

}