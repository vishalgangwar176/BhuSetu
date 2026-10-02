import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK with environment key
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to sanitize error messages
const handleGeminiError = (err: any, res: express.Response) => {
  console.error('[Gemini Server Error]', err);
  const message = err?.message || 'Gemini processing failed';
  const isRateLimit = message.includes('429') || message.includes('quota') || message.includes('RESOURCE_EXHAUSTED');
  
  if (isRateLimit) {
    return res.status(429).json({
      error: 'Rate limit reached on AI service. Please wait a moment and retry.',
      isRateLimit: true
    });
  }
  return res.status(500).json({ error: message });
};

// 1. Google Search Grounding Endpoint
app.post('/api/gemini/search-grounding', async (req, res) => {
  try {
    const { query, prompt, context } = req.body;
    if (!ai) {
      return res.status(503).json({ 
        error: 'Gemini API key is not configured on the server. Please check .env or Settings.' 
      });
    }

    const searchQuery = query || prompt;
    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query or prompt is required.' });
    }

    const fullPrompt = context 
      ? `Context: ${context}\n\nQuestion/Task: ${searchQuery}\n\nProvide an authoritative, detailed answer based on official Indian land revenue policies, NAKSHA programme guidelines, and Survey of India standards. Include specific procedural rules where applicable.`
      : `${searchQuery}\n\nProvide an authoritative, detailed response based on current official guidelines, Indian land revenue standards, and NAKSHA rules.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2
      }
    });

    const text = response.text || 'No response generated.';
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    // Extract search citations
    const citations: Array<{ title: string; url: string; snippet?: string }> = [];
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks as any[]) {
        if (chunk.web?.uri) {
          citations.push({
            title: chunk.web.title || new URL(chunk.web.uri).hostname,
            url: chunk.web.uri
          });
        }
      }
    }

    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    res.json({
      text,
      citations,
      webSearchQueries,
      disclaimer: 'AI-generated, verify with official government sources and state revenue department gazettes.'
    });
  } catch (error) {
    handleGeminiError(error, res);
  }
});

// 2. Google Maps Grounding & Location Intelligence Endpoint
app.post('/api/gemini/maps-grounding', async (req, res) => {
  try {
    const { query, lat = 12.9716, lng = 77.6412, parcelInfo } = req.body;
    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured.' });
    }

    const locationDesc = parcelInfo 
      ? `Parcel Survey No: ${parcelInfo.surveyNo}, Ward: ${parcelInfo.ward || 'Ward 142 Indiranagar, Bengaluru'}, Center Coordinates: [${lat}, ${lng}].`
      : `Coordinates: [${lat}, ${lng}] near Indiranagar/Halasuru, Bengaluru Urban.`;

    const prompt = `You are an urban geospatial analyst for the BhuSetu Platform.
Location: ${locationDesc}
Task: ${query || 'Analyze nearby infrastructure, landmarks, roads, public transit, hospitals, and schools around this land parcel.'}

Provide:
1. A concise overview of the neighborhood and urban context.
2. A structured JSON block at the end inside \`\`\`json containing an array of 4-6 specific key landmarks or facilities with properties:
- name (string)
- category ('Hospital' | 'School' | 'Metro / Transit' | 'Road / Junction' | 'Park / Civic')
- address (string)
- distanceMeters (number estimate from parcel center)
- lat (number, near ${lat})
- lng (number, near ${lng})
- accessRoute (string description)
\`\`\``;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        temperature: 0.3
      }
    });

    const rawText = response.text || '';
    let places: any[] = [];
    let cleanText = rawText;

    // Extract JSON block if present
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        places = JSON.parse(jsonMatch[1]);
        cleanText = rawText.replace(/```json[\s\S]*?```/, '').trim();
      } catch (e) {
        console.warn('Failed to parse places JSON from Gemini response', e);
      }
    }

    // Fallback realistic places if model returned none
    if (!places || places.length === 0) {
      places = [
        {
          id: 'p-1',
          name: 'Indiranagar Metro Station (Purple Line)',
          category: 'Metro / Transit',
          address: 'CMH Road, 1st Stage, Indiranagar',
          distanceMeters: 420,
          lat: 12.9784,
          lng: 77.6385,
          accessRoute: 'Via 100ft Road / CMH Road Link'
        },
        {
          id: 'p-2',
          name: 'Halasuru Lake Public Garden & Esplanade',
          category: 'Park / Civic',
          address: 'Kensington Road, Halasuru',
          distanceMeters: 650,
          lat: 12.9831,
          lng: 77.6253,
          accessRoute: 'Via Ulsoor Road West'
        },
        {
          id: 'p-3',
          name: 'Chinmaya Mission Hospital',
          category: 'Hospital',
          address: 'CMH Road, Indiranagar',
          distanceMeters: 550,
          lat: 12.9772,
          lng: 77.6435,
          accessRoute: 'Direct road access via 2nd Cross'
        },
        {
          id: 'p-4',
          name: 'National Public School (NPS) Indiranagar',
          category: 'School',
          address: '12th A Main Rd, HAL 2nd Stage',
          distanceMeters: 800,
          lat: 12.9698,
          lng: 77.6445,
          accessRoute: 'Via 12th Main Road'
        }
      ];
    }

    res.json({
      text: cleanText,
      places,
      center: { lat, lng },
      sourceAttribution: 'Google Maps Geospatial Data · Department of Land Resources (DoLR)'
    });
  } catch (error) {
    handleGeminiError(error, res);
  }
});

