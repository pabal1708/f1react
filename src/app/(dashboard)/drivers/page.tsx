"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Button, Spin, Typography, Card, Row, Col, Divider } from "antd";
import { SearchOutlined, CarOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function Drivers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearSearchQuery, setYearSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (queryToSearch?: string, yearToSearch?: string) => {
    // Prevenir múltiples búsquedas simultáneas
    if (isSearching) {
      return;
    }

    try {
      const currentNameQuery = queryToSearch !== undefined ? queryToSearch : searchQuery;
      const currentYearQuery = yearToSearch !== undefined ? yearToSearch : yearSearchQuery;

      // Validar inputs
      if (!currentNameQuery && !currentYearQuery) {
        setError("Por favor, introduce un nombre o un año para buscar.");
        setDrivers([]);
        return;
      }

      setIsSearching(true);
      setError(null);
      setLoading(true);
      setDrivers([]);

      let response;
      let data;

      // Validar año con rango
      const yearNum = parseInt(currentYearQuery.trim(), 10);
      const isValidYear = currentYearQuery.trim().length === 4 && 
                         /^[0-9]{4}$/.test(currentYearQuery.trim()) && 
                         !isNaN(yearNum) &&
                         yearNum >= 1950 && 
                         yearNum <= 2024;

      if (isValidYear) {
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
      setIsSearching(false);
    }
  }, [searchQuery, yearSearchQuery, isSearching]);

  // Debouncing para búsqueda por nombre
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 3) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  // Debouncing para búsqueda por año
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const yearNum = parseInt(yearSearchQuery.trim(), 10);
      const isValidYear = yearSearchQuery.trim().length === 4 && 
                         /^[0-9]{4}$/.test(yearSearchQuery.trim()) && 
                         !isNaN(yearNum) &&
                         yearNum >= 1950 && 
                         yearNum <= 2024;
      
      if (isValidYear) {
        handleSearch(undefined, yearSearchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [yearSearchQuery, handleSearch]);

  return (
    <main className="main-content">
      <h1 className="text-4xl font-bold mb-8 text-center">Buscador de Pilotos de F1</h1>
      <div className="search-container">
        <Input
          placeholder="Buscar piloto por nombre..."
          value={searchQuery}
          onChange={(e) => {
            try {
              const newQuery = e?.target?.value || "";
              setSearchQuery(newQuery);
              
              // Limpiar resultados si la búsqueda es muy corta
              if (newQuery.trim().length <= 3 && (drivers.length > 0 || error)) {
                setDrivers([]);
                setError(null);
              }
            } catch (err) {
              console.error("Error in name input onChange:", err);
              setError("Error al procesar la búsqueda por nombre.");
            }
          }}
          onPressEnter={() => handleSearch(searchQuery)}
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
          placeholder="Buscar piloto por año (ej: 2010)"
          value={yearSearchQuery}
          onChange={(e) => {
            try {
              const newYearQuery = e?.target?.value || "";
              setYearSearchQuery(newYearQuery);
              
              // Limpiar resultados si el año no es válido
              const yearNum = parseInt(newYearQuery, 10);
              const isValidYear = newYearQuery.trim().length === 4 && 
                                /^[0-9]{4}$/.test(newYearQuery) && 
                                !isNaN(yearNum) &&
                                yearNum >= 1950 && 
                                yearNum <= 2024;
              
              if (!isValidYear && (drivers.length > 0 || error)) {
                setDrivers([]);
                setError(null);
              }
            } catch (err) {
              console.error("Error in year input onChange:", err);
              setError("Error al procesar la búsqueda por año.");
            }
          }}
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
                    <span className="flex items-center gap-2">
                      <CarOutlined />
                      {`${driver.name} ${driver.surname}`}
                    </span>
                  }
                  bordered={false}
                  hoverable
                  className="driver-card h-full flex flex-col"
                >
                  <Divider className="my-2" />
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
      ) : ( searchQuery.trim() && !loading && !error && yearSearchQuery.trim() && !/^[0-9]{4}$/.test(yearSearchQuery) ? (
        <Text type="secondary">No se encontraron pilotos que coincidan con la búsqueda.</Text>
      ) : (
        <Text type="secondary">Introduce un nombre de piloto (al menos 4 caracteres) o un año (4 dígitos) para buscar.</Text>
      )
      ))}
    </main>
  );
}
