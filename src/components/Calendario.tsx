"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Modal from "./modal";
import { EVENTO_RESERVADO } from "@/app/api/reservas/route";
import { EventClickArg, EventHoveringArg } from "@fullcalendar/core/index.js";

export type Evento = {
  title: string;
  date: string;
  backgroundColor?: string;
  extendedProps: {
    observacion: string;
  };
};

const Calendario: React.FC = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<Evento | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch("/api/reservas");
        if (!res.ok) {
          throw new Error(`Error al obtener eventos: ${res.statusText}`);
        }
        const data = await res.json();

        const eventosTransformados = data.fechasReservadas.map(
          (fecha: EVENTO_RESERVADO) => ({
            title: fecha.tienda,
            date: fecha.fecha,
            backgroundColor: "gray",
            extendedProps: {
              observacion: fecha.observacion || "Sin observación",
            },
          })
        );

        setEventos(eventosTransformados);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventos();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setEventoSeleccionado({
      title: clickInfo.event.title || "",
      date: clickInfo.event.start?.toISOString() || "",
      backgroundColor: clickInfo.event.backgroundColor || undefined,
      extendedProps: {
        observacion:
          clickInfo.event.extendedProps?.observacion || "Sin observación",
      },
    });
    setIsModalOpen(true);
  };

  const handleEventMouseEnter = (mouseEnterInfo: EventHoveringArg) => {
    mouseEnterInfo.el.style.cursor = "pointer";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEventoSeleccionado(null);
  };

  return (
    <div
      className="max-w-5xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-6"
      id="calendario"
    >
      <h1 className="text-3xl font-bold mb-4 text-center text-pink-600">
        Calendario de Reservas 🛒
      </h1>
      {isLoading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={eventos}
          eventClick={handleEventClick}
          eventMouseEnter={handleEventMouseEnter}
          height="auto"
          contentHeight="auto"
          aspectRatio={1.5}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "",
          }}
          eventContent={(arg) => {
            return (
              <div className="flex items-center gap-1 h-10">
                <span role="img" aria-label="feria">
                  🎉
                </span>
                <span>{arg.event.title}</span>
              </div>
            );
          }}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {eventoSeleccionado && (
          <div className="flex flex-col p-4 gap-4">
            <h2 className="text-xl font-bold">{eventoSeleccionado.title}</h2>
            <p className="text-gray-600">
              Fecha de Reserva:{" "}
              {new Date(eventoSeleccionado.date).toLocaleDateString()}
            </p>
            <p>{eventoSeleccionado.extendedProps.observacion}</p>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded 
                bg-pink-500 hover:bg-pink-600 transition duration-200 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Calendario;
