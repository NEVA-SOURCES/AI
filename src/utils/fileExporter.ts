import JSZip from "jszip";
import { FileItem, OutputItem } from "../types";

/**
 * Robust Client-Side File & ZIP Generation and Exporter
 */

export function getPredefinedFileContent(name: string, mimeType?: string): string {
  if (name.endsWith(".ts") || name.endsWith(".tsx")) {
    return `/**
 * @file ${name}
 * @description NEVA Enterprise Cognitive Workspace Systems Bundle
 * @timestamp ${new Date().toLocaleString()}
 */

import { useState, useEffect } from "react";

export interface CoreEngineOptions {
  activeWorkspaceId: string;
  threadingLevel: "balanced" | "ultra-deep";
  groundingEnabled: boolean;
}

export class CoreProcessor {
  private options: CoreEngineOptions;

  constructor(options: CoreEngineOptions) {
    this.options = options;
    console.log("[CoreProcessor] Initialized neural pathway routing with parameters:", options);
  }

  public async evaluateTrajectory(inputs: any[]): Promise<Record<string, any>> {
    console.log("[CoreProcessor] Analyzing operational input arrays of length:", inputs.length);
    return {
      success: true,
      confidence: 0.9852,
      latencyMs: 142,
      timestamp: new Date().toISOString()
    };
  }
}
`;
  } else if (name.endsWith(".csv")) {
    return `"Quarter","Revenue_USD","Target_Achieved","Profit_Margin","Operational_Cost"\n"Q1_2026",1520040.50,"Yes","18.4%",1240000.00\n"Q2_2026",2450000.00,"Yes","22.8%",1890000.00\n"Q3_2026",2890400.00,"Yes","25.1%",2160000.00\n"Q4_2026",3420000.00,"No","24.2%",2590000.00\n"Q1_2027",3890100.00,"Yes","26.7%",2850000.00\n`;
  } else if (name.endsWith(".json")) {
    return `{
  "appId": "neva-brain-monitoring-system",
  "version": "1.0.4",
  "status": "synchronized",
  "configurations": {
    "engine": "Gemini-2.5-Pro-Cognitive-Direct",
    "securitySandboxEnabled": true,
    "temperature": 0.35,
    "maxTokenWindow": 1048576,
    "routingPathways": [
      "/systems/grounding/openrouter",
      "/systems/validation/integrity-guard"
    ]
  }
}`;
  } else if (name.endsWith(".md")) {
    return `# Neva Workspace System Ledger: ${name}

This ledger represents the active knowledge indexing schema and system constraints currently bound within the secure thread context.

## Directives
- Standard Inter-Agent Communication protocols are operational.
- All file edits must undergo Sandbox Safety review procedures.
- Grounding indices are auto-correlated upon web queries.

### Metrics
- Parse status: Done
- System context scope: Active
- Created: ${new Date().toLocaleString()}
`;
  } else {
    return `Neva Cognition Workspace Log\n============================\n\nFile Name: ${name}\nMime Type: ${mimeType || "text/plain"}\nCreated At: ${new Date().toISOString()}\n\nDefault workspace representation generated successfully. No malware traces identified. Integrity secure.`;
  }
}

/**
 * Direct file download helper
 */
export function downloadRawFile(filename: string, content: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Single file download helper with automated content mapping based on name
 */
export function downloadFileItem(file: FileItem) {
  const content = getPredefinedFileContent(file.name, file.mimeType);
  downloadRawFile(file.name, content, file.mimeType);
}

/**
 * Downloads multiple workspace files compressed into a ZIP folder
 */
export async function downloadFilesAsZip(filesList: FileItem[], archiveName: string = "neva_workspace_archive.zip") {
  if (filesList.length === 0) return;
  const zip = new JSZip();

  filesList.forEach(file => {
    const fileContent = getPredefinedFileContent(file.name, file.mimeType);
    zip.file(file.name, fileContent);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = archiveName.endsWith(".zip") ? archiveName : `${archiveName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export Output items (from OutputStudio) as raw file
 */
export function downloadOutputItem(output: OutputItem, format: "md" | "txt" | "json" = "md") {
  let content = output.contentInline;
  let filename = output.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  let mimeType = "text/markdown";

  if (format === "json") {
    content = JSON.stringify(output, null, 2);
    filename += ".json";
    mimeType = "application/json";
  } else if (format === "txt") {
    // Strip markdown chars for standard text download
    content = output.contentInline.replace(/[#*`_-]/g, "");
    filename += ".txt";
    mimeType = "text/plain";
  } else {
    filename += ".md";
  }

  downloadRawFile(filename, content, mimeType);
}

/**
 * Downloads multiple Output items packed in a ZIP archive
 */
export async function downloadOutputsAsZip(outputsList: OutputItem[], archiveName: string = "neva_outputs_archive.zip") {
  if (outputsList.length === 0) return;
  const zip = new JSZip();

  outputsList.forEach(output => {
    const filename = `${output.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    zip.file(filename, output.contentInline);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = archiveName.endsWith(".zip") ? archiveName : `${archiveName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
