var initial_state = {
    'version': "0.0.2",
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
         'boulder': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_boulder.json',
      
         },
         'grand_junction': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_grand_junction.json',
      
         },
         'eagle': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_eagle.json',
      
         },
        'broomfield': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-data/sounding_broomfield.json',
        
        },
    },
}