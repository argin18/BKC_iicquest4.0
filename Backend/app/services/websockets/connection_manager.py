"""
WebSocket connection manager.
- Thread-safe active connection tracking.
- Automatic removal of dead connections during broadcast.
- Prevents silent failures from stale sockets.
"""
import asyncio
from typing import Set

from fastapi import WebSocket
from app.core.logging import logger


class ConnectionManager:
    def __init__(self) -> None:
        self._active: Set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self._active.add(websocket)
        logger.info("ws_client_connected", total=len(self._active))

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            self._active.discard(websocket)
        logger.info("ws_client_disconnected", total=len(self._active))

    async def broadcast(self, message: str) -> None:
        """
        Broadcast to all live connections.
        Dead connections are silently removed; no exception propagates.
        """
        if not self._active:
            return

        dead: set[WebSocket] = set()

        async with self._lock:
            snapshot = set(self._active)

        for ws in snapshot:
            try:
                await ws.send_text(message)
            except Exception:
                dead.add(ws)

        if dead:
            async with self._lock:
                self._active -= dead
            logger.info("ws_dead_connections_removed", count=len(dead))

    @property
    def connection_count(self) -> int:
        return len(self._active)


manager = ConnectionManager()