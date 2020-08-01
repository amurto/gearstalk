from utils.connect import gmaps
from datetime import datetime

def address_resolver(lat, lon):
    # Reverse Geocoding with latitude and longitude
    json = gmaps.reverse_geocode((lat, lon))
    final = {}

    # Parse response into formatted location
    if json:
        data = json[0]
        for item in data['address_components']:
            for category in item['types']:
                data[category] = {}
                data[category] = item['long_name']
        final['formatted_address'] = data['formatted_address']
        final['street'] = data.get("route", None)
        final['state'] = data.get("administrative_area_level_1", None)
        final['city'] = data.get("locality", None)
        final['county'] = data.get("administrative_area_level_2", None)
        final['country'] = data.get("country", None)
        final['postal_code'] = data.get("postal_code", None)
        final['neighborhood'] = data.get("neighborhood",None)
        final['sublocality'] = data.get("sublocality", None)
        final['housenumber'] = data.get("housenumber", None)
        final['postal_town'] = data.get("postal_town", None)
        final['subpremise'] = data.get("subpremise", None)
        final['latitude'] = data.get("geometry", {}).get("location", {}).get("lat", None)
        final['longitude'] = data.get("geometry", {}).get("location", {}).get("lng", None)
        final['location_type'] = data.get("geometry", {}).get("location_type", None)
        final['postal_code_suffix'] = data.get("postal_code_suffix", None)
        final['street_number'] = data.get('street_number', None)
        # print(final)
    return final 

def geocode_address(web_addr):
    # from geopy.geocoders import Nominatim
    # x = "Sanpada,Navi Mumbai"
    # geolocator = Nominatim(user_agent="gearstalk")
    # location = geolocator.geocode(x)
    # print(location.latitude)
    geocode_result = gmaps.geocode(web_addr)
    web_lat = geocode_result[0]['geometry']['location']['lat']
    web_lng = geocode_result[0]['geometry']['location']['lng']

    # now = datetime.now()
    # directions_result = gmaps.directions("Sydney Town Hall",
    #                                      "Parramatta, NSW",
    #                                      mode="transit",
    #                                      departure_time=now)

    # print(directions_result)

    return [web_lat, web_lng]