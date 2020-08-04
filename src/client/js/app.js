/*Main Functions */

const postData = async( url = '', data = {}) => {
    const response = await fetch( url , {
        method: 'POST', 
        credentials:'same-origin', 
        headers: {
            'Content-Type' : 'application/json'
        }, 
        body: JSON.stringify(data),
    }); 
    try {
        return await response.json();
    } catch (error)
    {
        console.log ('error', error);
    }
}

const fetchData = async() => {
    const request = await fetch('http://localhost:8081/getData');
    try {
        return await (request.json());
    } catch (error){
        console.log('error', error);
    }
}


export {fetchData}
export {postData}