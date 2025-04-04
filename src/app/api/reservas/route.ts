import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwm6TA_nQC0IzAihPsO9R4WTXiyByjnTG53q6Ushf5-jJ9uX9F-NoAv9tHaBidz1eqfeg/exec');
        if (!response.ok) {
            throw new Error(`Error al obtener datos: ${response.statusText}`);
        }
        const data = await response.json();

        // Filtrar eventos vacíos y transformar fechas
        const fechasReservadas = data
            .filter((evento: any) => evento.FECHA && evento.TIENDA)
            .map((evento: any) => ({
                fecha: new Date(evento.FECHA).toISOString().split('T')[0], // Formato 'YYYY-MM-DD'
                tienda: evento.TIENDA,
                observacion: evento.OBSERVACION,
            }));

        return NextResponse.json({ fechasReservadas });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        return NextResponse.json({ error: 'Error al obtener las reservas' }, { status: 500 });
    }
}
