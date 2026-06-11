"""
Energy simulator — broadcasts realistic mock readings via WebSocket.
Runs as a background asyncio task; gracefully handles errors.
"""
import asyncio
import json
import random
from datetime import datetime, timezone

from app.services.websockets.connection_manager import manager
from app.core.logging import logger

_BROADCAST_INTERVAL = 5  # seconds


class EnergySimulator:
    def __init__(self) -> None:
        self._task: asyncio.Task | None = None

    async def start(self) -> None:
        if self._task and not self._task.done():
            return  # already running
        self._task = asyncio.create_task(self._run_loop())
        logger.info("energy_simulator_started")

    def stop(self) -> None:
        if self._task:
            self._task.cancel()
        logger.info("energy_simulator_stopped")

    async def _run_loop(self) -> None:
        while True:
            try:
                if manager.connection_count > 0:
                    reading = {
                        "timestamp": datetime.now(timezone.utc).isoformat(),
                        "total_consumption": round(random.uniform(2000, 2500), 2),
                        "solar_generation": round(random.uniform(0, 500), 2),
                        "active_devices": random.randint(9, 12),
                    }
                    await manager.broadcast(
                        json.dumps({"type": "energy_update", "data": reading})
                    )
            except Exception as exc:
                logger.error("simulator_broadcast_error", error=str(exc))

            await asyncio.sleep(_BROADCAST_INTERVAL)


simulator = EnergySimulator()