import React, { useEffect, useState } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { containerStyle } from '../styles/styles';
import { ThemeToggleProps } from '../interfaces/ThemeToggleProps';
import { FilamentData } from '../interfaces/FilamentData';

const FilamentDryTimes: React.FC<ThemeToggleProps> = ({ isDarkMode, setIsDarkMode }) => {
    const [filamentData] = useState<FilamentData[]>([
        { material: 'PLA', temperature: '55°C (131°F)', time: '3h' },
        { material: 'ABS', temperature: '65°C (149°F)', time: '3h' },
        { material: 'PETG/CPE', temperature: '65°C (149°F)', time: '3h' },
        { material: 'NYLON', temperature: '75°C (167°F)', time: '12h' },
        { material: 'DESICCANT', temperature: '65°C (149°F)', time: '3h' },
        { material: 'PVA', temperature: '45°C (113°F)', time: '10h' },
        { material: 'TPU/TPE', temperature: '55°C (113°F)', time: '4h' },
        { material: 'ASA', temperature: '65°C (149°F)', time: '4h' },
        { material: 'PP', temperature: '55°C (131°F)', time: '6h' },
        { material: 'HIPS', temperature: '65°C (149°F)', time: '4h' },
        { material: 'PC', temperature: '75°C (167°F)', time: '6h' },
        { material: 'PEEK', temperature: '75°C (167°F)', time: '6h' }
    ]);

    const [selectedMaterial, setSelectedMaterial] = useState<string>('all');

    const handleMaterialChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMaterial(event.target.value);
    };

    // Extract unique materials dynamically
    const uniqueMaterials = Array.from(new Set(filamentData.map(data => data.material)));

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode, setIsDarkMode]);

    return (
        <Container className="flex" style={containerStyle}>
            <Row>
                <Col xs={12}>
                    <Form.Select id="materialFilter" onChange={handleMaterialChange}>
                        <option value="all">Select a Material</option>
                        {uniqueMaterials.map((material, index) => (
                            <option key={index} value={material}>
                                {material}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            <Table striped bordered hover responsive className="text-center mt-4">
                <thead>
                    <tr>
                        <th>Material(s)</th>
                        <th>Temperature</th>
                        <th>Minimum Time</th>
                    </tr>
                </thead>
                <tbody>
                    {filamentData
                        .filter((data) => selectedMaterial === 'all' || data.material === selectedMaterial)
                        .map((data, index) => (
                            <tr key={index}>
                                <td>{data.material}</td>
                                <td>{data.temperature}</td>
                                <td>{data.time}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default FilamentDryTimes;
