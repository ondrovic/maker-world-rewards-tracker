import React, { useState } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { FilamentData } from '../interfaces/FilamentData';

// Static data outside the component (no need for useState)
const FILAMENT_DATA: FilamentData[] = [
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
];

// Extract unique materials dynamically
const getUniqueMaterials = (data: FilamentData[]) => Array.from(new Set(data.map(d => d.material)));

// MaterialFilter component
interface MaterialFilterProps {
    materials: string[];
    selected: string;
    onChange: (value: string) => void;
}
const MaterialFilter: React.FC<MaterialFilterProps> = ({ materials, selected, onChange }) => (
    <Form.Select id="materialFilter" value={selected} onChange={e => onChange(e.target.value)}>
        <option value="all">Select a Material</option>
        {materials.map((material) => (
            <option key={material} value={material}>{material}</option>
        ))}
    </Form.Select>
);

// FilamentRow component
const FilamentRow: React.FC<FilamentData> = ({ material, temperature, time }) => (
    <tr>
        <td>{material}</td>
        <td>{temperature}</td>
        <td>{time}</td>
    </tr>
);

const FilamentDryTimes: React.FC = () => {
    const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
    const uniqueMaterials = getUniqueMaterials(FILAMENT_DATA);

    const filteredData =
        selectedMaterial === 'all'
            ? FILAMENT_DATA
            : FILAMENT_DATA.filter(d => d.material === selectedMaterial);

    return (
        <Container className="flex">
            <Row>
                <Col xs={12}>
                    <MaterialFilter
                        materials={uniqueMaterials}
                        selected={selectedMaterial}
                        onChange={setSelectedMaterial}
                    />
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
                    {filteredData.map((data, idx) => (
                        <FilamentRow key={data.material + idx} {...data} />
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default FilamentDryTimes;
