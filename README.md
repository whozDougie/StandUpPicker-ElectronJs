# Simple Stand Up Picker (StandUpPicker-ElectronJs) for Windows 10, MacOS 
Simple Stand Up Picker for cross platform (with ElectronJs) - MacOS pending testing.

This is a simple stand up picker with character. Made to try out ElectronJS. If you like, please feel free to buy me a coffee or beer!

Current version: V1.0.0 9:58 PM 6/02/2021

## How to use
Configure app by changing people.json.
Json is in the following format:
```
[
    {
        "name": "Person 1",
        "include": true
    },
    {
        "name": "Person 2",
        "include": true
    },
    {
        "name": "Person 3",
        "include": true
    },
    {
        "name": "Person 4",
        "include": true
    },
    {
        "name": "Person 5",
        "include": true
    },
    {
        "name": "Person 6",
        "include": true
    }
]
```
Note: There is no validation for this json so make sure it is well formed.

Also you can change the default window dimensions by chaning settings.json:
```
{
    "window": {
        "width": 410,
        "height": 150
    }
}
```

## Implemented with:
ElectronJS and Pure Javascript 

## Getting the project going
Before running make sure prerequisites are setup as per: https://www.electronjs.org/docs/tutorial/quick-start#package-and-distribute-the-application

### Steps:
1. You will need node, and npm installed.

2. In the solution folder run this initially for the first time:
```
npm install 
```

3. To run, once you get the code, follow
```
npm start
```

## Packaging and Deployment
Run these in the folder (if the steps in the electronjs.org documentation above doesn't work):
```
npm add --dev @electron-forge/cli
npx electron-forge import
npm run make
```

# Styling info
Colors inspired by MS Teams.

Supports dark and light modes in OS. This is done using:
```
@media (prefers-color-scheme: dark) 
@media (prefers-color-scheme: light) 
```

# Supported Platforms
Tested in Windows 10. 
Pending test on MacOS

Need help testing on Linux releases

# Future plans?
Add a simple interface to update the people list and settings? 
