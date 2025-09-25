// Export API Routes for Integration & Automation Hub

import type { APIRoute } from 'astro';
import { exportUtils } from '../../../libs/integrations/exportUtils';
import type { ExportConfig, APIResponse } from '../../../types/integration';

// POST /api/integrations/export - Export content in various formats
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const config: ExportConfig = body;

    // Validate export configuration
    if (!config.format || !['csv', 'json', 'pdf'].includes(config.format)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid export format. Must be csv, json, or pdf'
      } as APIResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!config.filename) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Filename is required'
      } as APIResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let result;
    let contentType = 'application/octet-stream';
    let contentDisposition = '';

    switch (config.format) {
      case 'csv':
        result = await exportUtils.exportToCSV(config);
        contentType = 'text/csv';
        contentDisposition = `attachment; filename="${result.filename}"`;
        break;
      
      case 'json':
        result = await exportUtils.exportToJSON(config);
        contentType = 'application/json';
        contentDisposition = `attachment; filename="${result.filename}"`;
        break;
      
      case 'pdf':
        result = await exportUtils.exportToPDF(config);
        contentType = 'application/pdf';
        contentDisposition = `attachment; filename="${result.filename}"`;
        break;
    }

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error
      } as APIResponse), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Return file data for download
    const responseData = result.data;
    
    return new Response(responseData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as APIResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET /api/integrations/export/portfolio - Generate public portfolio
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const userId = searchParams.get('userId') || 'default';

    const result = await exportUtils.generatePublicPortfolio(userId);

    if (!result.success) {
      return new Response(JSON.stringify({
        success: false,
        error: result.error
      } as APIResponse), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(result.html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    } as APIResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};