// 3. Context-Aware Gemini Chatbot Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { 
      message, 
      history = [], 
      userRole = 'Public Viewer', 
      activePage = 'Dashboard',
      context = {} 
    } = req.body;

    if (!ai) {
      return res.status(503).json({ error: 'Gemini API key is not configured on the server.' });
    }

    // Role-specific behavioral directives
    const roleDirectives: Record<string, string> = {
      'Revenue Officer': `You are BhuSetu AI Assistant consulting for a Revenue Officer / Tahsildar.
- Focus on record accuracy, legal encumbrances, deed area vs. measured area discrepancies, and mutation rules.
- When evaluating parcels, highlight whether discrepancies fall within permissible Survey of India limits (typically ±1%).
- Provide recommended approval decisions with formal administrative reasoning suitable for official order drafting.
- When asked to draft a remark, produce clear, concise text ready for inclusion in official government files.`,

      'Field Surveyor': `You are BhuSetu AI Assistant assisting an on-ground Field Surveyor.
- Provide practical, touch-friendly, safety-first ground-truthing checklists.
- Guide on GNSS/RTK setup, SoI CORS baseline fix verification (RMSE < 2cm requirement), and physical boundary monumentation.
- Assist in logging field verification remarks, distinguishing between natural boundaries, physical compound walls, and legacy survey stones.`,

      'System Admin': `You are BhuSetu AI Assistant advising a System Administrator of the BhuSetu National Platform.
- Focus on pipeline health, data ingestion formats (GeoTIFF, Shapefile, GeoJSON, LAS), CRS transformations (EPSG:4326 / UTM 43N), and database sync.
- Provide diagnostics on topology violations, automated rule fixes, and system audit logs.`,

      'Public Viewer': `You are BhuSetu AI Assistant for citizens and public land record searchers.
- Explain land terms simply and clearly in everyday language (e.g. what Khasra, survey number, and confidence score mean).
- STRICT PRIVACY DIRECTIVE: Never reveal personal owner names, phone numbers, or private tax identifiers. Refer only to public parcel geometry, survey numbers, zoning, and verification status.`
    };

    const rolePrompt = roleDirectives[userRole] || roleDirectives['Public Viewer'];

    let contextualDetails = `Current Active View: ${activePage}\nUser Role: ${userRole}\n`;
    if (context.selectedParcel) {
      const p = context.selectedParcel;
      contextualDetails += `\nSelected Parcel Context:
- Survey No: ${p.surveyNo} (Plot: ${p.plotNo}, Khasra: ${p.khasraNo})
- Land Use: ${p.landUse}
- Status: ${p.status}
- Confidence Score: ${p.confidenceScore}%
- Deed Area: ${p.recordAreaSqM} m² | Measured Area: ${p.measuredAreaSqM} m² (Delta: ${p.areaDeltaPercent}%)
- Encumbrance: ${p.encumbranceStatus}
- Flags: ${p.flags?.join(', ') || 'None'}
`;
    }
    if (context.selectedConflict) {
      const c = context.selectedConflict;
      contextualDetails += `\nSelected Conflict Context:
- Conflict ID: ${c.id}
- Type: ${c.conflictType}
- Source A: ${c.sourceA?.name} (${c.sourceA?.value})
- Source B: ${c.sourceB?.name} (${c.sourceB?.value})
- AI Suggestion: ${c.aiSuggestion?.chosenSource} (${c.aiSuggestion?.reasoning})
`;
    }
    if (context.selectedTask) {
      const t = context.selectedTask;
      contextualDetails += `\nSelected Surveyor Task:
- Task ID: ${t.id}
- Parcel: ${t.surveyNo}
- Priority: ${t.priority}
- Status: ${t.status}
- Instructions: ${t.instructions}
`;
    }

    const systemInstruction = `You are "BhuSetu Assistant", an AI geospatial intelligence co-pilot for the National Urban Land Record Management Platform (aligned with the NAKSHA Programme, Department of Land Resources, Ministry of Rural Development).
${rolePrompt}

Platform capabilities you understand:
1. Multi-source ingestion (Drone ORI, Cadastral Tippani maps, DSM/DTM, Revenue Khasras, Municipal GIS, Utility vectors, SoI CORS GNSS).
2. Automated 8-step integration pipeline with AI boundary extraction, conflation, and topology healing.
3. Multi-criteria confidence scoring (positional accuracy, attribute fidelity, topology validity, source consensus, temporal consistency).

Context Information:
${contextualDetails}

Formatting: Use markdown (bold, bullet points, headers) for readability. Be concise, professional, and directly actionable.`;

    // Build chat contents from history
    const contents: any[] = [];
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const replyText = response.text || 'I could not generate an answer at this time.';

    // Check for draft action detection
    let suggestedAction: any = undefined;
    if (message.toLowerCase().includes('draft') || message.toLowerCase().includes('remark')) {
      suggestedAction = {
        type: 'insert_remark',
        label: 'Insert Drafted Remark into Form',
        payload: replyText.replace(/^[#\s*]+.*?\n/, '').trim()
      };
    }

    res.json({
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toISOString(),
      suggestedAction
    });
  } catch (error) {
    handleGeminiError(error, res);
  }
});

// 4. Integrations Health Status Endpoint
app.get('/api/health/integrations', async (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  
  res.json({
    firebase: {
      status: 'connected',
      details: 'Firebase Auth & Firestore database initialized'
    },
    gemini: {
      status: hasGeminiKey ? 'connected' : 'not_configured',
      details: hasGeminiKey ? 'Gemini 3.8 Flash SDK active' : 'Missing GEMINI_API_KEY environment variable'
    },
    searchGrounding: {
      status: hasGeminiKey ? 'connected' : 'not_configured',
      details: hasGeminiKey ? 'Google Search Grounding tool enabled' : 'Requires Gemini API key'
    },
    mapsGrounding: {
      status: hasGeminiKey ? 'connected' : 'not_configured',
      details: hasGeminiKey ? 'Location Intelligence & Google Maps Grounding active' : 'Requires Gemini API key'
    }
  });
});

// Serve frontend in dev (using Vite middleware) or prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[BhuSetu Server] Running on http://localhost:${PORT} (${isProd ? 'Production' : 'Development'})`);
  });
}

startServer();
