import { NextResponse } from 'next/server';

export async function GET() {
    const data = { availableAgents: 5 };

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  // Allow any origin - for testing only!
        },
    });
}