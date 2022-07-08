export interface Address {
	street: string;
	city: string;
	state: string;
	zip: string;
}

export interface UserInterface {
	id: number;
	name: string;
	userName: string;
	age: number;
	email: string;
	address: Address;
}
