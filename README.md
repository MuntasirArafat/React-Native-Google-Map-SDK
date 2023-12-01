# React-Native-Google-Map-SDK
Android
Specify your Google Maps API key
Add your API key to your manifest file ```(android/app/src/main/AndroidManifest.xml):```
```xml
<application>
   <!-- You will only need to add this meta-data tag, but make sure it's a child of application -->
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="Your Google maps API Key Here"/>
</application>
```

# Google Play Services conflicting issues with other modules

In case you have multiple modules using the same Google Play Services dependencies ```(such as react-native-onesignal)```, you can exclude the conflicting dependencies from the modules and import the Google Play Services dependencies in the project-wide ```build.gradle``` file like the following example:
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

Trouble with Google Play services
Make sure that your emulator has Google Play **(Go to Android studio -> Virtual Devices -> Check that you have icon in "Play Store" column)**
Click to bottom dots icon in the emulator
Go to Google Play Tab and click Update
