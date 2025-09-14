"use client";

import { Card, Col, Row, Spin, Typography, Divider } from "antd";
import { CarOutlined } from "@ant-design/icons";
import React from "react";

const { Text } = Typography;

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

interface DriversClientComponentProps {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  teamId: string;
}

const DriversClientComponent = ({
  drivers,
  loading,
  error,
  teamId,
}: DriversClientComponentProps) => {
  if (loading) {
    return (
      <main className="main-content">
        <Spin size="large" tip="Cargando pilotos..." fullscreen />
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content">
        <Text type="danger" className="error-message">
          {error}
        </Text>
      </main>
    );
  }

  return (
    <main className="main-content">
      <h1 className="title-main">{`Pilotos de ${teamId}`}</h1>
      {drivers.length > 0 ? (
        <div className="page-content">
          <Row gutter={[16, 16]} justify="center">
            {drivers.map((driver) => (
              <Col key={driver.driverId} xs={24} sm={12} md={8} lg={6}>
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
                  <p className="text-gray-700">
                    <strong>Nacionalidad:</strong> {driver.nationality}
                  </p>
                  {driver.birthday && (
                    <p className="text-gray-700">
                      <strong>Cumpleaños:</strong> {driver.birthday}
                    </p>
                  )}
                  {driver.number && (
                    <p className="text-gray-700">
                      <strong>Número:</strong> {driver.number}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    <Typography.Link
                      href={driver.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Más Info
                    </Typography.Link>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <Text type="secondary">No se encontraron pilotos para este equipo.</Text>
      )}
    </main>
  );
};

export default DriversClientComponent;
