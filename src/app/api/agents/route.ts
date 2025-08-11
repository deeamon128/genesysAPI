export async function GET() {
  console.log('Fetching Genesys agents...');

  try {
    const accessToken = process.env.GENESYS_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error('Missing access token from environment');
    }

    const response = await fetch('https://api.euw2.pure.cloud/api/v2/routing/queues/8231bf80-a969-4edf-a146-088d5b63b397/users?routingStatus=INTERACTING', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Genesys API Error:", {
        status: response.status,
        errorText
      });
      return new Response(
        JSON.stringify({
          error: `Genesys API returned status ${response.status}`,
          details: errorText,
        }),
        { status: 500 }
      );
    }


    const data = await response.json();
    console.log('Genesys API response:', data);

    const availableAgents = Array.isArray(data.entities) ? data.entities.length : 0;


    return new Response(JSON.stringify({ availableAgents }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Debug': 'Genesys API hit',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching Genesys API:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return new Response(JSON.stringify({ error: 'Unknown error occurred' }), { status: 500 });
    }
  }
}
