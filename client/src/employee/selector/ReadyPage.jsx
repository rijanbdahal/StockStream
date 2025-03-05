import React from 'react';

import {useNavigate} from 'react-router-dom';

const ReadyPage = () =>{

    const navigate = useNavigate();

    const HandleReadyButton = async (e:React.FormEvent) => {
        e.preventDefault();
        navigate('/selectingtaskdetails');
    }

    return(
        <div>
            <form onSubmit={HandleReadyButton}>
                <div class="form-group">
                    <label>Start Picking</label>
                    <button type="submit">Start</button>
                </div>
            </form>
        </div>
    );
}

export default ReadyPage;