import React, { useState, useContext } from 'react';
import { UserInterface } from './user.interface';
import { InputValueContext } from '../InputValueContext';

export const User = () => {
	const [user, setUser] = useState<UserInterface | null>(null);
	const [userName, setUserName] = useState<string>('');
	const { state, dispatch } = useContext(InputValueContext);
	console.log('Log: ~> file: index.tsx ~> line 9 ~> User ~> state', state);

	const onFetchUser = () => {
		setUser({
			name: 'John Doe',
			age: 30,
			id: 1,
			email: 'a@b.c',
			userName: 'johndoe',
			address: {
				street: '123 Main St',
				city: 'Anytown',
				state: 'California',
				zip: '12345',
			},
		});
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserName(e.target.value);
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const dummyUser = { ...user };
		setUser({
			...(user as UserInterface),
			userName,
		});
	};

	return (
		<>
			<button onClick={onFetchUser}>fetch user</button>
			{user && <div>{user.userName}</div>}
			<form onSubmit={(e) => onSubmit(e)}>
				<input name="userName" value={userName} onChange={onChange} />
			</form>
		</>
	);
};
