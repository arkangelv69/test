# Pre-requisites
## System requirements:

1. Install nodejs, npm
1. Install lib32z1 lib32ncurses5 lib32bz2-1.0 libstdc++6:i386 (for running 32bit process)
1. Install g++ (G++ compiler)
1. Install JDK8  (setup JAVA_HOME)
1. Install Android SDK Platform, Android SDK Tools, Android SDK Platform Tools, Android Build Tools, Android Support Repository, Android Support Library, Google Play Services and some system images. (setup ANDROID_HOME)
1. For iOS developments: [Setup OS X](http://docs.nativescript.org/start/ns-setup-os-x)

## Installing nativescript:
    sudo npm install nativescript -g --unsafe-perm
    tns doctor # (to check it)

# Nativescript project
## Creating the project:
    tns create ILovePlatos --appid com.vangamo.ilovedishes --template typescript ; ln -s ILovePlatos croquetas


## Adding platforms:
Go inside root directory of the project and execute:

    tns platform add ios
    tns platform add android

## Adding plugins:
Go inside root directory of the project and execute:

    tns plugin add nativescript-floatingactionbutton
    tns plugin add nativescript-geolocation
    tns plugin add nativescript-google-maps-sdk

This three plugins are installed and added to package.json of the root directory of the project. (It will appear warns about no description, no repository field, no readme data and no license. It's normal because tns create doesn't fill it).

## Overwrite project template with Github code:
Download source code from the repo into a temporary directory and then overwrite the template project contents. Execute this commands inside root project directory:

    git clone "https://github.com/vangamo/croquetas" temp.repo
    mv temp.repo/.git .
    mv temp.repo/.gitignore .
    mv temp.repo/* .
    git status  # It'll appear some files not tracked by git. That is old stuff from template project. You can delete it.

# Life-cycle commands
## Run the app into an emulator.
First, create an AVD (Android virtual device). Run AVD Manager:

    $ANDROID_HOME/tools/android avd

It's a nice graphical manager. You can create a new AVD selecting one machine from "Device definitions" tab (i.e. Nexus 4) and clicking on "Create AVD" button. In the dialog, select the API target (one with Google APIs), select x86 CPU and a Skin. On Ubuntu, it doesn't work to eneable "Use host GPU" check.

Once the AVD is created, run the following command inside root directory of the project (as usual):

    tns deploy android --emulator

It'll compile the project and it'll open the AVD to run the apk on it automatically.