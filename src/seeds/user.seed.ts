import bcrypt from 'bcrypt';

export const userSeed = [
  {
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('password', 10),
    firstName: 'Administrator',
    lastName: '',
  },
 
];
