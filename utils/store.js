import Storage from './storage';

export const tokenStore = Storage.getInstance('token', true);

export const userIdStore = Storage.getInstance('userId', true);
