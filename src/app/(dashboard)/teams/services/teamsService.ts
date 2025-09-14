interface Team {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: number;
  constructorsChampionships: number;
  driversChampionships: number;
  url: string;
}

export const fetchTeams = async (): Promise<Team[]> => {
  try {
    const response = await fetch('/api/teams');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Team[] = await response.json();
    return data;
  } catch (e: unknown) {
    console.error("Error fetching teams:", e);
    throw e;
  }
};
