import { getGenesysAccessToken } from '../../../../scripts/getGenesysToken';

// Define TypeScript interfaces for the API response
interface Stats {
  count: number;
}

interface ObservationData {
  metric: string;
  qualifier: string;
  stats: Stats;
}

interface ResultGroup {
  queueId: string;
}

interface ObservationResult {
  group: ResultGroup;
  data: ObservationData[];
}

interface AnalyticsResponse {
  results: ObservationResult[];
}

export async function GET() {
  console.log('Fetching Genesys queue analytics...');

  try {
    const accessToken = await getGenesysAccessToken();

    if (!accessToken) {
      throw new Error('Missing access token from environment');
    }

    const queueId = '8231bf80-a969-4edf-a146-088d5b63b397';

    const body = {
      filter: {
        type: "or",
        clauses: [
          {
            type: "or",
            predicates: [
              {
                type: "dimension",
                dimension: "queueId",
                operator: "matches",
                value: queueId
              }
            ]
          }
        ]
      },
      metrics: ["oOnQueueUsers"]
    };

    const response = await fetch(
      'https://api.euw2.pure.cloud/api/v2/analytics/queues/observations/query',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      }
    );

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

    const data: AnalyticsResponse = await response.json();
    console.log('Genesys Analytics response:', data);

    // Extract IDLE count safely
    const idleMetric = data?.results?.[0]?.data?.find(
      (d: ObservationData) => d.qualifier === 'IDLE'
    );
    const availableAgents = idleMetric?.stats?.count ?? 0;

    return new Response(
      JSON.stringify({ availableAgents }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Debug': 'Genesys Analytics API hit',
        },
      }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching Genesys Analytics API:', error.message);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return new Response(JSON.stringify({ error: 'Unknown error occurred' }), { status: 500 });
    }
  }
}
