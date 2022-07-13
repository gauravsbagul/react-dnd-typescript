import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import { Container } from './components/Example';
import { useEffect } from 'react';
import { getPrivateAPI } from './api';

const App = () => {
	useEffect(() => {
		_getPrivateAPI();
	}, []);

	const _getPrivateAPI = async () => {
		const res = await getPrivateAPI('/todos');
		console.log('Log: ~> file: App.tsx ~> line 10 ~> useEffect ~> res', res);
	};
	return (
		<DndProvider backend={HTML5Backend}>
			<Container />
		</DndProvider>
	);
};

export default App;

//https://github.com/reduxjs/redux-devtools/tree/main/extension#installation
