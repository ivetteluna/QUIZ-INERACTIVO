const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Solo procesa solicitudes POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  
  try {
    const { prompt, model } = JSON.parse(event.body);
    const apiKey = process.env.OPENAI_API_KEY; // Obtiene la clave de las variables de entorno de Netlify

    if (!apiKey) {
      throw new Error('La clave de API de OpenAI no está configurada.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error desde la API de OpenAI:', errorData);
        return {
            statusCode: response.status,
            body: JSON.stringify({ error: 'Hubo un error al comunicarse con la API de OpenAI.' })
        };
    }
    
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error en la función de Netlify:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno del servidor.' })
    };
  }
};