// Export Utilities for Integration & Automation Hub

import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import type { ContentItem, ExportConfig } from '../../types/integration';
import { contentStore } from './contentStore';

export class ExportUtils {
  
  async exportToCSV(config: ExportConfig): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      const items = await contentStore.filterContent(config.filters);
      
      // Prepare data for CSV export
      const csvData = items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        url: item.url,
        publishedAt: item.publishedAt,
        tags: item.tags.join('; '),
        importSource: item.importSource?.type || 'manual',
        sourceUrl: item.importSource?.sourceUrl || '',
        ...(config.options?.includeMetadata && item.metadata ? item.metadata : {}),
        ...(config.options?.includeContent ? { content: item.content } : {})
      }));

      const csv = Papa.unparse(csvData);
      const filename = config.filename.endsWith('.csv') ? config.filename : `${config.filename}.csv`;

      return {
        success: true,
        data: csv,
        filename
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export CSV'
      };
    }
  }

  async exportToJSON(config: ExportConfig): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    try {
      const items = await contentStore.filterContent(config.filters);
      
      // Prepare data for JSON export
      let exportData = items;
      
      if (!config.options?.includeContent) {
        exportData = items.map(item => {
          const { content, ...itemWithoutContent } = item;
          return itemWithoutContent;
        });
      }
      
      if (!config.options?.includeMetadata) {
        exportData = exportData.map(item => {
          const { metadata, ...itemWithoutMetadata } = item;
          return itemWithoutMetadata;
        });
      }

      const json = JSON.stringify({
        exportDate: new Date().toISOString(),
        totalItems: items.length,
        filters: config.filters,
        items: exportData
      }, null, 2);

      const filename = config.filename.endsWith('.json') ? config.filename : `${config.filename}.json`;

      return {
        success: true,
        data: json,
        filename
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export JSON'
      };
    }
  }

  async exportToPDF(config: ExportConfig): Promise<{ success: boolean; data?: Uint8Array; filename?: string; error?: string }> {
    try {
      const items = await contentStore.filterContent(config.filters);
      const template = config.options?.pdfTemplate || 'report';
      
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      const title = template === 'portfolio' ? 'Content Portfolio' : 
                   template === 'summary' ? 'Content Summary' : 'Content Report';
      doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Export info
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 5;
      doc.text(`Total Items: ${items.length}`, margin, yPosition);
      yPosition += 15;

      // Content items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Check if we need a new page
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = margin;
        }

        // Item title
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const titleLines = doc.splitTextToSize(item.title, pageWidth - 2 * margin);
        doc.text(titleLines, margin, yPosition);
        yPosition += titleLines.length * 5 + 5;

        // Item details
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        
        // Type and date
        doc.text(`Type: ${item.type} | Published: ${new Date(item.publishedAt).toLocaleDateString()}`, margin, yPosition);
        yPosition += 5;

        // URL
        if (item.url) {
          doc.text(`URL: ${item.url}`, margin, yPosition);
          yPosition += 5;
        }

        // Tags
        if (item.tags.length > 0) {
          doc.text(`Tags: ${item.tags.join(', ')}`, margin, yPosition);
          yPosition += 5;
        }

        // Description
        if (item.description) {
          const descLines = doc.splitTextToSize(`Description: ${item.description}`, pageWidth - 2 * margin);
          doc.text(descLines, margin, yPosition);
          yPosition += descLines.length * 4 + 5;
        }

        // Content preview (for report template)
        if (template === 'report' && config.options?.includeContent && item.content) {
          const contentPreview = item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '');
          const contentLines = doc.splitTextToSize(`Content: ${contentPreview}`, pageWidth - 2 * margin);
          doc.text(contentLines, margin, yPosition);
          yPosition += contentLines.length * 4;
        }

        yPosition += 10; // Space between items
      }

      // Footer with page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      }

      const pdfData = doc.output('arraybuffer');
      const filename = config.filename.endsWith('.pdf') ? config.filename : `${config.filename}.pdf`;

      return {
        success: true,
        data: new Uint8Array(pdfData),
        filename
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to export PDF'
      };
    }
  }

  async generatePublicPortfolio(userId: string): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
      const items = await contentStore.getAllContent();
      
      // Group items by type
      const itemsByType = items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      }, {} as Record<string, ContentItem[]>);

      // Generate HTML portfolio
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Portfolio</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .content-type { margin-bottom: 30px; }
        .content-item { border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 6px; background: #fafafa; }
        .content-title { font-weight: bold; font-size: 1.1em; color: #007acc; margin-bottom: 8px; }
        .content-meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
        .content-tags { margin-top: 10px; }
        .tag { background: #007acc; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; }
        .stats { background: #f0f8ff; padding: 20px; border-radius: 6px; margin-bottom: 30px; }
        .stat-item { display: inline-block; margin-right: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Content Portfolio</h1>
        
        <div class="stats">
            <div class="stat-item"><strong>Total Items:</strong> ${items.length}</div>
            <div class="stat-item"><strong>Content Types:</strong> ${Object.keys(itemsByType).length}</div>
            <div class="stat-item"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
        </div>

        ${Object.entries(itemsByType).map(([type, typeItems]) => `
        <div class="content-type">
            <h2>${type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')} (${typeItems.length})</h2>
            ${typeItems.map(item => `
            <div class="content-item">
                <div class="content-title">${item.title}</div>
                <div class="content-meta">
                    Published: ${new Date(item.publishedAt).toLocaleDateString()}
                    ${item.url ? ` | <a href="${item.url}" target="_blank">View Original</a>` : ''}
                </div>
                ${item.description ? `<div class="content-description">${item.description}</div>` : ''}
                ${item.tags.length > 0 ? `
                <div class="content-tags">
                    ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                ` : ''}
            </div>
            `).join('')}
        </div>
        `).join('')}
    </div>
</body>
</html>`;

      return {
        success: true,
        html
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate portfolio'
      };
    }
  }
}

export const exportUtils = new ExportUtils();