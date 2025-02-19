import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient

from apps.attendee.routers import router as attendee_router
from apps.auth.routers import router as auth_router
from apps.host.routers import router as host_router
from config import settings

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://react:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

app.mongodb_client = AsyncIOMotorClient(settings.DB_URL)
app.mongodb = app.mongodb_client[settings.DB_NAME]

app.include_router(auth_router, tags=["auth"], prefix="/auth")
app.include_router(attendee_router, tags=["attendee"], prefix="/attendee")
app.include_router(host_router, tags=["host"], prefix="/host")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
    )
