export interface scoreData {
    name: string;
    title: string;
    searchPlaceholder: string;
    addButtonText: string;
    columns: {
        game: string,
        name: string,
        teams: number,
        lastEdited: string,
    };
    rows: Array<{
        game: string,
        name: string,
        teams: number,
        lastEdited: string,
    }> | [];
}

export const ScoreConfig: Record<string, scoreData> = {
    'game2': {
        name: 'Game2',
        title: 'Game2 Highscores',
        searchPlaceholder: 'Search Team Name...',
        addButtonText: 'Add New Highscore',
        columns: {
            game: 'Game',
            name: 'Team Name',
            teams: 0,
            lastEdited: 'Last Modified',
        },
        rows: [
            {
                game: 'Game2',
                name: 'Forest Wanderers',
                teams: 5,
                lastEdited: '12.01.2026 08:45',
            },
            {
                game: 'Game2',
                name: 'Portal Masters',
                teams: 3,
                lastEdited: '13.01.2026 10:20',
            },
            {
                game: 'Game2',
                name: 'Mystic Seekers',
                teams: 4,
                lastEdited: '14.01.2026 12:00',
            }
        ]
    },
    'game1': {
        name: 'Game1',
        title: 'Game1 Highscores',
        searchPlaceholder: 'Search Team Name...',
        addButtonText: 'Add New Highscore',
        columns: {
            game: 'Game',
            name: 'Team Name',
            teams: 0,
            lastEdited: 'Last Modified',
        },
        rows: [
            {
                game: 'Game1',
                name: 'Silent Agents',
                teams: 6,
                lastEdited: '15.02.2026 09:30',
            },
            {
                game: 'Game1',
                name: 'Shadow Ops',
                teams: 4,
                lastEdited: '16.02.2026 11:15',
            },
            {
                game: 'Game1',
                name: 'Phantom Squad',
                teams: 5,
                lastEdited: '17.02.2026 13:40',
            }
        ]
    },
    'game3': {
        name: 'Game3',
        title: 'Game3 Highscores',
        searchPlaceholder: 'Search Team Name...',
        addButtonText: 'Add New Highscore',
        columns: {
            game: 'Game',
            name: 'Team Name',
            teams: 0,
            lastEdited: 'Last Modified',
        },
        rows: [
            {
                game: 'Game3',
                name: 'Power Crew',
                teams: 2,
                lastEdited: '18.03.2026 15:00',
            },
            {
                game: 'Game3',
                name: 'City Lights',
                teams: 3,
                lastEdited: '19.03.2026 16:25',
            },
            {
                game: 'Game3',
                name: 'Night Watch',
                teams: 1,
                lastEdited: '20.03.2026 18:10',
            }
        ]
    }
};

export const getScoreData = (ScoreType: string): scoreData | null => {
    return ScoreConfig[ScoreType] || null;
};
