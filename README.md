- Check the deployed app here: http://air-pollution-india.herokuapp.com/
- *note: It might take sometime to reload the pollution data at once as it takes time to fetch the data from the API.*
*The data once fetched from API is stored in the local storage of the browser, so as to reduce the load time for the next time you open the app.*
*Since the AQI Data also updates once in an hour, this step seems logical.*

# How to make it work:

- clone the repo.
- Add the following file to src folder
```config.json```

- To config.json add this:
```
{
    "BASE_URL" : "http://api.airpollutionapi.com/1.0/aqi",
    "API_KEY" : "YOUR API KEY"
}
```

- Once done, do ```npm install``` followed by ```npm start```
