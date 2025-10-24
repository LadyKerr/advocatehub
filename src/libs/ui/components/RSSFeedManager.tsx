import { type FC, useState, useEffect } from "react";
import { 
    Plus, 
    Trash2, 
    RefreshCw, 
    ExternalLink, 
    CheckCircle, 
    XCircle,
    AlertCircle,
    Clock,
    Rss
} from "lucide-react";
import type { RSSFeedConfig, ImportResult } from "../../../types/integration";

interface RSSFeedManagerProps {
    onUpdate: () => void;
}

export const RSSFeedManager: FC<RSSFeedManagerProps> = ({ onUpdate }) => {
    const [feeds, setFeeds] = useState<RSSFeedConfig[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [importing, setImporting] = useState<string | null>(null);

    useEffect(() => {
        loadFeeds();
    }, []);

    const loadFeeds = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/integrations/rss');
            const data = await response.json();
            if (data.success) {
                setFeeds(data.data);
            }
        } catch (error) {
            console.error('Failed to load RSS feeds:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (feedUrl: string) => {
        const feed = feeds.find(f => f.config.feedUrl === feedUrl);
        if (!feed) return;

        try {
            setImporting(feedUrl);
            const response = await fetch('/api/integrations/rss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'import',
                    config: feed
                })
            });
            
            const result = await response.json();
            if (result.success) {
                // Show success message or update UI
                console.log('Import successful:', result.data);
                onUpdate();
                await loadFeeds(); // Refresh feeds to update lastSync
            } else {
                console.error('Import failed:', result.error);
            }
        } catch (error) {
            console.error('Import error:', error);
        } finally {
            setImporting(null);
        }
    };

    const handleDelete = async (feedUrl: string) => {
        if (!confirm('Are you sure you want to delete this RSS feed?')) return;

        try {
            const response = await fetch(`/api/integrations/rss?feedUrl=${encodeURIComponent(feedUrl)}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                await loadFeeds();
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete RSS feed:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-primary mr-2" />
                <span className="text-primary">Loading RSS feeds...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-h2-md md:text-h2 text-primary">RSS Feed Management</h2>
                    <p className="text-primary/60 mt-2">
                        Import content automatically from your favorite blogs and feeds.
                    </p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add RSS Feed</span>
                </button>
            </div>

            {/* Add Feed Form */}
            {showAddForm && (
                <AddFeedForm
                    onClose={() => setShowAddForm(false)}
                    onSuccess={() => {
                        setShowAddForm(false);
                        loadFeeds();
                        onUpdate();
                    }}
                />
            )}

            {/* RSS Feeds List */}
            {feeds.length === 0 ? (
                <div className="text-center py-12 bg-primary/5 rounded-xl border border-primary/10">
                    <Rss className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No RSS Feeds Yet</h3>
                    <p className="text-primary/60 mb-4">Start by adding your first RSS feed to import content automatically.</p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Your First RSS Feed</span>
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {feeds.map((feed) => (
                        <div key={feed.config.feedUrl} className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-primary">
                                            {feed.config.feedTitle}
                                        </h3>
                                        {feed.enabled ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-primary/60 mb-3">
                                        <a
                                            href={feed.config.feedUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-1 hover:text-primary transition-colors"
                                        >
                                            <span>{feed.config.feedUrl}</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    </div>

                                    <div className="flex items-center space-x-6 text-sm text-primary/60">
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-4 h-4" />
                                            <span>Every {feed.config.checkInterval} minutes</span>
                                        </div>
                                        <div>
                                            Last check: {feed.config.lastCheck 
                                                ? new Date(feed.config.lastCheck).toLocaleString()
                                                : 'Never'
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleImport(feed.config.feedUrl)}
                                        disabled={importing === feed.config.feedUrl}
                                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors disabled:opacity-50"
                                    >
                                        {importing === feed.config.feedUrl ? (
                                            <>
                                                <RefreshCw className="w-3 h-3 animate-spin" />
                                                <span>Importing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-3 h-3" />
                                                <span>Import Now</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={() => handleDelete(feed.config.feedUrl)}
                                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// Add Feed Form Component
const AddFeedForm: FC<{
    onClose: () => void;
    onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
    const [feedUrl, setFeedUrl] = useState('');
    const [feedTitle, setFeedTitle] = useState('');
    const [checkInterval, setCheckInterval] = useState(60);
    const [autoImport, setAutoImport] = useState(true);
    const [validating, setValidating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [validationResult, setValidationResult] = useState<{
        valid: boolean;
        error?: string;
        feedInfo?: { title: string; description: string; itemCount: number };
    } | null>(null);

    const validateFeed = async () => {
        if (!feedUrl.trim()) return;

        try {
            setValidating(true);
            const response = await fetch(`/api/integrations/rss?action=validate&url=${encodeURIComponent(feedUrl)}`);
            const result = await response.json();
            
            setValidationResult(result);
            if (result.success && result.data) {
                setFeedTitle(result.data.title);
            }
        } catch (error) {
            setValidationResult({ valid: false, error: 'Failed to validate feed' });
        } finally {
            setValidating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validationResult?.valid) return;

        try {
            setSaving(true);
            const response = await fetch('/api/integrations/rss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config: {
                        feedUrl,
                        feedTitle,
                        checkInterval,
                        autoImport
                    },
                    enabled: true
                })
            });
            
            if (response.ok) {
                onSuccess();
            }
        } catch (error) {
            console.error('Failed to save RSS feed:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
            <h3 className="text-lg font-semibold text-primary mb-4">Add RSS Feed</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                        RSS Feed URL
                    </label>
                    <div className="flex space-x-2">
                        <input
                            type="url"
                            value={feedUrl}
                            onChange={(e) => setFeedUrl(e.target.value)}
                            placeholder="https://example.com/feed.xml"
                            className="flex-1 px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            required
                        />
                        <button
                            type="button"
                            onClick={validateFeed}
                            disabled={!feedUrl.trim() || validating}
                            className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                            {validating ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                'Validate'
                            )}
                        </button>
                    </div>
                    
                    {validationResult && (
                        <div className={`mt-2 p-3 rounded-lg ${
                            validationResult.valid 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            {validationResult.valid ? (
                                <div className="flex items-center space-x-2 text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">
                                        Valid feed found: {validationResult.feedInfo?.itemCount} items
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 text-red-700">
                                    <XCircle className="w-4 h-4" />
                                    <span className="text-sm">{validationResult.error}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {validationResult?.valid && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Feed Title
                            </label>
                            <input
                                type="text"
                                value={feedTitle}
                                onChange={(e) => setFeedTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Check Interval (minutes)
                            </label>
                            <select
                                value={checkInterval}
                                onChange={(e) => setCheckInterval(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                                <option value={120}>2 hours</option>
                                <option value={360}>6 hours</option>
                                <option value={720}>12 hours</option>
                                <option value={1440}>24 hours</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="autoImport"
                                checked={autoImport}
                                onChange={(e) => setAutoImport(e.target.checked)}
                                className="rounded border-primary/20"
                            />
                            <label htmlFor="autoImport" className="text-sm text-primary">
                                Automatically import new content
                            </label>
                        </div>
                    </>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-primary/60 hover:text-primary transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!validationResult?.valid || saving}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>Add Feed</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};