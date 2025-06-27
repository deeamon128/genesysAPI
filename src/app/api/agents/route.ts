import { NextResponse } from 'next/server';

export async function GET() {
    const mockData = {
        availableAgents: 5,
        queueName: "Support Queue"
    };

    return NextResponse.json(mockData);
}