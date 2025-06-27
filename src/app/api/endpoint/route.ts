import { NextResponse } from 'next/server';

export async function GET() {
    const mockData = {
        queue: "Support Queue",
        availableAgents: Math.floor(Math.random() * 5) + 1 // returns 1 to 5 agents
    };

    return NextResponse.json(mockData);
}
