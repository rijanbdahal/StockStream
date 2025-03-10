import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../../components/includes/Header.jsx";

const SelectingTaskGo = () => {
    const [gotoLocation, setGotoLocation] = React.useState('');
    const [quantity, setQuantity] = React.useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('/selectingtaskgo')
            .then(res => {
                setGotoLocation(res.data.locationId);
                setQuantity(res.data.quantity);
            }).catch(error => console.log(error));

    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/selectingtaskpick');
    }

    return (
        <div>
            <Header />

        </div>
    )
};
export default SelectingTaskGo;