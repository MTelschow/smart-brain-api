import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

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

app.post('/signin', (req, res) => {
	const { email, password } = req.body;

	db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then((data) => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status('400').json('unable to get user'));
			} else {
				res.status('400').json('wrong credentials');
			}
		})
		.catch((err) => {
			res.status('400').json('wrong credentials');
		});
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;

	const hash = bcrypt.hashSync(password);

	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into('login')
			.returning('email')
			.then((loginEmail) => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0].email,
						name: name,
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) => res.status(400).json('unable to register'));
});

app.get('/profil/:id', (req, res) => {
	const { id } = req.params;

	db.select('*')
		.from('users')
		.where('id', id)
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		});
});

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
	console.log('App is running on port 3000');
});
