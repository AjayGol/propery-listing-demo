import { atom } from 'jotai';

export const userAtom = atom({
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  verified: true,
});
