import { type FC, useState } from "react";
import { 
    Download, 
    FileText, 
    FileSpreadsheet, 
    FileImage, 
    Upload,
    Calendar,
    Tag,
    Filter,
    ExternalLink,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import type { ExportConfig } from "../../../types/integration";

export const ExportManager: FC = () => {
    const [activeTab, setActiveTab] = useState<'export' | 'import' | 'portfolio'>('export');
    const [exportConfig, setExportConfig] = useState<Partial<ExportConfig>>({
        format: 'json',
        filename: 'content-export',
        options: {
            includeContent: true,
            includeMetadata: true,
            pdfTemplate: 'report'
        }
    });
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        if (!exportConfig.format || !exportConfig.filename) return;

        try {
            setExporting(true);
            const response = await fetch('/api/integrations/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(exportConfig)
            });

            if (response.ok) {
                // Create download link
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = exportConfig.filename || 'export';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const generatePortfolio = async () => {
        try {
            const response = await fetch('/api/integrations/export/portfolio');
            if (response.ok) {
                const html = await response.text();
                const newWindow = window.open();
                if (newWindow) {
                    newWindow.document.write(html);
                    newWindow.document.close();
                }
            }
        } catch (error) {
            console.error('Portfolio generation failed:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-h2-md md:text-h2 text-primary">Export & Data Management</h2>
                <p className="text-primary/60 mt-2">
                    Export your content in various formats, import data from other tools, and generate public portfolios.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-primary/10">
                <nav className="flex space-x-8">
                    {[
                        { id: 'export', label: 'Export Content', icon: Download },
                        { id: 'import', label: 'Import Data', icon: Upload },
                        { id: 'portfolio', label: 'Public Portfolio', icon: ExternalLink }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-primary/60 hover:text-primary hover:border-primary/30'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Export Tab */}
            {activeTab === 'export' && (
                <div className="space-y-6">
                    {/* Export Formats */}
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                        <h3 className="text-lg font-semibold text-primary mb-4">Choose Export Format</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                {
                                    format: 'csv',
                                    title: 'CSV Export',
                                    description: 'Spreadsheet format for analysis and reporting',
                                    icon: FileSpreadsheet,
                                    color: 'bg-green-100 text-green-700'
                                },
                                {
                                    format: 'json',
                                    title: 'JSON Export',
                                    description: 'Complete data export for backup and migration',
                                    icon: FileText,
                                    color: 'bg-blue-100 text-blue-700'
                                },
                                {
                                    format: 'pdf',
                                    title: 'PDF Report',
                                    description: 'Professional reports for sharing and presentation',
                                    icon: FileImage,
                                    color: 'bg-red-100 text-red-700'
                                }
                            ].map((format) => {
                                const Icon = format.icon;
                                const isSelected = exportConfig.format === format.format;
                                
                                return (
                                    <button
                                        key={format.format}
                                        onClick={() => setExportConfig(prev => ({ ...prev, format: format.format as any }))}
                                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                                            isSelected 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-primary/10 hover:border-primary/30'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className={`p-2 rounded-lg ${format.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-semibold text-primary">{format.title}</h4>
                                            {isSelected && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                                        </div>
                                        <p className="text-sm text-primary/60">{format.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Export Configuration */}
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                        <h3 className="text-lg font-semibold text-primary mb-4">Export Configuration</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Settings */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Filename
                                    </label>
                                    <input
                                        type="text"
                                        value={exportConfig.filename || ''}
                                        onChange={(e) => setExportConfig(prev => ({ ...prev, filename: e.target.value }))}
                                        placeholder="content-export"
                                        className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Content Types
                                    </label>
                                    <div className="space-y-2">
                                        {['blog-post', 'video', 'podcast', 'article', 'release'].map((type) => (
                                            <label key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="rounded border-primary/20"
                                                />
                                                <span className="text-sm text-primary capitalize">
                                                    {type.replace('-', ' ')}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Settings */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">
                                        Date Range
                                    </label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="date"
                                            className="flex-1 px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                        <input
                                            type="date"
                                            className="flex-1 px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={exportConfig.options?.includeContent}
                                            onChange={(e) => setExportConfig(prev => ({
                                                ...prev,
                                                options: { ...prev.options, includeContent: e.target.checked }
                                            }))}
                                            className="rounded border-primary/20"
                                        />
                                        <span className="text-sm text-primary">Include full content</span>
                                    </label>
                                    
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={exportConfig.options?.includeMetadata}
                                            onChange={(e) => setExportConfig(prev => ({
                                                ...prev,
                                                options: { ...prev.options, includeMetadata: e.target.checked }
                                            }))}
                                            className="rounded border-primary/20"
                                        />
                                        <span className="text-sm text-primary">Include metadata</span>
                                    </label>
                                </div>

                                {exportConfig.format === 'pdf' && (
                                    <div>
                                        <label className="block text-sm font-medium text-primary mb-2">
                                            PDF Template
                                        </label>
                                        <select
                                            value={exportConfig.options?.pdfTemplate}
                                            onChange={(e) => setExportConfig(prev => ({
                                                ...prev,
                                                options: { ...prev.options, pdfTemplate: e.target.value as any }
                                            }))}
                                            className="w-full px-3 py-2 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="report">Detailed Report</option>
                                            <option value="summary">Summary View</option>
                                            <option value="portfolio">Portfolio Format</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Export Button */}
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleExport}
                                disabled={exporting || !exportConfig.format || !exportConfig.filename}
                                className="flex items-center space-x-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {exporting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                                        <span>Exporting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        <span>Export Content</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
                <div className="space-y-6">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                        <h3 className="text-lg font-semibold text-primary mb-4">Import Data</h3>
                        <div className="text-center py-8">
                            <Upload className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                            <p className="text-primary/60 mb-4">
                                Import functionality is coming soon! This feature will allow you to:
                            </p>
                            <div className="text-left max-w-md mx-auto space-y-2 text-sm text-primary/60">
                                <p>• Import content from CSV files</p>
                                <p>• Migrate data from other platforms</p>
                                <p>• Restore from JSON backups</p>
                                <p>• Bulk upload content items</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
                <div className="space-y-6">
                    <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                        <h3 className="text-lg font-semibold text-primary mb-4">Public Portfolio</h3>
                        <p className="text-primary/60 mb-6">
                            Generate a public HTML portfolio showcasing your content. Perfect for sharing your work with others.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-primary mb-3">Portfolio Features</h4>
                                <div className="space-y-2 text-sm text-primary/60">
                                    <p>✓ Responsive design that works on all devices</p>
                                    <p>✓ Organized by content type and date</p>
                                    <p>✓ Links to original content sources</p>
                                    <p>✓ Professional styling and layout</p>
                                    <p>✓ SEO-friendly HTML structure</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-semibold text-primary mb-3">Usage Ideas</h4>
                                <div className="space-y-2 text-sm text-primary/60">
                                    <p>• Share with potential employers</p>
                                    <p>• Include in your personal website</p>
                                    <p>• Send to collaborators and partners</p>
                                    <p>• Use for speaking opportunities</p>
                                    <p>• Archive your content history</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button
                                onClick={generatePortfolio}
                                className="flex items-center space-x-2 px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Generate Portfolio</span>
                            </button>
                        </div>
                    </div>

                    {/* Portfolio Preview */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Portfolio Preview</h4>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="text-center mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">Content Portfolio</h1>
                                <div className="flex justify-center space-x-4 text-sm text-gray-600 mt-2">
                                    <span>Total Items: 0</span>
                                    <span>Content Types: 0</span>
                                    <span>Generated: {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-center text-gray-500 py-8">
                                <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No content available for preview</p>
                                <p className="text-sm">Add content through RSS feeds or webhooks to see it here</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};