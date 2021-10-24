# Localwire - Crowdsourcing local events.
The idea of the project is to crowdsource local events and news. People on the ground can contribute, verify and subscribe to that events/news. The service can be made available as a website and app, allowing the public to upload text messages, photos under some predefined sections, like: traffic situation, road, safety, water. Along with the public consuming this news/events, the Govt. authorities can take rectifying actions based on some events.

### CPAD Assignment 2
As part of BITS WILP coursework, we did this application for completing the Cross Platform Application Development Assignment 2.

The application is build on Ionic-React + Capacitor based application with realtime update capabilities using Firebase.

The project is live and the latest version is deployed at https://localwire.vercel.app/.

A video demo of the application showcasing and explaining the features can be found [here](https://drive.google.com/file/d/19W2cvcwhZ7EFt2o7VsTZ4i0wJpPJowha/view?usp=sharing). Please download the zip and extract the files to view the video.


# Team Members
- S. Nitheesh Prabu (2020mt93512@wilp.bits-pilani.ac.in)
- Pranab Roy (2020mt93536@wilp.bits-pilani.ac.in)
- Sivasankari R (2020mt93719@wilp.bits-pilani.ac.in)
- Akshit Sharma (2020mt93605@wilp.bits-pilani.ac.in)


# Setting up the project
- You need to have Node version >= `12.14.0` and npm version >= `6.13.4` to continue further.
- Install @ionic/cli globally.
  ```bash
	npm install -g @ionic/cli
	```
- Clone project repository
  ```bash
  git clone https://github.com/2020mt93512/cpad-a2-group6-localwire
  ```
- Checkout `master` branch
- Install dependencies
  ```bash
	npm i
	```

# Running the project in local environment
- To run web with live reload:
  ```bash
	ionic serve
	```
- To run android with live reload
  ```bash
	ionic capacitor run android -l --host=0.0.0.0
	```
- To run iOS with live reload (need macOS)
  ```bash
	ionic capacitor run ios -l --external
	```

# Features
- Sign in/sign up using email ID and password - Implemented using Firebase Authentication.
- Add new local events with title, description, location, and tags.
- Edit/delete events created by you.
- Filter events based on tags.
- Get realtime updates of events in and around 50kms of your current locality. (using device geolocation capabilities and geohashes)
- Update location to view events in other regions.
- Verify events recorded by others to show the event's authenticity.
- Light/Dark mode.

# Screenshots
## Sign in
![Login](/examples/login.png?raw=true "Login")

## Sign up
![Sign Up](/examples/signup.png?raw=true "Sign Up")

## View Local Events
![Local Events](/examples/local-events.png?raw=true "Local Events")

## Add New Event
![Local Events](/examples/add-new-event.png?raw=true "Add New Event")

## Filter Local Events
![Filter Events](/examples/filter-events.png?raw=true "Filter Events")

## View Event Details
![Event Details](/examples/event-details.png?raw=true "View Event Details")

## Verify Event
![Verify Event](/examples/verify-event.png?raw=true "Verify Event")

## Unverify Event
![Unverify Event](/examples/unverify-event.png?raw=true "Unverify Event")

## View My Events
![My Events](/examples/my-events.png?raw=true "View My Events")

## Edit & Delete Event
![Edit Event](/examples/edit-event.png?raw=true "Edit Event")

## Dark Mode
![Login Dark](/examples/login-dark.png?raw=true "Login Dark")
![My Events Dark](/examples/my-events-dark.png?raw=true "View My Events Dark")
![Edit Event Dark](/examples/edit-event-dark.png?raw=true "Edit Event Dark")
