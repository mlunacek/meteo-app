import Home from './components/home';
import Windgram from './components/windgram';

export const routes = [
    {path: "/", component: Home},
    {path: "/windgram/:id", component: Windgram, 'name': 'windgram'},
]