export type RouteType = 'template' | 'shared' | 'new';

export interface StepProps {
    step: number;
    totalSteps: number;
    routeType: RouteType;
    gameId: string;
    onNext: () => void;
    onBack: () => void;
    onCancel: () => void;
}
