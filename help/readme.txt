Simple Stand Up Picker

V1.0.0 9:58 PM 6/02/2021
WhozDougie

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
