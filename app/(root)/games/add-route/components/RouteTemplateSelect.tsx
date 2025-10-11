import api from '@/utils/axios';
import React, { useEffect, useState } from 'react';
// import { templateArray, Template } from '@/lib/routeTemplates';

type Template = {
    _id: string;
    id: number;
    gameName: string;
    name: string;
    description: string;
    riddles: any[];
};

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
    setSelectedTemplate: (template: Template | null) => void;
    setShowPopup: (show: boolean) => void;
    gameName: string;
}

const RouteTemplateSelect: React.FC<RouteTemplateSelectProps> = ({
    templateId,
    setTemplateId,
    errors,
    setErrors,
    setSelectedTemplate,
    setShowPopup,
    gameName
}) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        if (!gameName) return;

        const fetchTemplates = async () => {
            setLoading(true);
            setFetchError(null);

            console.log("Fetching templates from:", process.env.NEXT_PUBLIC_API_URL);

            try {
                const res = await api.get(
                    `/games/get_template?gameName=${encodeURIComponent(gameName)}`
                );

                if (res.data.success) {
                    setTemplates(res.data.data);
                } else {
                    setFetchError(res.data.message || "Failed to fetch templates");
                }
            } catch (error) {
                setFetchError("Failed to fetch templates");
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, [gameName]);


    return (
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
            {loading && <div>Loading templates...</div>}
            {fetchError && <div className="text-red-600 text-sm">{fetchError}</div>}
            <div className="space-y-3">
                {templates.map((t: Template) => (
                    <label key={t._id} className={`flex items-start justify-between p-4 border rounded border-gray-200 bg-white`}>
                        <div className="flex items-start gap-4">
                            <input
                                type="radio"
                                name="template"
                                value={t._id}
                                checked={templateId === t._id}
                                onChange={(e) => { setTemplateId(e.target.value); setErrors((prev: ErrorState) => ({ ...prev, templateId: undefined })); }}
                                className="mt-1"
                            />
                            <div>
                                <div className="font-semibold text-sm">{t.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{t.description}</div>
                            </div>
                        </div>
                        <button onClick={() => { setSelectedTemplate(t); setShowPopup(true); }} className="text-sky-500 text-sm underline">info</button>
                    </label>
                ))}
            </div>
            {errors.templateId && <div className="text-sm text-red-600 mt-2">{errors.templateId}</div>}
        </div>
    )
};

export default RouteTemplateSelect;
