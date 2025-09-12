"use client";
import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import { TeamOutlined } from "@ant-design/icons";
import { fetchTeams } from './services/teamsService';
import Link from 'next/link';

interface Team {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: number;
  constructorsChampionships: number;
  driversChampionships: number;
  url: string;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getTeams = async () => {
      try {
        const fetchedTeams = await fetchTeams();
        setTeams(fetchedTeams);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    getTeams();
  }, []);

  if (loading) {
    return <Spin size="large" tip="Loading Teams..." fullscreen />;
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="error-message">Error: {error}</p>
      </main>
    );
  }

  return (
    <main className="main-content">
      <h1 className="title-main">Formula 1 Teams</h1>
      <div className="page-content">
        <Row gutter={[16, 16]} justify="center">
          {teams.map((team) => (
            <Col key={team.teamId} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={
                  <span className="card-title-icon">
                    <TeamOutlined />
                    {team.teamName}
                  </span>
                }
                bordered={false}
                hoverable
                className="team-card h-full flex flex-col"
              >
                <p className="text-gray-700"><strong>Nacionalidad:</strong> {team.teamNationality}</p>
                <p className="text-gray-700"><strong>Primera Aparición:</strong> {team.firstAppeareance}</p>
                <p className="text-gray-700"><strong>Campeonatos de Constructores:</strong> {team.constructorsChampionships}</p>
                <p className="text-gray-700"><strong>Campeonatos de Pilotos:</strong> {team.driversChampionships}</p>
                <div className="mt-auto flex justify-between card-actions">
                  <Typography.Link href={team.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Más Info
                  </Typography.Link>
                  <Link href={`/drivers/${team.teamId}`} className="text-blue-600 hover:underline">
                    Ver Pilotos
                  </Link>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </main>
  );
}

export default Teams;
