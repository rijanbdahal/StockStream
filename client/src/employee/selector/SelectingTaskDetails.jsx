import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SelectingTaskDetails = () => {
    const navigate = useNavigate();
    const [taskId, setTaskId] = useState(null);
    const [storeId, setStoreId] = useState(null);
    const [totalCases, setTotalCases] = useState(0);
    const [totalStop, setTotalStop] = useState(0);
    const [totalPallets, setTotalPallets] = useState(0);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/selectingtask/details')
            .then(response => {
                setTotalPallets(response.data.totalPallets);
                setTaskId(response.data.taskId);
                setStoreId(response.data.storeId);
                setTotalCases(response.data.totalCases);
                setTotalStop(response.data.totalStop);
                setLoading(false); // Mark loading as false
            })
            .catch(error => {
                console.log(error);
                setError('Failed to fetch data.');
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`http://localhost:5000/selectingtask/${taskId}` )
            .then(response => {

                setLoading(false);

            })
            .catch(error => {
                console.log(error);
            })
        navigate('/selectingtask');
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <p>Task ID: {taskId}</p>
            <p>Store ID: {storeId}</p>
            <p>Total Cases: {totalCases}</p>
            <p>Total Stops: {totalStop}</p>
            <p>Total Pallets: {totalPallets}</p>
            <button type="button" onClick={handleSubmit}>Start Picking</button>
        </div>
    );
}

export default SelectingTaskDetails;
