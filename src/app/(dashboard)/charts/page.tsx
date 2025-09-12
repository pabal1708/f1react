"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Button, Spin, Typography, Card, Row, Col, Divider } from "antd";
import { SearchOutlined, TrophyOutlined, CarOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Text, Title } = Typography;

interface DriverChampionshipData {
  driverId: string;
  driver: {
    name: string;
    surname: string;
    shortName: string;
  };
  points: number;
  position: number;
  wins: number;
}

interface ConstructorChampionshipData {
  teamId: string;
  team: {
    teamName: string;
  };
  points: number;
  position: number;
  wins: number;
}

export default function ChartsPage() {
  const [year, setYear] = useState<string>("");
  const [driversChampionship, setDriversChampionship] = useState<
    DriverChampionshipData[]
  >([]);
  const [constructorsChampionship, setConstructorsChampionship] = useState<
    ConstructorChampionshipData[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleFetchChampionships = useCallback(async (yearToFetch: string) => {
    // Prevenir múltiples búsquedas simultáneas
    if (isFetching) {
      return;
    }

    // Validación mejorada del año
    if (!yearToFetch || typeof yearToFetch !== 'string') {
      setError("Por favor, introduce un año válido.");
      setDriversChampionship([]);
      setConstructorsChampionship([]);
      return;
    }

    const yearNum = parseInt(yearToFetch.trim(), 10);
    if (!yearToFetch.trim() || 
        !/^[0-9]{4}$/.test(yearToFetch.trim()) || 
        isNaN(yearNum) || 
        yearNum < 1950 || 
        yearNum > 2024) {
      setError("Por favor, introduce un año válido entre 1950 y 2024.");
      setDriversChampionship([]);
      setConstructorsChampionship([]);
      return;
    }

    setIsFetching(true);
    setError(null);
    setLoading(true);
    setDriversChampionship([]);
    setConstructorsChampionship([]);

    try {
      const driversResponse = await fetch(
        `https://f1api.dev/api/${yearToFetch}/drivers-championship`
      );
      if (!driversResponse.ok) {
        throw new Error(
          `Error al cargar el campeonato de pilotos para ${yearToFetch}: ${driversResponse.statusText}`
        );
      }
      const driversData = await driversResponse.json();
      setDriversChampionship(
        (driversData.drivers_championship || []).slice(0, 5)
      );

      const constructorsResponse = await fetch(
        `https://f1api.dev/api/${yearToFetch}/constructors-championship`
      );
      if (!constructorsResponse.ok) {
        throw new Error(
          `Error al cargar el campeonato de constructores para ${yearToFetch}: ${constructorsResponse.statusText}`
        );
      }
      const constructorsData = await constructorsResponse.json();
      setConstructorsChampionship(
        (constructorsData.constructors_championship || []).slice(0, 5)
      );
    } catch (err: any) {
      console.error("Error fetching championship data:", err);
      setError("No se pudieron cargar los datos del campeonato. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [isFetching]);

  // Debouncing para búsqueda por año
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const yearNum = parseInt(year.trim(), 10);
      const isValidYear = year.trim().length === 4 && 
                         /^[0-9]{4}$/.test(year.trim()) && 
                         !isNaN(yearNum) &&
                         yearNum >= 1950 && 
                         yearNum <= 2024;
      
      if (isValidYear) {
        handleFetchChampionships(year);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [year, handleFetchChampionships]);

  return (
    <main className="main-content">
      <Title level={2} className="title-main text-center mb-8">
        Visualización de Campeonatos de F1 por Año
      </Title>

      <div className="w-full max-w-md mb-8 flex gap-2">
        <Input
          placeholder="Introduce un año (ej: 2021)"
          value={year}
          onChange={(e) => {
            try {
              const newYear = e?.target?.value || "";
              setYear(newYear);
              
              // Limpiar resultados si el año no es válido
              const yearNum = parseInt(newYear, 10);
              const isValidYear = newYear.trim().length === 4 && 
                                /^[0-9]{4}$/.test(newYear) && 
                                !isNaN(yearNum) &&
                                yearNum >= 1950 && 
                                yearNum <= 2024;
              
              if (!isValidYear && (
                driversChampionship.length > 0 ||
                constructorsChampionship.length > 0 ||
                error
              )) {
                setDriversChampionship([]);
                setConstructorsChampionship([]);
                setError(null);
              }
            } catch (err) {
              console.error("Error in year input onChange:", err);
              setError("Error al procesar el año ingresado.");
            }
          }}
          onPressEnter={() => handleFetchChampionships(year)}
          size="large"
          type="number"
          suffix={
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleFetchChampionships(year)}
              loading={loading}
              size="large"
              className="bg-blue-500 hover:bg-blue-700 border-none"
            />
          }
        />
      </div>

      {error && (
        <Text type="danger" className="error-message mb-4">
          {error}
        </Text>
      )}


      {loading && <Spin size="large" tip="Cargando campeonatos..." fullscreen />}

      {!loading && !error && (
        <Row gutter={[16, 16]} justify="center" className="w-full max-w-6xl">
          {driversChampionship.length > 0 && (
            <Col xs={24} md={12}>
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <TrophyOutlined />
                    Top 5 Pilotos - {year}
                  </span>
                }
                bordered={false}
                className="h-full shadow-md rounded-lg"
              >
                <Divider className="my-2" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={driversChampionship.map((d) => ({
                      name: `${d.driver.name} ${d.driver.surname}`,
                      points: d.points,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          )}

          {constructorsChampionship.length > 0 && (
            <Col xs={24} md={12}>
              <Card
                title={
                  <span className="flex items-center gap-2">
                    <CarOutlined />
                    Top 5 Constructores - {year}
                  </span>
                }
                bordered={false}
                className="h-full shadow-md rounded-lg"
              >
                <Divider className="my-2" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={constructorsChampionship.map((c) => ({
                      name: c.team.teamName,
                      points: c.points,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="points" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          )}

          {driversChampionship.length === 0 &&
            constructorsChampionship.length === 0 &&
            year.trim().length === 4 &&
            !loading &&
            !error && (
              <Text type="secondary">
                No se encontraron datos de campeonato para el año {year}.
              </Text>
            )}
            {driversChampionship.length === 0 &&
            constructorsChampionship.length === 0 &&
            year.trim().length === 0 &&
            !loading &&
            !error && (
              <Text type="secondary">
                Introduce un año para ver los campeonatos.
              </Text>
            )}
        </Row>
      )}
    </main>
  );
}
