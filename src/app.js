const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


// Define paths for Express config
const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// port for heroku
const port = process.env.PORT || 3000

// Set up handle bars
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to serve
app.use(express.static(publicDirectoryPath))

// Set up routes for web pages
app.get('', (req, res) => {
    res.render('index',{
        title: 'Weather',
        name: 'Adam Mcdel'
    })
})

app.get('/about', (req, res) =>{
    res.render('about', {
        title: 'About Me',
        name:'Adam Mcdel'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title:'Help',
        helpText : 'This is some helpful text',
        name: 'Adam Mcdel'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        })
    }
    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => {
        if (error) {
            return res.send({ error })            
        } else {
            forecast(latitude, longtitude, (forecastError, forecastData) => {
                if(forecastError) {
                    return res.send({ forecastError })
                }
                else {
                    res.send({
                        forecast: forecastData,
                        location,
                        address: req.query.address
                    })
                }
            })
        }
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    res.send({
        product: [],
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Adam Mcdel',
        errorMessage: 'Help article is not found'
    })
})

// Set up 404 Page must be define at the end of the app
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Adam Mcdel',
        errorMessage: '404 Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port:' + port)
})