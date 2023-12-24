# React Native Google Maps SDK Integration Guide

## 1. Obtain Google Maps API Key

Before integrating Google Maps into your React Native app, you need to obtain a Google Maps API key. Follow the [official guide](https://developers.google.com/maps/gmp-get-started) to generate your API key.

## 2. Configure API Key in AndroidManifest.xml

Add your Google Maps API key to the `AndroidManifest.xml` file located at `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Other permission declarations -->

    <!-- Add the following permission for accessing the fine location -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <application>
        <!-- Other application configurations -->

        <!-- Add your Google Maps API key as a meta-data tag -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="Your Google Maps API Key Here" />
    </application>
</manifest>
```

## 3. Resolve Google Play Services Conflicts

In case you have multiple modules using the same Google Play Services dependencies **(such as react-native-onesignal)** ,you can exclude the conflicting dependencies from the modules and import the Google Play Services dependencies in the project-wide '''android/app/build.gradle''' file like the following example:

```
  implementation(project(':react-native-onesignal')){
      exclude group: 'com.google.android.gms'
  }

  implementation(project(':react-native-maps')){
      exclude group: 'com.google.android.gms'
  }
  implementation 'com.google.android.gms:play-services-base:18.0.1'
  implementation 'com.google.android.gms:play-services-location:19.0.1'
  implementation 'com.google.android.gms:play-services-maps:18.0.2'
```

A list of the current dependencies can be found here.

**ATTENTION:** ```react-native-maps requires play-services-maps >= 18.0.0```

## 4. Troubleshooting Google Play Services

If you encounter issues with Google Play Services on the emulator:

- Make sure your emulator has Google Play installed. Check in Android Studio under "Virtual Devices" and verify the presence of the "Play Store" icon.

- Open the emulator, click on the bottom dots icon, go to the "Google Play" tab, and check for updates. Click "Update" if necessary.
