import express from 'express';
import bcrypt from 'bcrypt-nodejs'

const app = express();

app.use(express.json());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'test1',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Sam',
			email: 'sam@gmail.com',
			password: 'test2',
			entries: 0,
			joined: new Date(),
		},
	],
};

app.get('/', (req, res) => {
	res.send(database.users);
});

app.post('/signin', (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(database.users[database.users.length - 1]);
});

app.get('/profil/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
		if (user.id === id) {
            found = true;
			return res.json(user);
		}
	});
    if (!found){
        res.status(404).json('no such user');
    }
});

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach((user) => {
		if (user.id === id) {
            found = true;
            user.entries++;
			return res.json(user.entries);
		}
	});
    if (!found){
        res.status(404).json('no such user');
    }
})

app.listen(3000, () => {
	console.log('App is running on port 3000');
});
