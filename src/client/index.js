import { postData }  from './js/app'
import {fetchData} from './js/app'

document.getElementById('generate').addEventListener('click', (event) => {
    const city = document.querySelector('#city').value;
    if (city===""){ 
        alert("City not entered");
    }
    const start = document.querySelector('#start').value; 
    const end = document.querySelector('#end').value; 
    postData('http://localhost:8081/addEntry', {city: city, start: start, end: end}).then(fetchData).then((res) => {
        console.log(res);
        let info = document.querySelector('#date p');
        let img = document.querySelector('#img img');
        let temperature = document.querySelector('#temp p');
        if (info===null) {
            info = document.createElement('p');
            document.querySelector('#date').appendChild(info);
        }
        if ( img===null) {
            img = document.createElement('img');
            document.querySelector('#img').appendChild(img);
        }
        if (temperature===null){
            temperature = document.createElement('p');
            document.querySelector('#temp').appendChild(temperature);
        }
        info.innerText = `Your ${res.length}-day trip to ${res.city} is ${res.away} day(s) away.`;
        img.src = res.img; 
        temperature.innerText = `The typical temperature for your trip is between ${res.min_temp} and ${res.max_temp}`;
    });
});



export { postData }
