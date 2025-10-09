export interface TeamData {
    no: number;
    teamName: string;
    score: string;
    status: 'WON' | 'LEFT';
    timeLeft: string;
    battery: string;
    startedOn: string;
    lat: number;
    lng: number;
}

export interface TeamData {
    no: number;
    teamName: string;
    score: string;
    status: 'WON' | 'LEFT';
    timeLeft: string;
    battery: string;
    startedOn: string;
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
        teams: [
            {
                no: 1,
                teamName: 'Portal Hunters',
                score: '47800',
                status: 'WON',
                timeLeft: '1 h 40 m',
                battery: '100%',
                startedOn: '23.07.2025',
                lat: 52.5200,
                lng: 13.4050
            },
            {
                no: 2,
                teamName: 'Magic Team',
                score: '35600',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '15%',
                startedOn: '23.07.2025',
                lat: 50.1109,
                lng: 8.6821
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            },
            {
                no: 3,
                teamName: 'Portal Masters',
                score: '29400',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '23.07.2025',
                lat: 51.3397,
                lng: 12.3731
            }
        ],
        columns: {
            name: 'Portal Name',
            count: 'Puzzles',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: [
            {
                name: 'Enchanted Forest',
                count: 7,
                lang: 'FR',
                status: 'green',
                lastEdited: '12.01.2026 08:45'
            },
            {
                name: 'Crystal Cave',
                count: 3,
                lang: 'DE',
                status: 'yellow',
                lastEdited: '13.01.2026 10:20'
            },
            {
                name: 'Mystic Lake',
                count: 5,
                lang: 'EN',
                status: 'red',
                lastEdited: '14.01.2026 12:00'
            }
        ]
    },
    'game1': {
        name: 'Game1',
        title: 'Game1',
        searchPlaceholder: 'Search Spy Mission...',
        addButtonText: 'Create New Mission',
        teams: [
            {
                no: 1,
                teamName: 'Secret Agents',
                score: '52300',
                status: 'WON',
                timeLeft: '2 h 15 m',
                battery: '95%',
                startedOn: '24.07.2025',
                lat: 48.8566,
                lng: 2.3522
            },
            {
                no: 2,
                teamName: 'Shadow Ops',
                score: '41200',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '20%',
                startedOn: '24.07.2025',
                lat: 45.4642,
                lng: 9.1900
            },
            {
                no: 3,
                teamName: 'Spy Team 6',
                score: '38900',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '30%',
                startedOn: '24.07.2025',
                lat: 41.9028,
                lng: 12.4964
            }
        ],
        columns: {
            name: 'Mission Title',
            count: 'Tasks',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: [
            {
                name: 'Silent Echo',
                count: 10,
                lang: 'ES',
                status: 'yellow',
                lastEdited: '15.02.2026 09:30'
            },
            {
                name: 'Shadow Strike',
                count: 6,
                lang: 'EN',
                status: 'green',
                lastEdited: '16.02.2026 11:15'
            },
            {
                name: 'Phantom Protocol',
                count: 8,
                lang: 'IT',
                status: 'red',
                lastEdited: '17.02.2026 13:40'
            }
        ]
    },
    'game3': {
        name: 'Game3',
        title: 'Game3',
        searchPlaceholder: 'Search Game3 Scenario...',
        addButtonText: 'Create New Scenario',
        teams: [
            {
                no: 1,
                teamName: 'Night Raiders',
                score: '49500',
                status: 'WON',
                timeLeft: '1 h 55 m',
                battery: '90%',
                startedOn: '25.07.2025',
                lat: 40.4168,
                lng: -3.7038
            },
            {
                no: 2,
                teamName: 'Dark Knights',
                score: '38700',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '25%',
                startedOn: '25.07.2025',
                lat: 52.3676,
                lng: 4.9041
            },
            {
                no: 3,
                teamName: 'Shadow Seekers',
                score: '31200',
                status: 'LEFT',
                timeLeft: '0 h 0 m',
                battery: '35%',
                startedOn: '25.07.2025',
                lat: 55.7558,
                lng: 37.6173
            }
        ],
        columns: {
            name: 'Scenario Title',
            count: 'Levels',
            lang: 'Language',
            status: 'Status',
            lastEdited: 'Last Modified',
            action: 'Action'
        },
        rows: [
            {
                name: 'Power Surge',
                count: 4,
                lang: 'EN',
                status: 'green',
                lastEdited: '18.03.2026 15:00'
            },
            {
                name: 'Citywide Chaos',
                count: 9,
                lang: 'RU',
                status: 'yellow',
                lastEdited: '19.03.2026 16:25'
            },
            {
                name: 'Nightfall',
                count: 2,
                lang: 'EN',
                status: 'red',
                lastEdited: '20.03.2026 18:10'
            }
        ]
    }
};

export const getOperatorData = (operatorType: string): OperatorData | null => {
    return OperatorConfig[operatorType] || null;
};
