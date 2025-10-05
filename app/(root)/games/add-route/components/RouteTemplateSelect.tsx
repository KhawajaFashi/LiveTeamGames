import React from 'react';
import { templateArray, Template } from '@/lib/routeTemplates';

type ErrorState = {
    shareCode?: string;
    templateId?: string;
    routeName?: string;
    playingTime?: string;
};

interface RouteTemplateSelectProps {
    templateId: string;
    setTemplateId: (id: string) => void;
    errors: { templateId?: string };
    setErrors: React.Dispatch<React.SetStateAction<ErrorState>>;
    setSelectedTemplate: (id: string) => void;
    setShowPopup: (show: boolean) => void;
}

const RouteTemplateSelect: React.FC<RouteTemplateSelectProps> = ({
    templateId,
    setTemplateId,
    errors,
    setErrors,
    setSelectedTemplate,
    setShowPopup,
}) => (
    <div>
        <h4 className="text-lg font-medium mb-3">Choose Language</h4>
        <select
            value={templateId || ''}
            onChange={(e) => { setTemplateId(e.target.value); setErrors((prev: ErrorState) => ({ ...prev, templateId: undefined })); }}
            className="w-full border border-gray-200 px-3 py-2 text-[13px] rounded focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
            <option value="english">English</option>
        </select>

        <h4 className="text-lg font-medium mt-6 mb-3">Choose Template</h4>
        <div className="space-y-3">
            {templateArray.map((t: Template) => (
                <label key={t.id} className={`flex items-start justify-between p-4 border rounded border-gray-200 bg-white`}>
                    <div className="flex items-start gap-4">
                        <input
                            type="radio"
                            name="template"
                            value={t.id}
                            checked={templateId === t.id}
                            onChange={(e) => { setTemplateId(e.target.value); setErrors((prev: ErrorState) => ({ ...prev, templateId: undefined })); }}
                            className="mt-1"
                        />
                        <div>
                            <div className="font-semibold text-sm">{t.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{t.subtitle}</div>
                        </div>
                    </div>
                    <button onClick={() => { setSelectedTemplate(t.id); setShowPopup(true); }} className="text-sky-500 text-sm underline">info</button>
                </label>
            ))}
        </div>
        {errors.templateId && <div className="text-sm text-red-600 mt-2">{errors.templateId}</div>}
    </div>
);

export default RouteTemplateSelect;
