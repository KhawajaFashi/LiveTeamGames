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
    rows: Array<{
        name: string;
        count: string | number;
        lang: string;
        status: 'red' | 'green' | 'yellow';
        lastEdited: string;
    }>;
}

export const gameConfig: Record<string, GameData> = {
    'magic-portal': {
        name: 'Magic Portal',
        title: 'Magic Portal',
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
        rows: [
            {
                name: 'Test 2',
                count: '-',
                lang: 'EN',
                status: 'red',
                lastEdited: '22.09.2025 11:14'
            },
            {
                name: 'Test 4',
                count: '12',
                lang: 'EN',
                status: 'red',
                lastEdited: '22.09.2025 11:15'
            },
            {
                name: 'Test',
                count: '1',
                lang: 'EN',
                status: 'red',
                lastEdited: '22.09.2025 11:20'
            }
        ]
    },
    'operation-mindfall': {
        name: 'Operation Mindfall',
        title: 'Operation Mindfall',
        searchPlaceholder: 'Search Mission Name...',
        addButtonText: 'Add New Mission',
        columns: {
            name: 'Mission Name',
            count: 'Objectives',
            lang: 'Lang',
            status: 'Status',
            lastEdited: 'Last Edited',
            action: 'Action'
        },
        rows: [
            {
                name: 'Mission Alpha',
                count: '8',
                lang: 'EN',
                status: 'green',
                lastEdited: '23.09.2025 14:30'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Beta',
                count: '5',
                lang: 'EN',
                status: 'red',
                lastEdited: '23.09.2025 15:45'
            },
            {
                name: 'Mission Gamma',
                count: '12',
                lang: 'EN',
                status: 'yellow',
                lastEdited: '23.09.2025 16:20'
            }
        ]
    },
    'blackout': {
        name: 'Blackout',
        title: 'Blackout',
        searchPlaceholder: 'Search Scenario Name...',
        addButtonText: 'Add New Scenario',
        columns: {
            name: 'Scenario Name',
            count: 'Challenges',
            lang: 'Lang',
            status: 'Status',
            lastEdited: 'Last Edited',
            action: 'Action'
        },
        rows: [
            {
                name: 'Dark Alley',
                count: '6',
                lang: 'EN',
                status: 'red',
                lastEdited: '24.09.2025 09:15'
            },
            {
                name: 'Abandoned Factory',
                count: '9',
                lang: 'EN',
                status: 'green',
                lastEdited: '24.09.2025 10:30'
            },
            {
                name: 'Underground Bunker',
                count: '4',
                lang: 'EN',
                status: 'yellow',
                lastEdited: '24.09.2025 11:45'
            }
        ]
    }
};

export const getGameData = (gameType: string): GameData | null => {
    return gameConfig[gameType] || null;
};
