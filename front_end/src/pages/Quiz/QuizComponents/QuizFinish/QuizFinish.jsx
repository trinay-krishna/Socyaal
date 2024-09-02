import Timer from "../../../../components/Timer/Timer";

export default function QuizFinish( { endDate, onTimeUp } ) {

return(
    <div>
        <p>Quiz Finished!</p>

        {
            ( Date.now() < endDate ) ? 
            <div>
                <p>Full leaderboard and offline play will be available after quiz ends!</p>
                <p>Time Left for Quiz: </p>
                <Timer endTime={endDate} onTimeUp={onTimeUp} />
            </div> :
            <div>
                <button>Play offline?</button>
                <button>Leaderboard</button>
                
            </div>
        }
    </div>
)

}