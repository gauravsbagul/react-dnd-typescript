import React from 'react';

interface HeaderProps {
	headerText: string;
}

export const Header = ({ headerText }: HeaderProps) => {
	return <div>{headerText}</div>;
};
