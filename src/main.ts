import './style.css';
import { BreathingApp } from './breathingApp';

const app = document.querySelector<HTMLDivElement>('#app')!;
new BreathingApp(app);
