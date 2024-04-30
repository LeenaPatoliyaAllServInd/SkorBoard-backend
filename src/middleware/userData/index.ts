import User from '@models/user.model';
const getUserData = async (req: any, res: any) => {
	console.log('oooooooo', req.userId, req.id, req);
	await User.find({ where: { id: req.userId } }).then((result) => {
		console.log('resultttt');
	});
};

export { getUserData };
