# USC Homework-14 GeoMapping
**GeoMapping** homework for USC Data Analytics Bootcamp  
The github repo for this code is located [here][1].

### Important points:

- This project is a Leaflet map with earthquake marker overlays. 
- The source for the data is an API request to the United States Geological Survey (USGS). The link is [here][2]
- This software requires a Mapbox access token in the static/js/config.js file. You can create a Mapbox account [here][3]  
- The USGS api request is for data looking back at a timespan of a month. It shows seismic activity approximately over 2.5 on the richter scale.
- Earthquake markers are sized and colored in relation to the magnitude of each event.
- Tooltips are generated for earthquake data when you hover over an earthquake location.
- A timeline function is provided to see data populate in a time sequence. When the timeline is paused you are viewing a sample of data that is generated based on stepping through each seismic event data point.
- Timeline sample sizes are based on a list with in a relative time of current event being populated. It is hard coded in miliseconds in 'timelineLayer' in logic.js file approximately code line 225.
- To **run visualization** you can either use:  
 *  `python -m http.server` if you have python3
 	 - This will host the page at `localhost:8000` in your web browser.
 *  **or** VS Code `Open with Live Server` (right click .html file).  
 	 - This will host the page in web browser at `localhost:5500` or next available port.
- Timeline sequence implemented using the Timeline plugin.  
	- available on the Leaflet [home page](https://leafletjs.com "leafletjs.com"), under the 'Plugins, Time & elevation' selections. Source code [here](https://github.com/skeate/Leaflet.timeline).




### Useful Resources
L controls tutorial [click here!][3]

[2]: http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php "USGS Link"
[3]: https://www.mapbox.com.
[4]: https://usabilityetc.com/2016/06/how-to-create-leaflet-plugins/

### This is the information provided by Trilogy Education Services as the basis for the project.
## Unit 17 | Visualizing Data with Leaflet

### Background

![1-Logo](Images/1-Logo.png)

Welcome to the United States Geological Survey (USGS)! The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

This project is to be a new tool for visualizing their earthquake data. The USGS collects a massive amount of data from all over the world each day and we want a meaningful way of displaying it. Better visualizing this data can create opportunities to educate the public and even other government organizations on issues facing our planet.

### Task:

### Level 1: Basic Visualization

![2-BasicMap](Images/2-BasicMap.png)

The first task is to visualize an earthquake data set.

1. **Get your data set**

   ![3-Data](Images/3-Data.png)

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. Visit the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) page and pick a data set to visualize. When you click on a data set, for example 'All Earthquakes from the Past 7 Days', you will be given a JSON representation of that data. You will be using the URL of this JSON to pull in the data for our visualization.

   ![4-JSON](Images/4-JSON.png)

2. **Import & Visualize the Data**

   Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

   * Your data markers should reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.

   * Include popups that provide additional information about the earthquake when a marker is clicked.

   * Create a legend that will provide context for your map data.

   * Your visualization should look something like the map above.

- - -

### Level 2: More Data (Optional)

![5-Advanced](Images/5-Advanced.png)

Compare recent earthquake data to a second plot of data on your map to illustrate the relationship between tectonic plates and seismic activity. You will need to pull in a second data set and visualize it along side your original set of data. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

In this step we are going to..

* Plot a second data set on our map.

* Add a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

* Add layer controls to our map.

- - -

### Assessment

Final product assessed on the following metrics:

* Completion of assigned tasks

* Visual appearance

* Professionalism


## Copyright
This selection of code is displayed by to Warren Ross @ [this GitHub][1].  
The content was derived from an assignment distributed by USC Data Analytics Bootcamp and Trilogy Education Services. Copyright anotated below:

Data Boot Camp (C) 2018. All Rights Reserved.  

[1]: https://github.com/RandallPark/USC_Homework-10_WebScraping "my repo"