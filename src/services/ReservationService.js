import axios from "axios";

export const getListaReservations = (id) => {
    return new Promise((resolve, reject) => {
        axios.get('http://127.0.0.1:8000/api/reservations/owner/'+id ,  {
            headers: {
                'Authorization': `${localStorage.getItem('token')}`
            }
        })
            .then((response) => {
                resolve(response.data);
            }).catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}