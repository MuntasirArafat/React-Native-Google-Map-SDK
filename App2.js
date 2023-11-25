import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Polyline} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

const App = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState('');
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [mapKey, setMapKey] = useState(1);
  const [polylineCoords, setPolylineCoords] = useState([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Please grant location permission to use this app.',
          [{text: 'OK'}],
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        console.log('New Location:', newLocation);

        setCurrentLocation(newLocation);
        setMapKey(prevKey => prevKey + 1);
      },
      error => {
        console.error('Error getting current location:', error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const reLocate = () => {
    getCurrentLocation();
  };

  const calculateDistance = () => {
    console.log('Calculating distance...');
    console.log('Current Location:', currentLocation);
    console.log('Destination:', destination);

    const destinationArray = destination.split(',');
    const destinationLatitude = parseFloat(destinationArray[0]);
    const destinationLongitude = parseFloat(destinationArray[1]);

    if (!isNaN(destinationLatitude) && !isNaN(destinationLongitude)) {
      const destinationCoords = {
        latitude: destinationLatitude,
        longitude: destinationLongitude,
      };

      const R = 6371;
      const dLat = toRadians(
        destinationCoords.latitude - currentLocation.latitude,
      );
      const dLon = toRadians(
        destinationCoords.longitude - currentLocation.longitude,
      );

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(currentLocation.latitude)) *
          Math.cos(toRadians(destinationCoords.latitude)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      const distance = R * c;

      setDistance(distance.toFixed(2) + ' km');
      setDestinationCoords(destinationCoords);
      calculatePolyline();
    } else {
      setDistance(null);
      setDestinationCoords(null);
      setPolylineCoords([]);
    }
  };

  const calculatePolyline = () => {
    if (currentLocation && destinationCoords) {
      const lineCoords = [
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
        {
          latitude: destinationCoords.latitude,
          longitude: destinationCoords.longitude,
        },
      ];

      setPolylineCoords(lineCoords);
    }
  };

  const toRadians = angle => {
    return (angle * Math.PI) / 180;
  };

  return (
    <View style={{flex: 1}}>
      {currentLocation && (
        <MapView
          key={mapKey}
          style={{flex: 1}}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            description="This is your current location"
          />
          {destinationCoords && (
            <Marker
              coordinate={destinationCoords}
              title="Destination"
              description="This is your destination"
            />
          )}
          {polylineCoords.length > 0 && (
            <Polyline
              coordinates={polylineCoords}
              strokeWidth={2}
              strokeColor="blue"
            />
          )}
        </MapView>
      )}

      <View style={{padding: 16}}>
        <Text>Your Current Location:</Text>
        {currentLocation && (
          <Text>
            Latitude: {currentLocation.latitude}, Longitude:{' '}
            {currentLocation.longitude}
          </Text>
        )}

        <Button
          title="Request Location Permission"
          onPress={requestLocationPermission}
        />

        <Button title="Re-Locate" onPress={reLocate} />

        <Text>Enter Destination:</Text>
        <TextInput
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
          }}
          value={destination}
          onChangeText={text => setDestination(text)}
        />

        <Button title="Calculate Distance" onPress={calculateDistance} />

        {distance && <Text>Distance to Destination: {distance}</Text>}
      </View>
    </View>
  );
};

export default App;
