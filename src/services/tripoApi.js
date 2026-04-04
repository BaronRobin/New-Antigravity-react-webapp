// src/services/tripoApi.js

/**
 * Submits a text-to-3D task to the Tripo AI API and polls for completion.
 * @param {string} userDescription The raw design description from the user
 * @returns {Promise<string>} The URL of the generated .glb file
 */
export const generateGrillzMesh = async (userDescription, version = null) => {
    const API_KEY = import.meta.env.VITE_TRIPO_API_KEY;
    
    if (!API_KEY) {
        throw new Error("Tripo API key is missing from environment variables.");
    }

    let systemPrompt = `A flawless, isolated 3D model of custom dental grillz jewelry, floating on a neutral background. NO face, NO lips, NO skin, NO gums. Only the metallic upper and lower dental arch. Highly detailed, photorealistic, studio lighting.`;
    if (userDescription && userDescription.trim().length > 0) {
        systemPrompt += ` User design request: ${userDescription}`;
    }

    try {
        const IS_DEV = import.meta.env.DEV;
        
        // Define paths
        const TRIPO_BASE_URL = 'https://api.tripo3d.ai';
        const submitRoute = '/v2/openapi/task';
        
        let submitUrl = '';
        if (IS_DEV) {
            submitUrl = '/tripo-api' + submitRoute;
        } else {
            submitUrl = 'https://corsproxy.io/?' + encodeURIComponent(TRIPO_BASE_URL + submitRoute);
        }
        
        const requestPayload = {
            "type": "text_to_model",
            "prompt": systemPrompt
        };

        if (version) {
            requestPayload.model_version = version;
        }

        // 1. Submit the task
        const response = await fetch(submitUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });

        // Gracefully catch CloudFlare HTML blocks from proxies
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            throw new Error(`Proxy Intercepted Request: The CORS proxy returned an HTML challenge instead of JSON data. Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.code !== 0) {
            throw new Error(`Tripo API Error: ${data.message || 'Failed to submit task'}`);
        }

        const taskId = data.data.task_id;
        
        // 2. Poll for completion (Tripo usually takes 10-15s for draft models)
        let status = 'queued';
        while (status === 'queued' || status === 'running') {
            // Wait 2.5 seconds between polls
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            let pollUrl = '';
            if (IS_DEV) {
                pollUrl = `/tripo-api/v2/openapi/task/${taskId}`;
            } else {
                pollUrl = 'https://corsproxy.io/?' + encodeURIComponent(`${TRIPO_BASE_URL}/v2/openapi/task/${taskId}`);
            }
            
            const pollResp = await fetch(pollUrl, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                }
            });
            
            const pollContentType = pollResp.headers.get('content-type');
            if (pollContentType && pollContentType.includes('text/html')) {
                throw new Error(`Proxy Polling Intercepted: The CORS proxy blocked the status check. Status: ${pollResp.status}`);
            }
            
            const pollData = await pollResp.json();
            
            if (pollData.code !== 0) {
                 throw new Error(`Tripo Polling Error: ${pollData.message}`);
            }

            status = pollData.data.status;
            
            if (status === 'success') {
                return pollData.data.result.pbr_model?.url || pollData.data.result.model?.url;
            }
            
            if (status === 'failed' || status === 'cancelled') {
                throw new Error("Tripo generation failed or was cancelled.");
            }
        }
    } catch (error) {
        console.error("3D Generation Error:", error);
        throw error;
    }
};
