mapboxgl.accessToken = 'pk.eyJ1IjoibWFyeS1iZWNrZXIiLCJhIjoiY2p3bTg0bDlqMDFkeTQzcDkxdjQ2Zm8yMSJ9._7mX0iT7OpPFGddTDO5XzQ';

const filterGroup = document.getElementById('filter-group');
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: {
        'version': 8,
        'sources': {
            'raster-tiles': {
                'type': 'raster',
                'tiles': [
                    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256,
                'attribution':
                    'USGS The National Map: National Hydrography Dataset. Data refreshed October 2021.'
            }
        },
        'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 17
            }
        ]
    },
    center: [-72.65, 41.55], // starting position
    zoom: 8.5 // starting zoom
});

map.on('load', () => {

    // request our GEOJSON data
    d3.json('./data/wpSites23_042023.geojson').then((data) => {
        // when loaded

        const wpData = d3.json('./data/wpSites23_042023.geojson');
        const stateBoundaryData = d3.json('./data/ctStateBoundary.geojson');

        Promise.all([wpData,stateBoundaryData]).then(addLayer);

    });
});

function addLayer(data){

    console.log(data);
    const wpSites = data[0];
    const boundary = data[1];

    // first add the source to the map
    map.addSource('wpSites', {
        type: 'geojson',
        data: wpSites // use our data as the data source
    });

    map.addSource('lines',{
        'type': 'geojson',
        'data': boundary
    });

    for (const feature of wpSites.features) {
        const lType = feature.properties.type;
        const layerID = `poi-${lType}`;

        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
            map.addLayer({
            'id': layerID,
            'type': 'circle',
            'source': 'wpSites',
            paint: {
                // Make circles larger as the user zooms from z12 to z22.
                'circle-radius': 10,
                'circle-stroke-color': '#008080',
                'circle-stroke-width': 1,
                'circle-color': '#70a494',
                'circle-opacity': 0.6
            },
            'filter': ['==','type', lType]
            });
            
            // Add checkbox and label elements for the layer.
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = layerID;
            input.checked = true;
            filterGroup.appendChild(input);
            
            const label = document.createElement('label');
            label.setAttribute('for', layerID);
            label.textContent = lType;
            filterGroup.appendChild(label);
            
            // When the checkbox changes, update the visibility of the layer.
            input.addEventListener('change', (e) => {
            map.setLayoutProperty(
            layerID,
            'visibility',
            e.target.checked ? 'visible' : 'none'
            );
            });
            addPopup(layerID)
            }
        }
            
        map.addLayer({
            'id': 'lines',
            'type': 'line',
            'source': 'lines',
            'paint': {
                'line-width': 3,
            // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
            // to set the line-color to a feature property value.
                'line-color': '#333333'
            }
    });

    

}

function addPopup(layer){

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        className: 'sitePopup',
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', layer, function(e) {

        const popupInfo =   "<b>" + e.features[0].properties.locationName +" ("+
                            e.features[0].properties.staSeq+ ")</b></br>"+
                            "<b>Project - No/Yes (0/1): </b></br>" +
                            "Beach: "+ e.features[0].properties.Beach +
                            "</br>Lake Bioassessment: "+ e.features[0].properties['Lake'] +
                            "</br>Trail Cam Flow: "+ e.features[0].properties['Trail Cam'] +
                            "</br>Temperature: "+ e.features[0].properties['Temperature'] +
                            "</br>Conductivity: "+ e.features[0].properties['Conductivity'] +
                            "</br>Stream Bio: "+ e.features[0].properties['Stream Bio'] +
                            "</br>Stream Chem Only: "+ e.features[0].properties['Stream Chem Only'] +
                            "</br>NRSA: "+ e.features[0].properties['NRSA'];

        // When a hover event occurs on a feature,
        // open a popup at the location of the hover, with description
        // HTML from the click event's properties.
        popup.setLngLat(e.lngLat).setHTML(popupInfo).addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over.
    map.on('mousemove', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer when it leaves the point.
    map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}

