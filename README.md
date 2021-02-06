# StandUpPicker-ElectronJs
Simple Stand Up Picker for cross platform (with ElectronJs)

This is a simple stand up picker with character. Made to try out ElectronJS. If you like, please feel free to buy me a coffee or beer!

Current version: V1.0.0 9:58 PM 6/02/2021

How to use:
Configure app by changing people.json.
Json is in the following format:

[
    {
        "name": "Person 1",
        "ispresent": true
    },
    {
        "name": "Person 2",
        "ispresent": true
    },
    {
        "name": "Person 3",
        "ispresent": true
    },
    {
        "name": "Person 4",
        "ispresent": true
    },
    {
        "name": "Person 5",
        "ispresent": true
    },
    {
        "name": "Person 6",
        "ispresent": true
    }
]

There is no validation for this json so make sure it is well formed.

Also you can change the default window dimensions by chaning setting.json:
{
    "window": {
        "width": 410,
        "height": 150
    }
}


Implemented with:
ElectronJS
Pure Javascript 


Before running make sure prerequisites are setup as per: https://www.electronjs.org/docs/tutorial/quick-start#package-and-distribute-the-application

To run, once you get the code, follow
npm start


Colors inspired by MS Teams.

Supports dark and light modes in OS. Tested in Windows 10. 