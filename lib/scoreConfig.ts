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
    'magic-portal': {
        name: 'Magic Portal',
        title: 'Magic Portal Highscores',
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
                game: 'Magic Portal',
                name: 'Forest Wanderers',
                teams: 5,
                lastEdited: '12.01.2026 08:45',
            },
            {
                game: 'Magic Portal',
                name: 'Portal Masters',
                teams: 3,
                lastEdited: '13.01.2026 10:20',
            },
            {
                game: 'Magic Portal',
                name: 'Mystic Seekers',
                teams: 4,
                lastEdited: '14.01.2026 12:00',
            }
        ]
    },
    'operation-mindfall': {
        name: 'Operation Mindfall',
        title: 'Operation Mindfall Highscores',
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
                game: 'Operation Mindfall',
                name: 'Silent Agents',
                teams: 6,
                lastEdited: '15.02.2026 09:30',
            },
            {
                game: 'Operation Mindfall',
                name: 'Shadow Ops',
                teams: 4,
                lastEdited: '16.02.2026 11:15',
            },
            {
                game: 'Operation Mindfall',
                name: 'Phantom Squad',
                teams: 5,
                lastEdited: '17.02.2026 13:40',
            }
        ]
    },
    'blackout': {
        name: 'Blackout',
        title: 'Blackout Highscores',
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
                game: 'Blackout',
                name: 'Power Crew',
                teams: 2,
                lastEdited: '18.03.2026 15:00',
            },
            {
                game: 'Blackout',
                name: 'City Lights',
                teams: 3,
                lastEdited: '19.03.2026 16:25',
            },
            {
                game: 'Blackout',
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
