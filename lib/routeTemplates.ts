export type TemplateDetail = {
    stage: string;
    type: string;
    name: string;
};

export type Template = {
    id: string;
    title: string;
    subtitle: string;
    description: string;
};

export const TemplateTable: Record<string, TemplateDetail[]> = {
    'tpl-1': [
        { stage: '1', type: 'AR', name: 'Spectacular Start' },
        { stage: '2', type: 'AR', name: 'Legendary Treasure' },
        { stage: '3', type: 'MG', name: 'Cursed Manuscript' },
        { stage: '4', type: 'LBR', name: 'Greetings from the Human World' },
        { stage: '5', type: 'AP', name: 'Written in the Stars' },
        { stage: '6', type: 'MC', name: 'Elementary!' },
        { stage: '7', type: 'LBR', name: 'Riddle must be edited!' },
        { stage: '8', type: 'AP', name: 'A True Alchemist' },
        { stage: '9', type: 'AP', name: 'Discs of Destiny' },
        { stage: '10', type: 'MG', name: 'Strike a Pose' },
    ],
    'tpl-2': [
        { stage: '1', type: 'AR', name: 'Family Start' },
        { stage: '2', type: 'MG', name: 'Puzzle Adventure' },
        { stage: '3', type: 'AP', name: 'Birthday Surprise' },
        { stage: '4', type: 'LBR', name: 'Kids Riddle' },
        { stage: '5', type: 'AR', name: 'Portal Finale' },
        { stage: '6', type: 'AR', name: 'Portal Finale' },
        { stage: '7', type: 'AR', name: 'Portal Finale' },
        { stage: '8', type: 'AR', name: 'Portal Finale' },
        { stage: '9', type: 'AR', name: 'Portal Finale' },
        { stage: '10', type: 'AR', name: 'Portal Finale' },
    ],
    'tpl-3': [
        { stage: '1', type: 'AR', name: 'Linear Start' },
        { stage: '2', type: 'MG', name: 'Linear Puzzle 1' },
        { stage: '3', type: 'MG', name: 'Linear Puzzle 2' },
        { stage: '4', type: 'AP', name: 'Linear Action' },
        { stage: '5', type: 'AR', name: 'Linear End' },
    ],
    'tpl-4': [
        { stage: '1', type: 'AR', name: 'Indoor Start' },
        { stage: '2', type: 'MG', name: 'Indoor Puzzle' },
        { stage: '3', type: 'AP', name: 'No ActionPack' },
        { stage: '4', type: 'LBR', name: 'Printed Mission' },
        { stage: '5', type: 'AR', name: 'Indoor End' },
    ],
    'tpl-5': [
        { stage: '1', type: 'AR', name: 'Treasure Start' },
        { stage: '2', type: 'MG', name: 'Hunter Puzzle' },
        { stage: '3', type: 'AP', name: 'Treasure Action' },
        { stage: '4', type: 'LBR', name: 'Hunter Riddle' },
        { stage: '5', type: 'AR', name: 'Treasure End' },
    ],
};

export const templateArray: Template[] = [
    {
        id: 'tpl-1',
        title: '1. Magic Portal Adult (Previously Remastered)',
        subtitle: 'Difficulty: Advanced (4/5). Target Group: 16+ Years. Playing Time: 120-180 Min',
        description: '',
    },
    {
        id: 'tpl-2',
        title: '2. Magic Portal Family Game & Kids Birthday',
        subtitle: 'Difficulty: Medium (3/5). Target Group: 10+ Years. Playing Time: 120-150 Min',
        description: '',
    },
    {
        id: 'tpl-3',
        title: '3. Magic Portal Linear',
        subtitle: 'This is a linear route where the order is predefined and players have to solve one puzzle after the other.',
        description: '',
    },
    {
        id: 'tpl-4',
        title: '4. Magic Portal No ActionPack / Indoor',
        subtitle: 'A special route template to play without the ActionPack or indoor with a printed mission sheet.',
        description: '',
    },
    {
        id: 'tpl-5',
        title: '5. Treasure Hunters',
        subtitle: 'Our standard template for the Treasure Hunters Game',
        description: '',
    },
];
