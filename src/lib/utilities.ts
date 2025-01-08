import { statesByAbbreviation, statesByName } from "./stateData";

export const stringToTitlecase = (string: string) => {
    return string
        .toLowerCase()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};

export const svgStringToImageSrc = (svgString) => {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
};

const queryTypes = ['farm']

export const getQueryType = ({query, type, cityStatePairs}) => {
	if (!query) {
		return
	}

	if (queryTypes.includes(type)) {
		return type
	}
	
	if (stringToTitlecase(query) in statesByName || query.toUpperCase() in statesByAbbreviation) {
			return 'state';
	}

	if (cityStatePairs && cityStatePairs.includes(query)) {
		return 'cityState';
	}

	return 'unknown'
}
