import { type FC, useState, useEffect } from "react";
import { 
    Rss, 
    Webhook, 
    Download, 
    Upload, 
    Settings, 
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw
} from "lucide-react";
import { RSSFeedManager } from "../components/RSSFeedManager";
import { WebhookManager } from "../components/WebhookManager";
import { ExportManager } from "../components/ExportManager";
import type { IntegrationConfig } from "../../../types/integration";

type TabType = 'overview' | 'rss' | 'webhooks' | 'export';

interface IntegrationStats {
    totalContent: number;
    rssFeeds: number;
    webhooks: number;
    lastSync: string;
}

export const IntegrationHub: FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
    const [stats, setStats] = useState<IntegrationStats>({
        totalContent: 0,
        rssFeeds: 0,
        webhooks: 0,
        lastSync: 'Never'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadIntegrations();
    }, []);

    const loadIntegrations = async () => {
        try {
            setLoading(true);
            // Load RSS integrations
            const rssResponse = await fetch('/api/integrations/rss');
            const rssData = await rssResponse.json();
            
            // Load webhook integrations
            const webhookResponse = await fetch('/api/integrations/webhooks');
            const webhookData = await webhookResponse.json();
            
            const allIntegrations = [
                ...(rssData.success ? rssData.data : []),
                ...(webhookData.success ? webhookData.data : [])
            ];
            
            setIntegrations(allIntegrations);
            
            // Update stats
            setStats({
                totalContent: 0, // TODO: Implement content count endpoint
                rssFeeds: (rssData.success ? rssData.data : []).length,
                webhooks: (webhookData.success ? webhookData.data : []).length,
                lastSync: allIntegrations.reduce((latest, integration) => {
                    const syncTime = integration.lastSync || integration.updatedAt;
                    return !latest || (syncTime && new Date(syncTime) > new Date(latest)) ? syncTime : latest;
                }, '') || 'Never'
            });
        } catch (error) {
            console.error('Failed to load integrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Settings },
        { id: 'rss', label: 'RSS Feeds', icon: Rss },
        { id: 'webhooks', label: 'Webhooks', icon: Webhook },
        { id: 'export', label: 'Export & Import', icon: Download }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center space-x-3 text-primary">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span>Loading integrations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-h1-md md:text-h1 text-primary mb-4">
                    🔗 Integration & Automation Hub
                </h1>
                <p className="text-primary/80 text-lg max-w-3xl">
                    Connect external platforms, automate content capture, and manage your data exports.
                    Streamline your workflow by integrating with RSS feeds, webhooks, and various export formats.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary/60 text-sm font-medium">Total Content</p>
                            <p className="text-2xl font-bold text-primary">{stats.totalContent}</p>
                        </div>
                        <Upload className="w-8 h-8 text-primary/40" />
                    </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary/60 text-sm font-medium">RSS Feeds</p>
                            <p className="text-2xl font-bold text-primary">{stats.rssFeeds}</p>
                        </div>
                        <Rss className="w-8 h-8 text-primary/40" />
                    </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary/60 text-sm font-medium">Webhooks</p>
                            <p className="text-2xl font-bold text-primary">{stats.webhooks}</p>
                        </div>
                        <Webhook className="w-8 h-8 text-primary/40" />
                    </div>
                </div>
                
                <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-primary/60 text-sm font-medium">Last Sync</p>
                            <p className="text-sm font-bold text-primary">
                                {stats.lastSync === 'Never' ? 'Never' : new Date(stats.lastSync).toLocaleDateString()}
                            </p>
                        </div>
                        <RefreshCw className="w-8 h-8 text-primary/40" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-primary/10 mb-8">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-primary/60 hover:text-primary hover:border-primary/30'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-8">
                {activeTab === 'overview' && (
                    <OverviewTab integrations={integrations} onRefresh={loadIntegrations} />
                )}
                {activeTab === 'rss' && (
                    <RSSFeedManager onUpdate={loadIntegrations} />
                )}
                {activeTab === 'webhooks' && (
                    <WebhookManager onUpdate={loadIntegrations} />
                )}
                {activeTab === 'export' && (
                    <ExportManager />
                )}
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab: FC<{ integrations: IntegrationConfig[]; onRefresh: () => void }> = ({ 
    integrations, 
    onRefresh 
}) => {
    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-h4 font-semibold text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center space-x-3 p-4 bg-secondary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                        <Plus className="w-5 h-5 text-primary" />
                        <span className="text-primary font-medium">Add RSS Feed</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 bg-secondary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">
                        <Plus className="w-5 h-5 text-primary" />
                        <span className="text-primary font-medium">Setup Webhook</span>
                    </button>
                    <button 
                        onClick={onRefresh}
                        className="flex items-center space-x-3 p-4 bg-secondary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                        <RefreshCw className="w-5 h-5 text-primary" />
                        <span className="text-primary font-medium">Refresh All</span>
                    </button>
                </div>
            </div>

            {/* Active Integrations */}
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                <h3 className="text-h4 font-semibold text-primary mb-4">Active Integrations</h3>
                {integrations.length === 0 ? (
                    <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-primary/40 mx-auto mb-4" />
                        <p className="text-primary/60">No integrations configured yet.</p>
                        <p className="text-sm text-primary/40 mt-2">Get started by adding an RSS feed or setting up a webhook.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {integrations.map((integration, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-secondary border border-primary/10 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    {integration.platform === 'rss' ? (
                                        <Rss className="w-5 h-5 text-primary" />
                                    ) : (
                                        <Webhook className="w-5 h-5 text-primary" />
                                    )}
                                    <div>
                                        <p className="font-medium text-primary">{integration.platform.toUpperCase()}</p>
                                        <p className="text-sm text-primary/60">
                                            Last sync: {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {integration.enabled ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <span className="text-sm text-green-600 font-medium">Active</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-5 h-5 text-red-500" />
                                            <span className="text-sm text-red-600 font-medium">Inactive</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};