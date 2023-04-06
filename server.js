import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import handleRegister from './constrollers/register.js';
import handleSignin from './constrollers/signin.js';
import handleProfil from './constrollers/profil.js';
import {
	handleApiCall,
	handleImage,
} from './constrollers/image.js';

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'mathistelschow',
		port: '5432',
		password: '',
		database: 'smart-brain',
	},
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('success');
});

app.post('/signin', (req, res) => handleSignin(req, res, db, bcrypt));

app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));

app.get('/profil/:id', (req, res) => handleProfil(req, res, db));

app.put('/image', (req, res) => handleImage(req, res, db));

app.post('/imageurl', (req, res) => handleApiCall(req, res));

const PORT =process.env.PORT;

app.listen(PORT || 3000, () => {
	console.log(`App is running on port ${PORT}`);
});
