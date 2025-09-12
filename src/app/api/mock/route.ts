import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Este es un mock de tu endpoint de API',
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ],
  });
}
