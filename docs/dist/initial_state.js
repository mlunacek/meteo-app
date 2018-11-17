var initial_state = {
    'version': "0.0.3",
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
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-project-data-public/sounding_copper.json',
      
         },
         'boulder': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-project-data-public/sounding_boulder.json',
      
         },
         'grand_junction': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-project-data-public/sounding_grand_junction.json',
      
         },
         'eagle': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-project-data-public/sounding_eagle.json',
      
         },
        'broomfield': {
            'model': 'nam',
            'url': 'https://s3-us-west-2.amazonaws.com/meteo-project-data-public/sounding_broomfield.json',
        
        },
    },
}