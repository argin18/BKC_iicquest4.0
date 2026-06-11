from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websockets.connection_manager import manager
import json
import asyncio

router = APIRouter()

@router.websocket("/energy")
async def websocket_energy(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Receive any client messages if needed
            data = await websocket.receive_text()
            # In a real app, this would process client messages and broadcast updates from background tasks
    except WebSocketDisconnect:
        await manager.disconnect(websocket)

@router.websocket("/devices")
async def websocket_devices(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)

@router.websocket("/analytics")
async def websocket_analytics(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
