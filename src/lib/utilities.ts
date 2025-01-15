import { statesByAbbreviation, statesByName } from "./stateData";

export const stringToTitlecase = (string: string) => {
    return string
        .toLowerCase()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};

export const svgStringToImageSrc = (svgString: string) => {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
};

const queryTypes = ['farm']

export const getQueryType = ({query, type, cityStatePairs}: {query: string | null, type: string | null, cityStatePairs: unknown[] | undefined}) => {
	if (!query) {
		return
	}

	if (type && queryTypes.includes(type)) {
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

export const getStateQueryType = ({ searchQuery }: { searchQuery: string }) => {
	if (stringToTitlecase(searchQuery) in statesByName) {
		return 'fullName';
	}

	return 'abbreviation';
};
