import React from 'react';

import {useNavigate} from 'react-router-dom';
import Header from "../../components/includes/Header.jsx";

const ReadyPage = () =>{

    const navigate = useNavigate();

    const HandleReadyButton = async (e:React.FormEvent) => {
        e.preventDefault();
        navigate('/selectingtaskdetails');
    }

    return(
        <div>
            <Header/>
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