import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Yeh service worker ko humare banaye gaye handlers ke saath configure karta hai
export const worker = setupWorker(...handlers);