
// fetching_data();
// export const fetching_data = async () => {   

// }


export interface GameData {
    name: string;
    title: string;
    searchPlaceholder: string;
    addButtonText: string;
    columns: {
        name: string;
        count: string;
        lang: string;
        status: string;
        lastEdited: string;
        action: string;
    };
}

export const gameConfig: Record<string, GameData> = {
    'game2': {
        name: 'Game2',
        title: 'Game2',
        searchPlaceholder: 'Search Route Name...',
        addButtonText: 'Add New Route',
        columns: {
            name: 'Route Name',
            count: 'Riddles',
            lang: 'Lang',
            status: 'Status',
            lastEdited: 'Last Edited',
            action: 'Action'
        },

    },
    'game1': {
        name: 'Game1',
        title: 'Game1',
        searchPlaceholder: 'Search Mission Name...',
        addButtonText: 'Add New Mission',
        columns: {
            name: 'Route Name',
            count: 'Riddles',
            lang: 'Lang',
            status: 'Status',
            lastEdited: 'Last Edited',
            action: 'Action'
        },
    },
    'game3': {
        name: 'Game3',
        title: 'Game3',
        searchPlaceholder: 'Search Scenario Name...',
        addButtonText: 'Add New Scenario',
        columns: {
            name: 'Route Name',
            count: 'Riddles',
            lang: 'Lang',
            status: 'Status',
            lastEdited: 'Last Edited',
            action: 'Action'
        },
        
    }
};

export const getGameData = (gameType: string): GameData | null => {
    return gameConfig[gameType] || null;
};
// export const getFetchData = (fetchType: string): GameData | null => {
//     return gameConfig[fetchType] || null;
// };
