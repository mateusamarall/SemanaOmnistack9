import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';
import api from '../../services/api';
import './style.css';
export default function Dashboard() {
	const [spots, setSpots] = useState([]);
	const [requests, setRequests] = useState([]);

	const user_id = localStorage.getItem('user');
	const socket = useMemo(
		() =>
			socketio('http://youriphere:3333', {
				query: { user_id }
			}),
		[user_id]
	);
	useEffect(() => {
		socket.on('booking_request', (data) => {
			setRequests([...requests, data]);
		});
	}, [requests, socket]);
	useEffect(() => {
		async function loadSpots() {
			const user_id = localStorage.getItem('user');
			const response = await api.get('/dashboard/', {
				headers: { user_id }
			});

			setSpots(response.data);
		}
		loadSpots();
	}, []);
	async function handleAccepted(id) {
		await api.post(`/bookings/${id}/approval`);
		setRequests(requests.filter((request) => request._id !== id));
	}
	async function handleRejected(id) {
		await api.post(`/bookings/${id}/rejection`);
		setRequests(requests.filter((request) => request._id !== id));
	}
	return (
		<>
			<ul className='notifications'>
				{requests.map((request) => (
					<li key={request._id}>
						<p>
							<strong>{request.user.email}</strong> está solicitando uma reserva
							em <strong>{request.spot.company}</strong> para a data:{' '}
							<strong>{request.date}</strong>
						</p>
						<button
							className='accepted'
							onClick={() => handleAccepted(request._id)}
						>
							ACEITAR
						</button>
						<button
							className='rejected'
							onClick={() => handleRejected(request._id)}
						>
							REJEITAR
						</button>
					</li>
				))}
			</ul>
			<ul className='spot-list'>
				{spots.map((spot) => (
					<li key={spot._id}>
						<header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
						<strong>{spot.company}</strong>
						<span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
					</li>
				))}
			</ul>
			<Link to='/new'>
				<button className='btn'>Cadastrar novo Spot</button>
			</Link>
		</>
	);
}
