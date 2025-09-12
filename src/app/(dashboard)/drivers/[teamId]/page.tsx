import DriversClientComponent from "./DriversClientComponent";

interface Driver {
  driverId: string;
  name: string;
  surname: string;
  nationality: string;
  birthday?: string;
  number?: number;
  url: string;
  teamId: string;
}

interface DriversByTeamProps {
  params: Promise<{
    teamId: string;
  }>;
}

export default async function DriversByTeam({ params }: DriversByTeamProps) {
  const { teamId } = await params;
  let drivers: Driver[] = [];
  let loading = true;
  let error: string | null = null;

  try {
    const response = await fetch("https://f1api.dev/api/current/drivers");
    if (!response.ok) {
      throw new Error(`Error al cargar los pilotos: ${response.statusText}`);
    }
    const data = await response.json();
    const allDrivers: Driver[] = data.drivers || [];

    drivers = allDrivers.filter((driver) => driver.teamId === teamId);
  } catch (err: any) {
    console.error("Error fetching drivers by team:", err);
    error = "No se pudieron cargar los pilotos para este equipo. Inténtalo de nuevo más tarde.";
  } finally {
    loading = false;
  }

  return (
    <DriversClientComponent
      drivers={drivers}
      loading={loading}
      error={error}
      teamId={teamId}
    />
  );
}
