const request = require('request')

const forecast = (latitude, longtitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=476db87dd0d91255dab6d5b67c23d326&query='+ latitude +', '+ longtitude +'&units=m'
    request({url, json: true}, (error, {body}) =>{
        if(error){
            callback('Unable to connect to weather service', undefined)
        } else if(body.error) {
            callback('Unable to find location', undefined)
        }else {
            console.log(body.current)  
            callback(undefined,           
                body.current.weather_descriptions[0] + ". It is currently " +body.current.temperature + " but it feels like " +  body.current.feelslike + 
                " The humiduty is "+ body.current.humidity + "%."
            )
            
        }
    })
}
module.exports = forecast