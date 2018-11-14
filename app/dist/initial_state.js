var initial_state = {
    'url': { 'name': 'windgram', 
             'params': {'id': 'broomfield'} 
    },
    'soundings': {
        'copper': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_copper.json',
            'numbers': false,
            'dark': true,
            'threshold': true,
            'data': {},
         },
        'broomfield': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_broomfield.json',
            'numbers': false,
            'dark': true,
            'threshold': true,
            'data': {},
        },
    },
}