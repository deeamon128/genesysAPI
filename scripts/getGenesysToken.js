console.log('Client ID:', process.env.GENESYS_CLIENT_ID);
console.log('Client Secret:', process.env.GENESYS_CLIENT_SECRET ? '****' : 'Missing');

export async function getGenesysAccessToken() {

    const clientId = process.env.GENESYS_CLIENT_ID;
    const clientSecret = process.env.GENESYS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing GENESYS_CLIENT_ID or GENESYS_CLIENT_SECRET');
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    console.log('Fetching Genesys access token...');
    console.log('Basic Auth:', basicAuth);
    const response = await fetch('https://login.euw2.pure.cloud/oauth/token', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
        const error = await response.text();
        console.error('Failed to get access token:', error);
        throw new Error('Token fetch failed');
    }

    const data = await response.json();
    return data.access_token;
}
