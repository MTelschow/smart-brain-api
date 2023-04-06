import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

import handleRegister from './constrollers/register.js';
import handleSignin from './constrollers/signin.js';
import handleProfil from './constrollers/profil.js';
import { handleApiCall, handleImage } from './constrollers/image.js';

const db = knex({
	client: 'pg',
	connection: {
		connectionString: 'postgres://mydb_nbsh_user:XKkBGwcdEI4igEOr139Fs0vmmukF2ite@dpg-cgn6usl269v6fnt7hl70-a/mydb_nbsh',
		ssl: { rejectUnauthorized: false },
		host: 'dpg-cgn6usl269v6fnt7hl70-a',
		port: '5432',
		user: 'mydb_nbsh_user',
		password: 'XKkBGwcdEI4igEOr139Fs0vmmukF2ite',
		database: 'mydb_nbsh',
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

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
	console.log(`App is running on port ${PORT}`);
});
