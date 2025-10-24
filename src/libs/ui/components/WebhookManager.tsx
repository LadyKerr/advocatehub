import { type FC, useState, useEffect } from "react";
import { 
    Plus, 
    Trash2, 
    Copy, 
    ExternalLink, 
    CheckCircle, 
    XCircle,
    AlertCircle,
    Webhook,
    Github,
    Youtube,
    Globe,
    Share2
} from "lucide-react";
import type { WebhookConfig } from "../../../types/integration";

interface WebhookManagerProps {
    onUpdate: () => void;
}

export const WebhookManager: FC<WebhookManagerProps> = ({ onUpdate }) => {
    const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWebhooks();
    }, []);

    const loadWebhooks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/integrations/webhooks');
            const data = await response.json();
            if (data.success) {
                setWebhooks(data.data);
            }
        } catch (error) {
            console.error('Failed to load webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'github': return Github;
            case 'youtube': return Youtube;
            case 'social': return Share2;
            default: return Globe;
        }
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'github': return 'bg-gray-100 text-gray-700';
            case 'youtube': return 'bg-red-100 text-red-700';
            case 'social': return 'bg-blue-100 text-blue-700';
            default: return 'bg-primary/10 text-primary';
        }
    };

    const copyWebhookUrl = (platform: string) => {
        const webhookUrl = `${window.location.origin}/api/integrations/webhooks/${platform}`;
        navigator.clipboard.writeText(webhookUrl);
        // TODO: Show toast notification
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Webhook className="w-6 h-6 animate-pulse text-primary mr-2" />
                <span className="text-primary">Loading webhooks...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-h2-md md:text-h2 text-primary">Webhook Management</h2>
                    <p className="text-primary/60 mt-2">
                        Receive real-time updates from external platforms when new content is published.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Webhook</span>
                </button>
            </div>

            {/* Platform Templates */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-lg font-semibold text-primary mb-4">Supported Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            platform: 'github',
                            name: 'GitHub',
                            description: 'Repository releases, pushes, and commits',
                            events: ['release', 'push', 'commit'],
                            icon: Github
                        },
                        {
                            platform: 'youtube',
                            name: 'YouTube',
                            description: 'New video uploads and channel updates',
                            events: ['video_uploaded', 'channel_updated'],
                            icon: Youtube
                        },
                        {
                            platform: 'blog',
                            name: 'Blog Platforms',
                            description: 'New blog posts and article publications',
                            events: ['post_published', 'post_updated'],
                            icon: Globe
                        }
                    ].map((template) => {
                        const Icon = template.icon;
                        const isConfigured = webhooks.some(w => w.platform === template.platform);
                        
                        return (
                            <div key={template.platform} className="bg-secondary rounded-lg p-4 border border-primary/10">
                                <div className="flex items-center space-x-3 mb-3">
                                    <Icon className="w-6 h-6 text-primary" />
                                    <h4 className="font-semibold text-primary">{template.name}</h4>
                                    {isConfigured && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    )}
                                </div>
                                <p className="text-sm text-primary/60 mb-3">{template.description}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {template.events.map((event) => (
                                            <span
                                                key={event}
                                                className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                                            >
                                                {event}
                                            </span>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => copyWebhookUrl(template.platform)}
                                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors flex items-center space-x-1"
                                    >
                                        <Copy className="w-3 h-3" />
                                        <span>URL</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Active Webhooks */}
            {webhooks.length === 0 ? (
                <div className="text-center py-12 bg-primary/5 rounded-xl border border-primary/10">
                    <Webhook className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No Webhooks Configured</h3>
                    <p className="text-primary/60 mb-4">
                        Set up webhooks to automatically import content when it's published on external platforms.
                    </p>
                    <div className="space-y-2 text-sm text-primary/60">
                        <p>• Get notified instantly when new content is available</p>
                        <p>• Automatically import releases, videos, and blog posts</p>
                        <p>• Keep your content up-to-date without manual checking</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Active Webhooks</h3>
                    {webhooks.map((webhook) => {
                        const Icon = getPlatformIcon(webhook.platform);
                        const colorClass = getPlatformColor(webhook.platform);
                        
                        return (
                            <div key={`${webhook.platform}-${webhook.config.webhookUrl}`} className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className={`p-2 rounded-lg ${colorClass}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-primary capitalize">
                                                    {webhook.platform} Webhook
                                                </h4>
                                                <div className="flex items-center space-x-2 text-sm text-primary/60">
                                                    {webhook.enabled ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                            <span>Active</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                            <span>Inactive</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-primary/60">
                                            <div>
                                                <span className="font-medium">Webhook URL: </span>
                                                <code className="bg-primary/10 px-2 py-1 rounded text-xs">
                                                    {window.location.origin}/api/integrations/webhooks/{webhook.platform}
                                                </code>
                                                <button
                                                    onClick={() => copyWebhookUrl(webhook.platform)}
                                                    className="ml-2 p-1 hover:bg-primary/10 rounded"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                            
                                            <div>
                                                <span className="font-medium">Events: </span>
                                                {webhook.config.events?.join(', ') || 'All'}
                                            </div>

                                            {webhook.lastSync && (
                                                <div>
                                                    <span className="font-medium">Last Activity: </span>
                                                    {new Date(webhook.lastSync).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                                            <ExternalLink className="w-3 h-3" />
                                            <span>Test</span>
                                        </button>
                                        
                                        <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                            <Trash2 className="w-3 h-3" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Setup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Webhook Setup Instructions</h4>
                        <div className="space-y-2 text-sm text-blue-800">
                            <p><strong>GitHub:</strong> Go to your repository → Settings → Webhooks → Add webhook. Use the GitHub webhook URL above and select the events you want to monitor.</p>
                            <p><strong>YouTube:</strong> Set up YouTube webhook notifications through Google Cloud Console or use YouTube Data API push notifications.</p>
                            <p><strong>Blog Platforms:</strong> Most blogging platforms support webhook notifications. Check your platform's documentation for webhook setup instructions.</p>
                        </div>
                        <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800">
                                <strong>Pro tip:</strong> Use webhook signatures/secrets when available for enhanced security. 
                                The system will automatically verify incoming webhook authenticity.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};