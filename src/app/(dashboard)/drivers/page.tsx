"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Button, Spin, Typography, Card, Row, Col, Divider } from "antd";
import { SearchOutlined, CarOutlined } from "@ant-design/icons";
import { isValidYear } from "@/app/utils/yearValidation";

const { Text } = Typography;

const Drivers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearSearchQuery, setYearSearchQuery] = useState("");

  const handleSearch = useCallback(async (queryToSearch?: string, yearToSearch?: string) => {
    try {
      const currentNameQuery = queryToSearch !== undefined ? queryToSearch : searchQuery;
      const currentYearQuery = yearToSearch !== undefined ? yearToSearch : yearSearchQuery;

      if (!currentNameQuery && !currentYearQuery) {
        setError("Por favor, introduce un nombre o un año para buscar.");
        setDrivers([]);
        return;
      }

      setError(null);
      setLoading(true);
      setDrivers([]);

      let response;
      let data;

      if (isValidYear(currentYearQuery)) {
        response = await fetch(`https://f1api.dev/api/${currentYearQuery.trim()}/drivers`);
        if (!response.ok) {
          throw new Error(`Error al buscar por año: ${response.statusText}`);
        }
        data = await response.json();
        setDrivers(data.drivers || []);
      } else if (currentNameQuery.trim().length >= 4) {
        response = await fetch(`https://f1api.dev/api/drivers/search?q=${encodeURIComponent(currentNameQuery.trim())}`);
        if (!response.ok) {
          throw new Error(`Error al buscar por nombre: ${response.statusText}`);
        }
        data = await response.json();
        setDrivers(data.drivers || []);
      } else {
        if (currentNameQuery.trim().length > 0 && currentNameQuery.trim().length < 4) {
          setError("Por favor, introduce al menos 4 caracteres para buscar por nombre.");
        } else if (currentYearQuery.trim().length > 0 && !isValidYear) {
          setError("Por favor, introduce un año válido entre 1950 y 2024.");
        }
        setDrivers([]);
        return;
      }

    } catch (err) {
      console.error("Error fetching drivers:", err);
      setError("No se pudieron cargar los pilotos. Inténtalo de nuevo más tarde.");
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, yearSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newQuery = e?.target?.value || "";
      setSearchQuery(newQuery);
      if (newQuery.trim().length <= 3 && (drivers.length > 0 || error)) {
        setDrivers([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error in name input onChange:", err);
      setError("Error al procesar la búsqueda por nombre.");
    }
  };

  const handleYearSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newYearQuery = e?.target?.value || "";
      setYearSearchQuery(newYearQuery);
      if (!isValidYear(newYearQuery) && (drivers.length > 0 || error)) {
        setDrivers([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error in year input onChange:", err);
      setError("Error al procesar el año ingresado.");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 3) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isValidYear(yearSearchQuery)) {
        handleSearch(undefined, yearSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [yearSearchQuery, handleSearch]);

  return (
    <main className="main-content">
      <h1 className="title-main">Buscador de Pilotos de F1</h1>
      <div className="page-content">
        <div className="search-container">
        <Input
          placeholder="Buscar piloto por nombre (ej: Hamilton)"
          value={searchQuery}
          onChange={handleSearchChange}
          onPressEnter={() => handleSearch(searchQuery, undefined)}
          size="large"
          suffix={
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(searchQuery)}
              loading={loading}
              size="large"
              className="bg-blue-500 hover:bg-blue-700 border-none"
            />
          }
        />
        <Input
          placeholder="Buscar piloto por año (ej: 2021)"
          value={yearSearchQuery}
          onChange={handleYearSearchChange}
          onPressEnter={() => handleSearch(undefined, yearSearchQuery)}
          size="large"
          type="number"
          suffix={
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => handleSearch(undefined, yearSearchQuery)}
              loading={loading}
              size="large"
              className="bg-blue-500 hover:bg-blue-700 border-none"
            />
          }
        />
        </div>
        {error && <Text type="danger" className="error-message mb-4">{error}</Text>}
        {loading && <Spin size="large" tip="Cargando pilotos..." fullscreen />}
        {!loading && !error && (drivers.length > 0 ? (
          <div className="drivers-container">
          <Row gutter={[16, 16]} justify="center">
            {drivers.map((driver: any) => (
              <Col key={driver.driverId} xs={54} sm={12} md={8} lg={6}>
                <Card
                  title={
                    <span className="card-title-icon">
                      <CarOutlined />
                      {`${driver.name} ${driver.surname}`}
                    </span>
                  }
                  bordered={false}
                  hoverable
                  className="driver-card h-full flex flex-col"
                >
                  <p className="text-gray-700"><strong>Nacionalidad:</strong> {driver.nationality}</p>
                  {driver.birthday && <p className="text-gray-700"><strong>Cumpleaños:</strong> {driver.birthday}</p>}
                  {driver.number && <p className="text-gray-700"><strong>Número:</strong> {driver.number}</p>}
                  <div className="mt-auto pt-4">
                    <a href={driver.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Más Info
                    </a>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          </div>
        ) : ( searchQuery.trim() && !loading && !error && yearSearchQuery.trim() && !isValidYear(yearSearchQuery) ? (
          <Text type="secondary">No se encontraron pilotos que coincidan con la búsqueda.</Text>
        ) : (
          <Text type="secondary">Introduce un nombre de piloto (al menos 4 caracteres) o un año (4 dígitos) para buscar.</Text>
        )
        ))}
      </div>
    </main>
  );
};

export default Drivers;
