export interface TeamData {
    no: number;
    teamName: string;
    score: string;
    status: 'WON' | 'LEFT';
    timeLeft: string;
    battery: string;
    startedOn: Date;
    lat: number;
    lng: number;
}

export interface OperatorData {
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
    teams: TeamData[];
}

export const OperatorConfig: Record<string, OperatorData> = {
    'game2': {
        name: 'Game2',
        title: 'Game2',
        searchPlaceholder: 'Search Portal Name...',
        addButtonText: 'Create New Portal',
        teams: [],
        columns: {
            name: 'Portal Name',
            count: 'Puzzles',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: []
    },
    'game1': {
        name: 'Game1',
        title: 'Game1',
        searchPlaceholder: 'Search Spy Mission...',
        addButtonText: 'Create New Mission',
        teams: [],
        columns: {
            name: 'Mission Title',
            count: 'Tasks',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: []
    },
    'game3': {
        name: 'Game3',
        title: 'Game3',
        searchPlaceholder: 'Search Game3 Scenario...',
        addButtonText: 'Create New Scenario',
        teams: [],
        columns: {
            name: 'Scenario Title',
            count: 'Levels',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: []
    }
};

export const getOperatorData = (operatorType: string): OperatorData | null => {
    return OperatorConfig[operatorType] || null;
};
