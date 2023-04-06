import fetch from "node-fetch";

const returnClarifyRequestOptions = (imgUrl) => {
	// Your PAT (Personal Access Token) can be found in the portal under Authentification
	const PAT = 'ac3d35e0d8dc4d1bbee253f30514c1c6';
	// Specify the correct user_id/app_id pairings
	// Since you're making inferences outside your app's scope
	const USER_ID = '3d9fh02tmmr6';
	const APP_ID = 'facedetectionbrain';
	// Change these to whatever model and image URL you want to use
	// const MODEL_ID = 'face-detection';
	const IMAGE_URL = imgUrl;

	const raw = JSON.stringify({
		user_app_id: {
			user_id: USER_ID,
			app_id: APP_ID,
		},
		inputs: [
			{
				data: {
					image: {
						url: IMAGE_URL,
					},
				},
			},
		],
	});

	const requestOptions = {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			Authorization: 'Key ' + PAT,
		},
		body: raw,
	};

	return requestOptions;
};

const handleApiCall = (req, res) => {
	fetch(
		'https://api.clarifai.com/v2/models/face-detection/outputs',
		returnClarifyRequestOptions(req.body.input)
	)
		.then((data) => data.json())
		.then((response) => res.json(response))
		.catch((err) => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, db) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0].entries);
		})
		.catch((err) => res.status(400).json('unable to get entries'));
};

export { returnClarifyRequestOptions, handleApiCall, handleImage };
