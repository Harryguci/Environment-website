import { memo } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

function WeatherInfo({ weatherData }) {
    return (
        <ListGroup>
            <ListGroupItem >
                Tỉnh / Thành phố:
                <b className="mx-2">{weatherData.name || "~"}</b>
            </ListGroupItem>
            <ListGroupItem>
                Nhiệt độ:
                <b className="mx-2">
                    {(weatherData.main && weatherData.main.temp) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Cảm giác như:
                <b className="mx-2">
                    {(weatherData.main && weatherData.main.feels_like) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Nhiệt độ cao nhất:
                <b className="mx-2">
                    {(weatherData.main && weatherData.main.temp_max) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Nhiệt độ thấp nhất:
                <b className="mx-2">
                    {(weatherData.main && weatherData.main.temp_min) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Độ ẩm:
                <b className="mx-2">
                    {(weatherData.main && weatherData.main.humidity) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Tốc độ gió:
                <b className="mx-2">
                    {(weatherData.wind && weatherData.wind.speed) || "~"}
                </b>
            </ListGroupItem>
            <ListGroupItem>
                Lượng mưa:
                <b className="mx-2">
                    {(weatherData.rain && weatherData.rain["1h"]) || "~"}
                </b>
            </ListGroupItem>
        </ListGroup>
    )
}

export default memo(WeatherInfo);
