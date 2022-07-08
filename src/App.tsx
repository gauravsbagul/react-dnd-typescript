import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import { Container } from './components/Example';

const App = () => {
	return (
		<DndProvider backend={HTML5Backend}>
			<Container />
		</DndProvider>
	);
};

export default App;

//https://github.com/reduxjs/redux-devtools/tree/main/extension#installation
