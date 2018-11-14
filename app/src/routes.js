import Home from './components/home';
import Windgram from './components/windgram';
import Arrow from './components/arrow';

export const routes = [
    {path: "/", component: Home, 'name': 'home'},
    {path: "/arrow", component: Arrow, 'name': 'arrow'},
    {path: "/windgram/:id", component: Windgram, 'name': 'windgram'},
]