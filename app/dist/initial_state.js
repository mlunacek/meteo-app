var initial_state = {
    'version': "0.0.1",
    'url': { 'name': 'windgram', 
             'params': {'id': 'broomfield'} 
    },
    'parameters': {
        'numbers': false,
        'dark': true,
        'threshold': true,
    },
    'soundings': {
        'copper': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_copper.json',
      
         },
        'broomfield': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_broomfield.json',
        
        },
    },
}