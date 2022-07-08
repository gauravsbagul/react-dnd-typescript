import update from 'immutability-helper';
import type { FC } from 'react';
import { memo, useCallback, useState } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';

import { Box } from './Box';
import { Dustbin } from './Dustbin';
import { ItemTypes } from './ItemTypes';

interface DustbinState {
	accepts: string[];
	lastDroppedItem: any;
}

interface BoxState {
	name: string;
	type: string;
}

export interface DustbinSpec {
	accepts: string[];
	lastDroppedItem: any;
}
export interface BoxSpec {
	name: string;
	type: string;
}
export interface ContainerState {
	droppedBoxNames: string[];
	dustbins: DustbinSpec[];
	boxes: BoxSpec[];
}

export const Container: FC = memo(function Container() {
	const [dustbins, setDustbins] = useState<DustbinState[]>([
		{ accepts: [ItemTypes.GLASS], lastDroppedItem: null },
		{ accepts: [ItemTypes.FOOD], lastDroppedItem: null },
		{
			accepts: [ItemTypes.PAPER, ItemTypes.GLASS],
			lastDroppedItem: null,
		},
		{ accepts: [ItemTypes.PAPER], lastDroppedItem: null },
	]);
	console.log('Log: ~> file: index.tsx ~> line 44 ~> Container ~> dustbins', dustbins);

	const [boxes] = useState<BoxState[]>([
		{ name: 'Bottle', type: ItemTypes.GLASS },
		{ name: 'Banana', type: ItemTypes.FOOD },
		{ name: 'Magazine', type: ItemTypes.PAPER },
	]);

	const [droppedBoxNames, setDroppedBoxNames] = useState<string[]>([]);

	function isDropped(boxName: string) {
		return droppedBoxNames.indexOf(boxName) > -1;
	}

	const handleDrop = useCallback(
		(index: number, item: { name: string }) => {
			const { name } = item;
			console.log('Log: ~> file: index.tsx ~> line 60 ~> Container ~> name', name);
			setDroppedBoxNames(update(droppedBoxNames, name ? { $push: [name] } : { $push: [] }));
			setDustbins(
				update(dustbins, {
					[index]: {
						lastDroppedItem: {
							$set: item,
						},
					},
				})
			);
		},
		[droppedBoxNames, dustbins]
	);

	const onSubmit = async () => {
		console.log('Log: ~> file: index.tsx ~> line 75 ~> Container ~> onSubmit');
		const res = await fetch('http://localhost:5000/dashboard/saveData', {
			method: 'POST',

			body: JSON.stringify(dustbins),

			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		});
		const response = await res.json();
		console.log('Log: ~> file: index.tsx ~> line 82 ~> onSubmit ~> response', response);
	};
	return (
		<div>
			<div style={{ overflow: 'hidden', clear: 'both' }}>
				{dustbins.map(({ accepts, lastDroppedItem }, index) => (
					<Dustbin
						accept={accepts}
						lastDroppedItem={lastDroppedItem}
						onDrop={(item) => handleDrop(index, item)}
						key={index}
					/>
				))}
			</div>

			<div style={{ overflow: 'hidden', clear: 'both' }}>
				{boxes.map(({ name, type }, index) => (
					<Box name={name} type={type} isDropped={isDropped(name)} key={index} />
				))}
			</div>
			<button onClick={onSubmit}>Submit</button>
		</div>
	);
});
